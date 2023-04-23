import Link from "next/link"
import { notFound } from "next/navigation"
import dayjs from "dayjs"

import { siteConfig } from "@/config/site"
import { getFeedInfoList, getFeedList } from "@/lib/notion"
import { capitalize } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeedListGroup from "@/components/feed-list-group"

const { timeZone } = siteConfig

export const revalidate = 3600

export default async function SubscriptionPage({
  params,
}: {
  params: {
    slug: string[]
  }
}) {
  if (params.slug.length !== 2) {
    notFound()
  }

  const feedList = await getFeedList()
  if (!feedList) {
    return null
  }

  const typeSet = ["all"].concat(
    Array.from(new Set(feedList.map((feed) => feed.type.toLowerCase())))
  )
  const languageSet = ["all"].concat(
    Array.from(new Set(feedList.map((feed) => feed.language.toLowerCase())))
  )

  const feedListGroupedByYearAndMonth = feedList
    .filter((feed) => {
      if (
        params.slug[0] !== "all" &&
        feed.type.toLowerCase() !== params.slug[0]
      ) {
        return false
      }
      if (
        params.slug[1] !== "all" &&
        feed.language.toLowerCase() !== params.slug[1]
      ) {
        return false
      }
      return true
    })
    .reduce((acc, feed) => {
      const feedYearWithMonth = dayjs(feed.isoDate)
        .tz(timeZone)
        .format("YYYY MM")
      if (!acc[feedYearWithMonth]) {
        acc[feedYearWithMonth] = []
      }
      acc[feedYearWithMonth].push(feed)
      return acc
    }, {} as Record<string, typeof feedList>)

  return (
    <>
      <div className="container my-14 w-full max-w-5xl">
        <Tabs defaultValue={params.slug[0]} className="mb-4">
          <TabsList>
            {typeSet.map((type) => (
              <TabsTrigger key={type} value={type}>
                <Link href={`/subscription/${type}/${params.slug[1]}`}>
                  {capitalize(type)}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs defaultValue={params.slug[1]} className="mb-4">
          <TabsList>
            {languageSet.map((language) => (
              <TabsTrigger key={language} value={language}>
                <Link href={`/subscription/${params.slug[0]}/${language}`}>
                  {capitalize(language)}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <FeedListGroup
          feedListGroupedByYearAndMonth={feedListGroupedByYearAndMonth}
        />
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const feedInfoList = await getFeedInfoList()
  if (!feedInfoList) {
    return []
  }

  const typeSet = ["all"].concat(
    Array.from(
      new Set(feedInfoList.map((feedInfo) => feedInfo.type.toLowerCase()))
    )
  )

  const languageSet = ["all"].concat(
    Array.from(
      new Set(feedInfoList.map((feedInfo) => feedInfo.language.toLowerCase()))
    )
  )

  const params = [
    ...typeSet.flatMap((type) =>
      languageSet.map((language) => ({
        params: {
          slug: [type, language],
        },
      }))
    ),
  ]

  return params
}
