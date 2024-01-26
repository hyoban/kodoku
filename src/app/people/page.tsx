import Image from "next/image"
import { Suspense } from "react"

import { IconLink } from "~/components/icon-link"
import { Link } from "~/components/link"
import { Loading } from "~/components/loading"
import { NewFeedDialog } from "~/components/new-feed"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Separator } from "~/components/ui/separator"
import { env } from "~/env"
import { getFeedInfoList } from "~/lib/unsafe"

export const revalidate = 3600

async function FeedInfoList() {
  const feedInfoList = await getFeedInfoList()

  return (
    <>
      <NewFeedDialog
        existingFeedUrls={feedInfoList
          .map((feedInfo) => feedInfo.feedUrl)
          .filter(Boolean)}
      />
      {feedInfoList
        .sort((a, b) =>
          env.NODE_ENV === "development"
            ? a.title.localeCompare(b.title)
            : Math.random() - 0.5,
        )
        .map((feedInfo) => (
          <div
            key={feedInfo.id}
            className="group w-full mx-auto my-4 flex items-center rounded-md px-4 py-3 hover:bg-accent"
          >
            <Avatar>
              <AvatarImage asChild src={feedInfo.avatar ?? ""}>
                <Image
                  src={feedInfo.avatar ?? ""}
                  className="size-12 shrink-0 grow-0 rounded-full bg-white object-cover"
                  alt="avatar"
                  width={48}
                  height={48}
                />
              </AvatarImage>
              <AvatarFallback>
                {feedInfo.title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex w-full flex-col self-stretch">
              <div className="flex grow flex-col sm:flex-row sm:items-center sm:justify-between">
                {feedInfo.url ? (
                  <Link href={feedInfo.url} className="flex items-center">
                    <h3 className="text-lg font-semibold">{feedInfo.title}</h3>
                  </Link>
                ) : (
                  <h3 className="text-lg font-semibold">{feedInfo.title}</h3>
                )}
                <span className="my-2 flex gap-3">
                  {feedInfo.socials.filter(Boolean).map((link) => (
                    <IconLink key={link} link={link} />
                  ))}
                </span>
              </div>
              <Separator className="group-hover:bg-accent" />
            </div>
          </div>
        ))}
    </>
  )
}

export default function Page() {
  return (
    <div className="m-5 sm:m-10 self-center md:min-w-[30rem] flex flex-col">
      <Suspense fallback={<Loading />}>
        <FeedInfoList />
      </Suspense>
    </div>
  )
}
