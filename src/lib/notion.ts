/* eslint-disable no-console */
import "~/lib/dayjs"

import dayjs from "dayjs"
import Parser from "rss-parser"

import { siteConfig } from "~/config/site"

import { getFeedInfoList } from "./unsafe"
import { isFeedItemValid, joinFeedItemUrl, timeout } from "./utils"

import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"

const { timeZone } = siteConfig

const notionToken = process.env["NOTION_TOKEN"] as string
export const feedId = process.env["NOTION_FEED_ID"] as string

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
  Authorization: `Bearer ${notionToken}`,
}

export async function getDatabaseItems(databaseId: string) {
  try {
    const response = (await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers,
      },
    ).then((i) => i.json())) as QueryDatabaseResponse

    if (response.results.length) return response.results
  } catch (e) {
    console.error("getDatabaseItemList", e)
  }
  return null
}

const parser = new Parser()

async function parseRssFeed(
  feedUrl?: string | undefined,
): Promise<Parser.Output<{ [key: string]: unknown }> | null> {
  if (!feedUrl) return null
  try {
    const feed = await timeout(3000, parser.parseURL(feedUrl))
    return feed
  } catch (e) {
    if (e instanceof Error) {
      if (
        e.message === "timeout" ||
        !e.message.includes("Non-whitespace before first tag.")
      ) {
        console.error(e.message, feedUrl)
        return null
      }
    }

    console.error("parseRssFeed", e)
  }
  return null
}

export async function getFilters(
  feedInfoListFromArg?: FeedInfoList,
  convertToLowerCase = true,
  includeAll = true,
) {
  const feedInfoList = feedInfoListFromArg ?? (await getFeedInfoList())
  if (!feedInfoList) return

  const typeFilter = Array.from(new Set(feedInfoList.map((i) => i.type))).sort()

  const languageFilter = Array.from(
    new Set(feedInfoList.map((i) => i.language)),
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

export async function getFeedList(
  feedInfoListFromArg?: FeedInfoList,
  type: string = "all",
  language: string = "all",
  enableAutoFilter = true,
) {
  console.log("start getFeedList at" + new Date().toISOString())
  console.time("getFeedList")
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
            .filter((j) => isFeedItemValid(j, i))
            .map((j) => {
              return {
                ...j,
                id: j["id"] as string | undefined,
                link: joinFeedItemUrl(
                  feed.feedUrl ? (feed.link as string) : i.url,
                  j.link,
                ),
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
        }),
    )

    const numberOfFeedSent = 100
    const numberOfAuthor = feedList.filter((i) => i.length > 0).length
    const maxNumberOfFeedSentPerAuthor = Math.floor(
      (numberOfFeedSent / numberOfAuthor) * 1.5,
    )

    // sort by published time
    const finalFeedList = enableAutoFilter
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
          .sort((a, b) => {
            if (a.isoDate && b.isoDate) {
              return (
                new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
              )
            }
            return 0
          })
          // max 100 feeds
          .slice(0, 100)

    console.timeEnd("getFeedList")
    return finalFeedList
  } catch (e) {
    console.error("getFeedList", e)
  }
  return null
}

export function getFeedListGroupedByYearAndMonth(feedListFromArg: FeedList) {
  return feedListFromArg.reduce<Record<string, FeedList>>((acc, feed) => {
    const feedYearWithMonth = dayjs(feed.isoDate).tz(timeZone).format("YYYY MM")
    if (!acc[feedYearWithMonth]) {
      acc[feedYearWithMonth] = []
    }
    acc[feedYearWithMonth]?.push(feed)
    return acc
  }, {})
}

export type FeedInfoList = NonNullable<
  Awaited<ReturnType<typeof getFeedInfoList>>
>
export type FeedInfo = FeedInfoList[number]
export type FeedItem = Parser.Item & {
  feedInfo: FeedInfo
} & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
export type FeedList = NonNullable<Awaited<ReturnType<typeof getFeedList>>>
