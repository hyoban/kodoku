/* eslint-disable @next/next/no-img-element */
import "~/lib/dayjs"

import dayjs from "dayjs"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { siteConfig } from "~/config/site"
import type { FeedList } from "~/lib/notion"
import { getFeedContent } from "~/lib/unsafe"

import RevalidateAt from "./revalidate-at"

const { timeZone } = siteConfig

export default function FeedListGroup({
  feedListGroupedByYearAndMonth,
}: {
  feedListGroupedByYearAndMonth: Record<string, FeedList>
}) {
  return (
    <>
      <RevalidateAt />
      {Object.keys(feedListGroupedByYearAndMonth)
        .sort((a, b) => Number(b) - Number(a))
        .map((feedMonth) => {
          const feedListByYear = feedListGroupedByYearAndMonth[feedMonth]
          return (
            <div className="my-10" key={feedMonth}>
              <h2 className="my-4 text-2xl font-bold">{feedMonth}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {feedListByYear?.map((feed) => (
                  <Card className="h-full" key={feed.link}>
                    <CardHeader>
                      <CardTitle>
                        <Link
                          href={feed.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leading-8"
                        >
                          {feed.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        <Link
                          href={feed.feedInfo.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {feed.feedInfo.title}
                        </Link>
                      </CardDescription>
                      <CardDescription>
                        {dayjs(feed.isoDate).tz(timeZone).format("MM-DD HH:mm")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="break-all">
                        {getFeedContent(feed).startsWith("http") ? (
                          <img
                            src={getFeedContent(feed)}
                            alt="feed cover"
                            className="rounded-md"
                          />
                        ) : (
                          getFeedContent(feed)
                        )}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      {feed.categories?.map((category) => (
                        <span
                          key={category}
                          className="rounded bg-gray-600 px-2 py-1 text-xs text-white"
                        >
                          {category}
                        </span>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
    </>
  )
}
