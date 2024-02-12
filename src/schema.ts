import { z } from 'zod'

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
export type FeedInfoWithoutId = Omit<FeedInfo, 'id'>

export type Error = string
export type Success<T> = T
export type Result<T> = Success<T> | Error

export function isError<T>(result: Result<T>): result is Error {
  return typeof result === 'string'
}
