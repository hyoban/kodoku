import { getPlatformIcon } from "~/lib/utils"

import Link from "./link"

export function IconLink({ link }: { link: string }) {
  const icon = getPlatformIcon(link)
  if (!icon) return null

  return (
    <Link href={link} className="flex items-center text-sm">
      <div className={icon}></div>
    </Link>
  )
}
