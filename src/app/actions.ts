'use server'

import { normalizeURL } from 'ufo'

import { addFeedInfo } from '~/lib/notion'
import { parseRssFeed } from '~/lib/rss'
import { getFeedInfoList } from '~/lib/unsafe'

import type { FeedInfoWithoutId, Result } from '~/schema'

async function isFeedExist(feedUrl: string) {
  const currentFeedList = await getFeedInfoList()
  return currentFeedList.some(
    feed =>
      feed.feedUrl !== null
      && normalizeURL(feed.feedUrl) === normalizeURL(feedUrl),
  )
}

export async function parseFeedInfoAction(
  feedUrl: string,
): Promise<Result<FeedInfoWithoutId>> {
  const feed = await parseRssFeed(feedUrl)
  if (!feed)
    return 'Feed is null'
  return {
    title: feed.title ?? '',
    url: feed.link ?? '',
    feedUrl,
    socials: [],
    avatar: feed.image?.url ?? '',
  }
}

export async function addFeedInfoAction(feedInfo: FeedInfoWithoutId) {
  if (feedInfo.feedUrl && (await isFeedExist(feedInfo.feedUrl))) {
    return 'Feed already exists'
  }
  const result = await addFeedInfo(feedInfo)
  if (isError(result)) {
    return result.message
  }
}

function isError(
  result: unknown,
): result is { object: 'error', message: string } {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const error = result as any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error.object === 'error' && typeof error.message === 'string'
}
