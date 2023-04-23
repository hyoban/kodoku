import Link from "next/link"
import dayjs from "dayjs"

import { siteConfig } from "@/config/site"
import { FeedList } from "@/lib/notion"
import { firstSentence } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const { timeZone } = siteConfig

export default function FeedListGroup({
  feedListGroupedByYearAndMonth,
}: {
  feedListGroupedByYearAndMonth: Record<string, FeedList>
}) {
  return (
    <>
      {Object.keys(feedListGroupedByYearAndMonth)
        .sort((a, b) => Number(b) - Number(a))
        .map((feedMonth) => {
          const feedListByYear = feedListGroupedByYearAndMonth[feedMonth]
          return (
            <div className="my-10" key={feedMonth}>
              <h2 className="my-4 text-2xl font-bold">{feedMonth}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {feedListByYear.map((feed) => (
                  <Card
                    className="h-full transition-transform hover:scale-105"
                    key={feed.link}
                  >
                    <CardHeader>
                      <CardTitle>
                        <Link
                          href={feed.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {feed.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        <Link
                          href={feed.homeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {feed.author}
                        </Link>
                      </CardDescription>
                      <CardDescription>
                        {dayjs(feed.isoDate).tz(timeZone).format("MM-DD HH:mm")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="break-all">
                        {(feed.contentSnippet ?? "").slice(0, 100) + "..."}
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
