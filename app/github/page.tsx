import { getFilters, getGithubTimeline } from "@/lib/notion"

import GithubTimelineFilter from "./filter"
import GitHubTimelineList from "./list"

export const revalidate = 100

export default async function SubscriptionPage() {
  const githubTimeline = (await getGithubTimeline()) ?? []
  const filters = await getFilters(
    githubTimeline.map((item) => item.feedInfo),
    false,
    false
  )
  if (!filters) return null

  return (
    <>
      <div className="container my-14 w-full max-w-5xl">
        <GithubTimelineFilter filters={filters.at(0) ?? []} />

        <main className="mx-auto my-4 max-w-2xl">
          <GitHubTimelineList githubTimeline={githubTimeline} />
        </main>
      </div>
    </>
  )
}
