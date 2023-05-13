"use client"

import "@/lib/dayjs"
import dayjs from "dayjs"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"
import { FeedList } from "@/lib/notion"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import Image from "next/image"
import { selectedTypeAtom } from "./state"

const { timeZone } = siteConfig

export default function Timeline({ timeline }: { timeline: FeedList }) {
	const [selectedType] = useAtom(selectedTypeAtom)

	return (
		<>
			{timeline
				.filter((item) => selectedType.includes(item.feedInfo.type))
				.map((item) => {
					return (
						<div key={item.contentSnippet}>
							<div className="flex items-center gap-4 py-4 md:gap-10">
								{item.feedInfo.type !== "GitHub" && (
									<Image
										src={item.feedInfo.avatar}
										alt={item.feedInfo.title}
										width={36}
										height={36}
										className="my-4 h-9 w-9 self-start rounded-full"
									></Image>
								)}
								<div className="space-y-3">
									{item.feedInfo.type !== "GitHub" && (
										<>
											{item.feedInfo.type === "Twitter" ? (
												<a
													href={item.link}
													target="_blank"
													rel="noreferrer"
													className={cn(
														"prose dark:prose-invert prose-img:rounded"
													)}
													dangerouslySetInnerHTML={{
														__html: item.content?.replaceAll("<br>", " ") ?? "",
													}}
												></a>
											) : (
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
											)}

											<p
												className="text-sm text-muted-foreground"
												title={item.isoDate}
											>
												{dayjs(item.isoDate).tz(timeZone).fromNow()}
											</p>
										</>
									)}

									{item.feedInfo.type !== "Twitter" && (
										<div
											className={cn(
												"prose dark:prose-invert",
												item.feedInfo.type === "GitHub"
													? "prose-blockquote:my-2 prose-img:my-2 prose-img:rounded-full"
													: "prose-img:rounded"
											)}
											dangerouslySetInnerHTML={{ __html: item.content ?? "" }}
										></div>
									)}
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
