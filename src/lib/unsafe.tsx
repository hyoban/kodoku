import { feedId, getDatabaseItems } from "./notion"
import { extractFirstImageUrl } from "./utils"

import type { FeedItem } from "./notion"

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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

export async function getFeedInfoList() {
  const feedInfoListInDB = await getDatabaseItems(feedId)
  if (!feedInfoListInDB) return

  return feedInfoListInDB.map((i) => {
    const page = i as Record<string, any>
    return {
      id: i.id,
      title: page["properties"].ID.title[0].plain_text,
      url: page["properties"].Homepage.url,
      feedUrl: page["properties"].RSS.url,
      avatar: page["cover"].external.url,
      type: page["properties"].Type.select.name,
      language: page["properties"].Language.select.name,
      useCover: page["properties"].UseCover.checkbox,
      socials:
        Object.keys(page["properties"]).map((j) => {
          if (
            page["properties"][j].type === "url" &&
            page["properties"][j].url
          ) {
            return page["properties"][j].url
          }
        }) ?? [],
    } as {
      id: string
      title: string
      url: string
      feedUrl?: string | undefined
      avatar: string
      type: string
      language: string
      useCover: boolean
      socials: string[]
    }
  })
}
