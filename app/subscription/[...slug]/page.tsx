import Link from "next/link"
import { notFound } from "next/navigation"

import FeedListGroup from "@/components/feed-list-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getFeedList,
  getFeedListGroupedByYearAndMonth,
  getFilters,
} from "@/lib/notion"
import { getFeedInfoList } from "@/lib/unsafe"
import { capitalize } from "@/lib/utils"

export const revalidate = 3600

export default async function SubscriptionPage({
  params,
}: {
  params: {
    slug: string[]
  }
}) {
  if (params.slug.length !== 2) notFound()

  const feedInfoList = await getFeedInfoList()
  if (!feedInfoList) return null
  const filters = await getFilters(feedInfoList)
  if (!filters) return null

  const feedListGroupedByYearAndMonth = getFeedListGroupedByYearAndMonth(
    (await getFeedList(feedInfoList, params.slug[0], params.slug[1])) ?? [],
  )

  return (
    <>
      <div className="container my-14 w-full max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row">
          {params.slug.map((slug, index) => {
            return (
              <Tabs defaultValue={slug} key={index}>
                <TabsList>
                  {filters[index]?.map((filter) => (
                    <Link
                      key={filter}
                      href={
                        index === 0
                          ? `/subscription/${filter}/${params.slug[1]}`
                          : `/subscription/${params.slug[0]}/${filter}`
                      }
                    >
                      <TabsTrigger value={filter}>
                        {capitalize(filter)}
                      </TabsTrigger>
                    </Link>
                  ))}
                </TabsList>
              </Tabs>
            )
          })}
        </div>

        <FeedListGroup
          feedListGroupedByYearAndMonth={feedListGroupedByYearAndMonth}
        />
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const filter = await getFilters()
  if (!filter) return []

  return [
    ...filter[0].flatMap((type) =>
      filter[1].map((language) => ({
        params: {
          slug: [type, language],
        },
      })),
    ),
  ]
}
