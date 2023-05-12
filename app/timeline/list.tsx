"use client"

import "@/lib/dayjs"
import dayjs from "dayjs"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"
import { FeedList } from "@/lib/notion"
import { useAtom } from "jotai"
import Image from "next/image"
import { selectedTypeAtom } from "./state"

const { timeZone } = siteConfig

export default function GitHubTimelineList({
	githubTimeline,
}: {
	githubTimeline: FeedList
}) {
	const [selectedType] = useAtom(selectedTypeAtom)

	return (
		<>
			{githubTimeline
				.filter((item) => selectedType.includes(item.feedInfo.type))
				.map((item) => {
					return (
						<div key={item.contentSnippet}>
							<div className="flex items-center gap-4 py-4 md:gap-10">
								<Image
									src={item.feedInfo.avatar}
									alt={item.feedInfo.title}
									width={36}
									height={36}
									className="my-4 h-9 w-9 self-start rounded-full"
								></Image>
								<div className="space-y-3">
									<h2 className="my-4 text-lg font-semibold">
										<a
											href={item.link}
											target="_blank"
											rel="noreferrer"
											className="break-all hover:underline"
										>
											{item.title}
										</a>
									</h2>
									<p
										className="text-sm text-muted-foreground"
										title={item.isoDate}
									>
										{dayjs(item.isoDate).tz(timeZone).fromNow()}
									</p>
									<p className="break-all text-sm font-medium leading-relaxed">
										{item.contentSnippet?.split("\n").slice(10).join("\n")}
									</p>
									<Badge variant={"outline"}>{item.feedInfo.type}</Badge>
								</div>
							</div>
							<Separator orientation="horizontal"></Separator>
						</div>
					)
				})}
		</>
	)
}
