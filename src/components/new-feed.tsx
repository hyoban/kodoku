"use client"

import { useRef, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

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

import type { FeedInfoWithoutId } from "~/schema"

function ParseButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      Parse
    </Button>
  )
}

export function NewFeedDialog() {
  const [isPending, startTransition] = useTransition()
  const [feedInfo, setFeedInfo] = useState<FeedInfoWithoutId | undefined>()
  const feedUrlInputRef = useRef<HTMLInputElement>(null)

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
      setFeedInfo(undefined)
      if (feedUrlInputRef.current) {
        feedUrlInputRef.current.value = ""
        feedUrlInputRef.current.focus()
      }
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
            const response = await parseFeedInfoAction(feedUrl as string)
            setFeedInfo(response)
          }}
        >
          <Input name="feedUrl" ref={feedUrlInputRef} />
          <ParseButton />
        </form>
        <pre className="text-xs overflow-auto">
          <code>{JSON.stringify(feedInfo, null, 2)}</code>
        </pre>
        {!!feedInfo && (
          <Button onClick={addFeed} disabled={isPending}>
            Add
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
