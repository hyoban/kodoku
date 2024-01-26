import { FeedListGroup } from "~/components/feed-list-group"
import { Link } from "~/components/link"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getFeedList, getFilters } from "~/lib/notion"
import { capitalize } from "~/lib/utils"

export const revalidate = 3600

export default async function SubscriptionPage() {
  const filters = await getFilters()
  const feedList = (await getFeedList()) ?? []

  return (
    <div className="container my-14 w-full max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row">
        {filters.map((filter, index) => {
          return (
            // eslint-disable-next-line @eslint-react/jsx/no-array-index-key
            <Tabs defaultValue="all" key={index}>
              <TabsList>
                {filter.filter(Boolean).map((filter) => (
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

      <FeedListGroup feedList={feedList} />
    </div>
  )
}
