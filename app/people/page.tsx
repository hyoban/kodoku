import Link from "next/link"

import { getFeedInfoList } from "@/lib/notion"
import { Separator } from "@/components/ui/separator"

export default async function SubscriptionPage() {
  const feedInfoList = await getFeedInfoList()
  if (!feedInfoList) return null

  return (
    <div className="m-10">
      {feedInfoList
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((feedInfo) => (
          <div
            key={feedInfo.id}
            className="group mx-auto my-4 flex w-full max-w-xl items-center rounded-md px-4 py-3 hover:bg-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feedInfo.avatar}
              className="h-12 w-12 rounded-full"
              alt="avatar"
            />
            <div className="ml-4 flex w-full flex-col self-stretch">
              <Link
                href={feedInfo.url}
                className="flex grow items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="text-lg font-semibold">{feedInfo.title}</h3>
              </Link>
              <Separator className="group-hover:bg-accent" />
            </div>
          </div>
        ))}
    </div>
  )
}
