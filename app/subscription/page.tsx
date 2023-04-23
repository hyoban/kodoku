import Link from "next/link"
import dayjs from "dayjs"

import { siteConfig } from "@/config/site"
import { getFeedList } from "@/lib/notion"
import { capitalize, firstSentence } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const { timeZone } = siteConfig

export const revalidate = 3600

export default async function SubscriptionPage() {
  const feedList = await getFeedList()
  if (!feedList) {
    return null
  }

  const languageSet = ["all"].concat(
    Array.from(new Set(feedList.map((feed) => feed.language.toLowerCase())))
  )

  const typeSet = ["all"].concat(
    Array.from(new Set(feedList.map((feed) => feed.type.toLowerCase())))
  )

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
      <div className="container my-14 w-full max-w-5xl">
        <Tabs defaultValue={"all"} className="mb-4">
          <TabsList>
            {languageSet.map((language) => (
              <TabsTrigger key={language} value={language}>
                {capitalize(language)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs defaultValue={"all"}>
          <TabsList>
            {typeSet.map((type) => (
              <TabsTrigger key={type} value={type}>
                {capitalize(type)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
                        <CardDescription>{feed.language}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link
                          href={feed.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all"
                        >
                          {firstSentence(feed.contentSnippet ?? "").slice(
                            0,
                            100
                          )}
                        </Link>
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
      </div>
    </>
  )
}
