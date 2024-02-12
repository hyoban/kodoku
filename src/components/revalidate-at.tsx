import '~/lib/dayjs'

import dayjs from 'dayjs'

export function RevalidateAt() {
  return (
    <div className="my-10 font-mono text-sm opacity-70">
      <span>Revalidate at: </span>
      <span>{dayjs().tz().format('YYYY-MM-DD HH:mm:ss')}</span>
    </div>
  )
}
