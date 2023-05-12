import { getFilters, getTimeline } from "@/lib/notion"

import TimelineFilter from "./filter"
import Timeline from "./list"

export const revalidate = 100

export default async function SubscriptionPage() {
	const timeline = (await getTimeline()) ?? []
	const filters = await getFilters(
		timeline.map((item) => item.feedInfo),
		false,
		false
	)
	if (!filters) return null

	return (
		<>
			<div className="container my-8 w-full max-w-5xl sm:my-12">
				<TimelineFilter filters={filters[0]}></TimelineFilter>
				<main className="mx-auto my-4 max-w-2xl">
					<Timeline timeline={timeline} />
				</main>
			</div>
		</>
	)
}
