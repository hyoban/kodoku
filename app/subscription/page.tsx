import Link from "next/link"

import FeedListGroup from "~/components/feed-list-group"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  getFeedList,
  getFeedListGroupedByYearAndMonth,
  getFilters,
} from "~/lib/notion"
import { capitalize } from "~/lib/utils"

export const revalidate = 3600

export default async function SubscriptionPage() {
  const filters = await getFilters()
  if (!filters) return null
  const feedListGroupedByYearAndMonth = getFeedListGroupedByYearAndMonth(
    (await getFeedList()) ?? [],
  )

  return (
    <>
      <div className="container my-14 w-full max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row">
          {filters.map((filter, index) => {
            return (
              <Tabs defaultValue="all" key={index}>
                <TabsList>
                  {filter.map((filter) => (
                    <Link
                      key={filter}
                      href={
                        index === 0
                          ? `/subscription/${filter}/all`
                          : `/subscription/all/${filter}`
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
