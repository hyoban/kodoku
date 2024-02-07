import Parser from "rss-parser"

import { timeout } from "./utils"

const parser = new Parser()

export async function parseRssFeed(
  feedUrl?: string | undefined,
): Promise<Parser.Output<Record<string, unknown>> | null> {
  if (!feedUrl) return null
  try {
    const feed = await timeout(3000, parser.parseURL(feedUrl))
    return feed
  } catch (e) {
    if (
      e instanceof Error &&
      (e.message === "timeout" ||
        !e.message.includes("Non-whitespace before first tag."))
    ) {
      console.error(e.message, feedUrl)
      return null
    }

    console.error("parseRssFeed", e)
  }
  return null
}
