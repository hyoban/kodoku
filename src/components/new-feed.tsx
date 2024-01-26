"use client"

import { useRef, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { normalizeURL } from "ufo"

import { addFeedInfoAction, parseFeedInfoAction } from "~/app/actions"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { isError } from "~/schema"

import type { FeedInfoWithoutId } from "~/schema"

function ParseButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      Parse
    </Button>
  )
}

export function NewFeedDialog({
  existingFeedUrls,
}: {
  existingFeedUrls?: string[]
}) {
  const [isPending, startTransition] = useTransition()
  const [feedInfo, setFeedInfo] = useState<FeedInfoWithoutId | undefined>()
  const [newSocial, setNewSocial] = useState("")
  const feedUrlInputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setFeedInfo(undefined)
    if (feedUrlInputRef.current) {
      feedUrlInputRef.current.value = ""
      feedUrlInputRef.current.focus()
    }
  }

  function addFeed() {
    if (!feedInfo) return
    startTransition(async () => {
      const error = await addFeedInfoAction(feedInfo)
      if (error) {
        console.error(error)
        toast.error(error)
      } else {
        toast.success("Feed added")
      }
      reset()
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-auto">
          Add feed
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new feed from RSS URL</DialogTitle>
        </DialogHeader>
        <form
          className="flex gap-4 items-center"
          action={async (formData) => {
            const feedUrl = formData.get("feedUrl")
            if (!feedUrl) return
            if (
              existingFeedUrls
                ?.map(normalizeURL)
                .includes(normalizeURL(feedUrl as string))
            ) {
              reset()
              toast.error("Feed already exists")
              return
            }

            const result = await parseFeedInfoAction(feedUrl as string)
            if (isError(result)) {
              reset()
              toast.error(result)
              return
            }
            setFeedInfo(result)
          }}
        >
          <Input name="feedUrl" ref={feedUrlInputRef} />
          <ParseButton />
        </form>
        <pre className="text-xs overflow-auto">
          <code>{JSON.stringify(feedInfo, null, 2)}</code>
        </pre>
        {!!feedInfo && (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Title</Label>
              <Input
                value={feedInfo.title}
                onChange={(e) => {
                  setFeedInfo({
                    ...feedInfo,
                    title: e.target.value,
                  })
                }}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Avatar</Label>
              <Input
                value={feedInfo.avatar ?? ""}
                onChange={(e) => {
                  setFeedInfo({
                    ...feedInfo,
                    avatar: e.target.value,
                  })
                }}
              />
            </div>
            {feedInfo.socials.map((social) => (
              <p key={social}>{social}</p>
            ))}
            <div className="flex w-full max-w-sm items-center gap-1.5">
              <Input
                value={newSocial}
                onChange={(e) => {
                  setNewSocial(e.target.value)
                }}
              />
              <Button
                onClick={() => {
                  setFeedInfo({
                    ...feedInfo,
                    socials: [...feedInfo.socials, newSocial],
                  })
                  setNewSocial("")
                }}
              >
                Add social
              </Button>
            </div>
            <Button onClick={addFeed} disabled={isPending}>
              New feed
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
