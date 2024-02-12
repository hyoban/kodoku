import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { FeedInfo } from './notion'
import type { ClassValue } from 'clsx'
import type Parser from 'rss-parser'

const ICON_MAP = [
  ['twitter.com', 'i-simple-icons-twitter', 'Twitter'],
  ['github.com', 'i-simple-icons-github', 'GitHub'],
  ['youtube.com', 'i-simple-icons-youtube', 'YouTube'],
  ['bilibili.com', 'i-simple-icons-bilibili', 'Bilibili'],
  ['discord.com', 'i-simple-icons-discord', 'Discord'],
  ['t.me', 'i-simple-icons-telegram', 'Telegram'],
] as const

export function getPlatformIcon(url: string): string | undefined {
  const icon = ICON_MAP.find(([domain]) => url.includes(domain))
  return icon?.[1]
}

export function getPlatformName(url: string): string | undefined {
  const name = ICON_MAP.find(([domain]) => url.includes(domain))
  return name?.[2]
}

export function notNullish<T>(v: T | null | undefined): v is NonNullable<T> {
  return v != null
}

export function extractFirstImageUrl(html: string): string | undefined {
  const img = html.match(/<img.*?src="(.*?)"/)
  if (!img)
    return
  return img[1]
}

export function isExternalLink(url?: string): boolean {
  if (!url)
    return false
  return url.startsWith('http') || url.startsWith('//')
}

export function joinFeedItemUrl(feedUrl: string, itemUrl?: string): string {
  if (!itemUrl)
    return feedUrl
  if (isExternalLink(itemUrl))
    return itemUrl
  if (feedUrl.endsWith('/'))
    feedUrl = feedUrl.slice(0, -1)
  if (itemUrl.startsWith('/'))
    itemUrl = itemUrl.slice(1)
  return `${feedUrl}/${itemUrl}`
}

export function isFeedItemValid(
  item: Parser.Item & { id?: string },
  feedInfo: FeedInfo,
): boolean {
  if (
    feedInfo.type === 'GitHub'
    && feedInfo.feedUrl?.endsWith('.atom')
    && ['PushEvent'].some((i) => {
      return item.id?.includes(i)
    })
  )
    return false

  if (!item.link)
    return false
  if (item.link.includes('[object Object]'))
    return false
  if (!item.title)
    return false
  if (!item.isoDate)
    return false
  if (item.title === 'No title')
    return false
  return true
}

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function timeout<T>(
  ms: number,
  promise: Promise<T>,
): Promise<Awaited<T>> {
  return Promise.race([
    delay(ms).then(() => {
      throw new Error('timeout')
    }),
    promise,
  ])
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
