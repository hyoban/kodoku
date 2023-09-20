/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { FeedItem } from "./notion"
import { extractFirstImageUrl } from "./utils"

export function getFeedContent(item: FeedItem): string {
  if (item.feedInfo.useCover) {
    if (item["image"]?.url) {
      return item["image"].url
    }
    if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
      return item.enclosure.url
    }
    if (item["itunes"]?.image) {
      return item["itunes"].image
    }
    const cover = extractFirstImageUrl(
      item["content:encoded"] ?? item.content ?? "",
    )
    return cover ?? ""
  }
  return (
    Array.from(item.contentSnippet ?? "")
      .slice(0, 100)
      .join("") + "..."
  )
}
