import Image from "next/image"
import Link from "next/link"

import { getFeedInfoList } from "@/lib/notion"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

export const revalidate = 3600

export default async function SubscriptionPage() {
	const feedInfoList = await getFeedInfoList()
	if (!feedInfoList) return null

	return (
		<div className="m-5 sm:m-10">
			{feedInfoList
				.sort((a, b) => a.title.localeCompare(b.title))
				.map((feedInfo) => (
					<div
						key={feedInfo.id}
						className="group mx-auto my-4 flex w-full max-w-xl items-center rounded-md px-4 py-3 hover:bg-accent"
					>
						<Image
							src={feedInfo.avatar}
							className="h-12 w-12 shrink-0 grow-0 rounded-full bg-white object-cover"
							alt="avatar"
							width={48}
							height={48}
						/>
						<div className="ml-4 flex w-full flex-col self-stretch">
							<div className="flex grow justify-between">
								<Link
									href={feedInfo.url}
									className="flex items-center"
									target="_blank"
									rel="noopener noreferrer"
								>
									<h3 className="text-lg font-semibold">{feedInfo.title}</h3>
								</Link>
								<span className="flex gap-3">
									{feedInfo.twitter && (
										<Link
											href={feedInfo.twitter}
											className="flex items-center"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Icons.twitter className="h-4 w-4" />
										</Link>
									)}
									{feedInfo.github && (
										<Link
											href={feedInfo.github}
											className="flex items-center"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Icons.gitHub className="h-4 w-4" />
										</Link>
									)}
								</span>
							</div>
							<Separator className="group-hover:bg-accent" />
						</div>
					</div>
				))}
		</div>
	)
}
