import Parser from "rss-parser"

import type { FeedInfo } from "./notion"

export function notNullish<T>(v: T | null | undefined): v is NonNullable<T> {
  return v != null
}

export function extractFirstImageUrl(html: string): string | undefined {
  const img = html.match(/<img.*?src="(.*?)"/)
  if (!img) return
  return img[1]
}

export function isExternalLink(url?: string): boolean {
  if (!url) return false
  return url.startsWith("http") || url.startsWith("//")
}

export function joinFeedItemUrl(feedUrl: string, itemUrl?: string): string {
  if (!itemUrl) return feedUrl
  if (isExternalLink(itemUrl)) return itemUrl
  if (feedUrl.endsWith("/")) feedUrl = feedUrl.slice(0, -1)
  if (itemUrl.startsWith("/")) itemUrl = itemUrl.slice(1)
  return feedUrl + "/" + itemUrl
}

export function isFeedItemValid(
  item: Parser.Item & { id?: string },
  feedInfo: FeedInfo,
): boolean {
  if (feedInfo.type === "GitHub" && feedInfo.feedUrl?.endsWith(".atom")) {
    if (
      ["PushEvent"].some((i) => {
        return item.id?.includes(i)
      })
    )
      return false
  }

  if (!item.link) return false
  if (item.link.includes("[object Object]")) return false
  if (!item.title) return false
  if (!item.isoDate) return false
  if (item.title === "No title") return false
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
      throw new Error("timeout")
    }),
    promise,
  ])
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
