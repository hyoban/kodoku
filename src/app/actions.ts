"use server"

import { addFeedInfo } from "~/lib/notion"
import { parseRssFeed } from "~/lib/rss"
import { getFeedInfoList } from "~/lib/unsafe"

import type { FeedInfoWithoutId } from "~/schema"

export async function parseFeedInfoAction(
  feedUrl: string,
): Promise<FeedInfoWithoutId> {
  const feed = await parseRssFeed(feedUrl)
  if (!feed) throw new Error("feed is null")
  return {
    title: feed.title ?? "",
    url: feed.link ?? "",
    feedUrl,
    socials: [],
    avatar: feed.image?.url ?? "",
  }
}

export async function addFeedInfoAction(feedInfo: FeedInfoWithoutId) {
  const currentFeedList = await getFeedInfoList()
  if (currentFeedList.some((feed) => feed.feedUrl === feedInfo.feedUrl)) {
    return "Feed already exists"
  }
  const result = await addFeedInfo(feedInfo)
  if (isError(result)) {
    return result.message
  }
}

function isError(
  result: unknown,
): result is { object: "error"; message: string } {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const error = result as any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error.object === "error" && typeof error.message === "string"
}
