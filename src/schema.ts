import { z } from "zod"

export const feedInfoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: z.string().optional(),
  language: z.string().optional(),
  useCover: z.boolean().default(false).optional(),
  url: z.string().nullable(),
  feedUrl: z.string().nullable(),
  avatar: z.string().nullable().optional(),
  socials: z.array(z.string()),
})

export type FeedInfo = z.infer<typeof feedInfoSchema>
export type FeedInfoWithoutId = Omit<FeedInfo, "id">
