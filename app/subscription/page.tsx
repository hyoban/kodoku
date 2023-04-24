import Link from "next/link"
import dayjs from "dayjs"

import { siteConfig } from "@/config/site"
import { getFeedList } from "@/lib/notion"
import { capitalize } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeedListGroup from "@/components/feed-list-group"

const { timeZone } = siteConfig

export const revalidate = 3600

export default async function SubscriptionPage() {
  const feedList = await getFeedList()
  if (!feedList) {
    return null
  }

  const typeSet = ["all"].concat(
    Array.from(new Set(feedList.map((feed) => feed.type.toLowerCase()))).sort()
  )
  const languageSet = ["all"].concat(
    Array.from(
      new Set(feedList.map((feed) => feed.language.toLowerCase()))
    ).sort()
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
        <div className="flex flex-col gap-4 md:flex-row">
          <Tabs defaultValue={"all"}>
            <TabsList>
              {typeSet.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  href={`/subscription/${type}/all`}
                >
                  {capitalize(type)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Tabs defaultValue={"all"}>
            <TabsList>
              {languageSet.map((language) => (
                <TabsTrigger
                  key={language}
                  value={language}
                  href={`/subscription/all/${language}`}
                >
                  {capitalize(language)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <FeedListGroup
          feedListGroupedByYearAndMonth={feedListGroupedByYearAndMonth}
        />
      </div>
    </>
  )
}
