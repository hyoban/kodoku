/* eslint-disable no-console */
import '~/lib/dayjs'

import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import dayjs from 'dayjs'
import type Parser from 'rss-parser'

import { siteConfig } from '~/config/site'
import { env } from '~/env'
import type { FeedInfoWithoutId } from '~/schema'

import { parseRssFeed } from './rss'
import { getFeedInfoList } from './unsafe'
import { getPlatformName, isFeedItemValid, joinFeedItemUrl } from './utils'

const { timeZone } = siteConfig

const notionToken = env.NOTION_TOKEN
export const feedId = env.NOTION_FEED_ID

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
  'Authorization': `Bearer ${notionToken}`,
}

export async function addFeedInfo(feedInfo: FeedInfoWithoutId) {
  const database_id = feedId
  const options = {
    parent: { database_id },
    properties: {
      title: [
        {
          text: {
            content: feedInfo.title,
          },
        },
      ],
      Homepage: feedInfo.url,
      RSS: feedInfo.feedUrl,
      ...Object.fromEntries(
        feedInfo.socials.map((i) => {
          const platformName = getPlatformName(i)
          return [platformName, i]
        }) as Array<[string, string]>,
      ),
    },
    ...(feedInfo.avatar
      ? {
          cover: {
            type: 'external',
            external: {
              url: feedInfo.avatar,
            },
          },
        }
      : {}),
  }
  return fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers,
    body: JSON.stringify(options),
  }).then(response => response.json())
}

export async function getDatabaseItems(databaseId: string) {
  try {
    const response = (await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers,
      },
    ).then(i => i.json())) as QueryDatabaseResponse

    if (response.results.length > 0)
      return response.results
  }
  catch (e) {
    console.error('getDatabaseItemList', e)
  }
  return null
}

export async function getFilters(
  feedInfoListFromArg?: FeedInfoList,
  convertToLowerCase = true,
  includeAll = true,
) {
  const feedInfoList = feedInfoListFromArg ?? (await getFeedInfoList())

  const typeFilter = [...new Set(feedInfoList.map(i => i.type))].sort()

  const languageFilter = [
    ...new Set(feedInfoList.map(i => i.language)),
  ].sort()

  if (convertToLowerCase) {
    for (const [index, i] of typeFilter.entries()) {
      typeFilter[index] = i?.toLowerCase()
    }

    for (const [index, i] of languageFilter.entries()) {
      languageFilter[index] = i?.toLowerCase()
    }
  }

  if (includeAll) {
    typeFilter.unshift(convertToLowerCase ? 'all' : 'All')
    languageFilter.unshift(convertToLowerCase ? 'all' : 'All')
  }

  return [typeFilter, languageFilter] as const
}

export async function getFeedList(
  feedInfoListFromArg?: FeedInfoList,
  type = 'all',
  language = 'all',
  enableAutoFilter = true,
) {
  console.log(`start getFeedList at${new Date().toISOString()}`)
  console.time('getFeedList')
  const feedInfoList = feedInfoListFromArg ?? (await getFeedInfoList())

  try {
    const feedList = await Promise.all(
      feedInfoList
        .filter(i => i.feedUrl)
        .map(async (i) => {
          if (!i.feedUrl)
            return []
          const feed = await parseRssFeed(i.feedUrl)
          if (!feed)
            return []
          return feed.items
            .filter(j => isFeedItemValid(j, i))
            .map((j) => {
              return {
                ...j,
                id: j.id as string | undefined,
                link: joinFeedItemUrl(
                  feed.feedUrl ? feed.link! : i.url!,
                  j.link,
                ),
                feedInfo: i,
              }
            })
            .filter((feed) => {
              if (
                type.toLowerCase() !== 'all'
                  && feed.feedInfo.type?.toLowerCase() !== type.toLowerCase()
              ) {
                return false
              }
              if (
                language.toLowerCase() !== 'all'
                && feed.feedInfo.language?.toLowerCase() !== language.toLowerCase()
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
    const numberOfAuthor = feedList.filter(i => i.length > 0).length
    const maxNumberOfFeedSentPerAuthor = Math.floor(
      (numberOfFeedSent / numberOfAuthor) * 1.5,
    )

    // sort by published time
    const finalFeedList = enableAutoFilter
      ? feedList
        .flatMap((i) => {
          if (i.length > maxNumberOfFeedSentPerAuthor) {
            return i.slice(0, maxNumberOfFeedSentPerAuthor)
          }
          return i
        })
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

    console.timeEnd('getFeedList')
    return finalFeedList
  }
  catch (e) {
    console.error('getFeedList', e)
  }
  return null
}

export function getFeedListGroupedByYearAndMonth(feedListFromArg: FeedList) {
  const feedList = {} as Record<string, FeedList>
  for (const feed of feedListFromArg) {
    const feedYearWithMonth = dayjs(feed.isoDate).tz(timeZone).format('YYYY MM')
    if (!feedList[feedYearWithMonth]) {
      feedList[feedYearWithMonth] = []
    }
    feedList[feedYearWithMonth]?.push(feed)
  }
  return feedList
}

export type FeedInfoList = NonNullable<
  Awaited<ReturnType<typeof getFeedInfoList>>
>
export type FeedInfo = FeedInfoList[number]
export type FeedItem = Parser.Item & {
  feedInfo: FeedInfo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>
export type FeedList = NonNullable<Awaited<ReturnType<typeof getFeedList>>>
