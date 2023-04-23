import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import Parser from "rss-parser"
import { twMerge } from "tailwind-merge"

import { siteConfig } from "@/config/site"

const { timeZone } = siteConfig

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function isFeedItemValid(item: Parser.Item): boolean {
  if (!item.link) return false
  if (!item.title) return false
  if (!item.isoDate) return false
  if (item.title === "No title") return false
  // limit to 2 year
  if (
    dayjs(item.isoDate)
      .tz(timeZone)
      .isBefore(dayjs().tz(timeZone).subtract(2, "year"))
  )
    return false
  return true
}

export function delay(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export function timeout<T>(
  ms: number,
  promise: Promise<T>
): Promise<Awaited<T>> {
  return Promise.race([
    delay(ms).then(() => {
      throw new Error("timeout")
    }),
    promise,
  ])
}

export function firstSentence(text: string): string {
  // . or 。
  const isEnglish = text.match(/^[a-zA-Z0-9]/)
  const end = isEnglish ? "." : "。"
  const index = text.indexOf(end)
  if (index === -1) return text
  return text.slice(0, index + 1)
}
