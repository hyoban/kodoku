import Link from "next/link"
import dayjs from "dayjs"

import { siteConfig } from "@/config/site"
import { getFeedInfoList, getFeedList } from "@/lib/notion"
import { extractFirstImageUrl } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const { timeZone } = siteConfig

export default async function SubscriptionPage() {
  const feedInfoList = await getFeedInfoList()
  const feedList = await getFeedList(feedInfoList ?? [])
  if (!feedList) {
    return null
  }

  const feedListGroupedByYearAndMonth = feedList.reduce((acc, feed) => {
    const feedYearWithMonth = dayjs(feed.isoDate).tz(timeZone).format("YYYY MM")
    if (!acc[feedYearWithMonth]) {
      acc[feedYearWithMonth] = []
    }
    acc[feedYearWithMonth].push(feed)
    return acc
  }, {} as Record<string, typeof feedList>)

  return (
    <>
      {Object.keys(feedListGroupedByYearAndMonth)
        .sort((a, b) => Number(b) - Number(a))
        .map((feedMonth) => {
          const feedListByYear = feedListGroupedByYearAndMonth[feedMonth]
          return (
            <div className="container my-14 max-w-5xl" key={feedMonth}>
              <h2 className="my-4 text-2xl font-bold">{feedMonth}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {feedListByYear.map((feed) => (
                  <Link
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={feed.link}
                  >
                    <Card className="h-full transition-transform hover:scale-105">
                      <CardHeader>
                        <CardTitle>{feed.title}</CardTitle>
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
                          {dayjs(feed.isoDate)
                            .tz(timeZone)
                            .format("MM-DD HH:mm")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {extractFirstImageUrl(feed.content ?? "") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={extractFirstImageUrl(feed.content ?? "")}
                            className="h-48 w-full rounded-md object-cover"
                            alt="article image"
                          />
                        ) : (
                          <p className="break-all">
                            {feed.contentSnippet?.slice(0, 120) + "..." ?? ""}
                          </p>
                        )}
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
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
    </>
  )
}
