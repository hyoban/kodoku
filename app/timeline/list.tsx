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
            <div key={item.contentSnippet} className="my-4 space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Image
                    src={item.feedInfo.avatar}
                    alt={item.feedInfo.title}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border"
                  ></Image>

                  {item.feedInfo.type !== "GitHub" && (
                    <div>
                      <h2 className="text-lg font-semibold">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all hover:underline"
                        >
                          {item.feedInfo.type === "Twitter"
                            ? item.feedInfo.title
                            : item.title}
                        </a>
                      </h2>
                      <p
                        className="text-sm text-muted-foreground"
                        title={item.isoDate}
                      >
                        {dayjs(item.isoDate).tz(timeZone).fromNow()}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "prose break-all dark:prose-invert [&>iframe]:hidden",
                    item.feedInfo.type === "GitHub"
                      ? "prose-img:hidden [&>div>div>div>div>div:nth-child(2)>svg]:hidden"
                      : item.feedInfo.type === "Twitter"
                      ? "prose-img:my-2 prose-img:max-w-full prose-img:rounded-lg prose-img:border sm:prose-img:max-w-xs"
                      : "prose-img:rounded",
                  )}
                  dangerouslySetInnerHTML={{
                    __html: item.content?.replaceAll("<br>", " ") ?? "",
                  }}
                ></div>
                <Badge variant={"outline"} className="w-fit">
                  {item.feedInfo.type}
                </Badge>
              </div>
              <Separator orientation="horizontal"></Separator>
            </div>
          )
        })}
    </>
  )
}
