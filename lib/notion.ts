import "@/lib/dayjs"
import dayjs from "dayjs"

import { siteConfig } from "@/config/site"
import { isFeedItemValid, joinFeedItemUrl, timeout } from "@/lib/utils"
import {
	PageObjectResponse,
	QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints"
import Parser from "rss-parser"

const { timeZone } = siteConfig

const notionToken = process.env.NOTION_TOKEN!
const feedId = process.env.NOTION_FEED_ID!

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	"Notion-Version": "2022-06-28",
	Authorization: `Bearer ${notionToken}`,
}

const revalidate = 7200

async function getDatabaseItems(databaseId: string) {
	try {
		const response = (await fetch(
			`https://api.notion.com/v1/databases/${databaseId}/query`,
			{
				method: "POST",
				headers,
				next: {
					revalidate,
				},
			}
		).then((i) => i.json())) as QueryDatabaseResponse

		if (response.results) return response.results
	} catch (e) {
		console.error("getDatabaseItemList", e)
	}
}

const parser = new Parser()

async function parseRssFeed(
	feedUrl: string
): Promise<Parser.Output<{ [key: string]: any }> | undefined> {
	try {
		const feed = await timeout(5000, parser.parseURL(feedUrl))
		return feed
	} catch (e: any) {
		if (
			e.message === "timeout" ||
			!e.message.includes("Non-whitespace before first tag.")
		) {
			console.error(e.message, feedUrl)
			return
		}

		console.error("parseRssFeed", e)
	}
}

export async function getFeedInfoList() {
	const feedInfoListInDB = await getDatabaseItems(feedId)
	if (!feedInfoListInDB) return

	return feedInfoListInDB.map((i) => {
		const page = i as PageObjectResponse
		return {
			id: i.id,
			title: (page as any).properties.ID.title[0].plain_text,
			url: (page as any).properties.Homepage.url,
			feedUrl: (page as any).properties.RSS.url,
			avatar: (page.cover as any).external.url,
			type: (page as any).properties.Type.select.name as string,
			language: (page as any).properties.Language.select.name as string,
			useCover: (page as any).properties.UseCover.checkbox as boolean,
			twitter: (page as any).properties.Twitter.url as string | null,
			github: (page as any).properties.Github.url as string | null,
		}
	})
}

export async function getFilters(
	feedInfoListFromArg?: FeedInfoList,
	convertToLowerCase = true,
	includeAll = true
) {
	const feedInfoList = feedInfoListFromArg ?? (await getFeedInfoList())
	if (!feedInfoList) return

	const typeFilter = Array.from(new Set(feedInfoList.map((i) => i.type))).sort()

	const languageFilter = Array.from(
		new Set(feedInfoList.map((i) => i.language))
	).sort()

	if (convertToLowerCase) {
		typeFilter.forEach((i, index) => {
			typeFilter[index] = i.toLowerCase()
		})

		languageFilter.forEach((i, index) => {
			languageFilter[index] = i.toLowerCase()
		})
	}

	if (includeAll) {
		typeFilter.unshift(convertToLowerCase ? "all" : "All")
		languageFilter.unshift(convertToLowerCase ? "all" : "All")
	}

	return [typeFilter, languageFilter] as const
}

export async function getGithubTimeline() {
	const feedInfoList = await getFeedInfoList()
	if (!feedInfoList) return

	const githubFeedInfoList = feedInfoList
		.filter((i) => i.github)
		.map((i) => {
			return {
				...i,
				feedUrl: i.github + ".atom",
			}
		})
		.filter((i) => i.feedUrl.match(/https:\/\/github.com\/\w+.atom/g))

	// id: tag:github.com,2008:PushEvent/28747740914
	const res = await getFeedList(githubFeedInfoList, "all", "all", false)

	return res?.map((i) => {
		return {
			...i,
			feedInfo: {
				...i.feedInfo,
				type: i.id?.split("/")[0].split(":")[2].slice(0, -5) ?? "unknown",
			},
		}
	})
}

export async function getFeedList(
	feedInfoListFromArg?: FeedInfoList,
	type: string = "all",
	language: string = "all",
	enableAutoFilter = true
) {
	const feedInfoList = feedInfoListFromArg ?? (await getFeedInfoList())
	if (!feedInfoList) return
	try {
		const feedList = await Promise.all(
			feedInfoList
				.filter((i) => i.feedUrl)
				.map(async (i) => {
					const feed = await parseRssFeed(i.feedUrl)
					if (!feed) return []
					return feed.items
						.filter(isFeedItemValid)
						.map((j) => {
							return {
								...j,
								id: j.id as string | undefined,
								link: joinFeedItemUrl(feed.feedUrl ? feed.link : i.url, j.link),
								feedInfo: i,
							}
						})
						.filter((feed) => {
							if (
								type.toLowerCase() !== "all" &&
								feed.feedInfo.type.toLowerCase() !== type.toLowerCase()
							) {
								return false
							}
							if (
								language.toLowerCase() !== "all" &&
								feed.feedInfo.language.toLowerCase() !== language.toLowerCase()
							) {
								return false
							}
							return true
						})
						.sort((a, b) => {
							if (a.isoDate && b.isoDate) {
								return (
									new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
								)
							}
							return 0
						})
				})
		)

		const numberOfFeedSent = 100
		const numberOfAuthor = feedList.filter((i) => i.length > 0).length
		const maxNumberOfFeedSentPerAuthor = Math.floor(
			(numberOfFeedSent / numberOfAuthor) * 1.5
		)

		// sort by published time
		return enableAutoFilter
			? feedList
					.map((i) => {
						if (i.length > maxNumberOfFeedSentPerAuthor) {
							return i.slice(0, maxNumberOfFeedSentPerAuthor)
						}
						return i
					})
					.flat()
					.sort((a, b) => {
						if (a.isoDate && b.isoDate) {
							return (
								new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
							)
						}
						return 0
					})
					.slice(0, numberOfFeedSent)
			: feedList
					.flat()
					.filter((i) => {
						// only today's feed
						return dayjs(i.isoDate).tz(timeZone).isSame(dayjs(), "day")
					})
					.sort((a, b) => {
						if (a.isoDate && b.isoDate) {
							return (
								new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
							)
						}
						return 0
					})
					// max 200 feeds
					.slice(0, 200)
	} catch (e) {
		console.error("getFeedList", e)
	}
}

export function getFeedListGroupedByYearAndMonth(feedListFromArg: FeedList) {
	return feedListFromArg.reduce((acc, feed) => {
		const feedYearWithMonth = dayjs(feed.isoDate).tz(timeZone).format("YYYY MM")
		if (!acc[feedYearWithMonth]) {
			acc[feedYearWithMonth] = []
		}
		acc[feedYearWithMonth].push(feed)
		return acc
	}, {} as Record<string, FeedList>)
}

export type FeedInfoList = NonNullable<
	Awaited<ReturnType<typeof getFeedInfoList>>
>
export type FeedInfo = FeedInfoList[number]
export type FeedItem = Parser.Item & {
	feedInfo: FeedInfo
} & {
	[key: string]: any
}
export type FeedList = NonNullable<Awaited<ReturnType<typeof getFeedList>>>
