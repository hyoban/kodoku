import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import Parser from "rss-parser"

import { siteConfig } from "@/config/site"
import { isFeedItemValid, joinFeedItemUrl, timeout } from "@/lib/utils"

const { timeZone } = siteConfig

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(timeZone)

const notionToken = process.env.NOTION_TOKEN!
const feedId = process.env.NOTION_FEED_ID!

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
  Authorization: `Bearer ${notionToken}`,
}

const revalidate = 7200

export type FeedItem = Parser.Item & {
  feedInfo: {
    id: string
    title: string
    url: string
    feedUrl: string
    avatar: string
  }
}

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
    }
  })
}

export async function getFeedList() {
  const feedInfoList = await getFeedInfoList()
  if (!feedInfoList) return
  try {
    const feedList = await Promise.all(
      feedInfoList
        .filter((i) => i.feedUrl)
        .map(async (i) => {
          const feed = await parseRssFeed(i.feedUrl)
          if (!feed) return []
          return feed.items.filter(isFeedItemValid).map((j) => {
            return {
              ...j,
              link: joinFeedItemUrl(feed.feedUrl ? feed.link : i.url, j.link),
              type: i.type,
              author: i.title,
              homeUrl: i.url,
              language: i.language,
            }
          })
        })
    )

    // sort by published time
    return feedList.flat().sort((a, b) => {
      if (a.isoDate && b.isoDate) {
        return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
      }
      return 0
    })
  } catch (e) {
    console.error("getFeedList", e)
  }
}

export type FeedInfoList = NonNullable<
  Awaited<ReturnType<typeof getFeedInfoList>>
>
export type FeedList = NonNullable<Awaited<ReturnType<typeof getFeedList>>>
