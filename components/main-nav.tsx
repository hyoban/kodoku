import Link from "next/link"
import { cn } from "@hyoban/utils"

import { siteConfig } from "@/config/site"

interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-4 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 sm:flex">
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-4 md:gap-10">
          {items.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  )
}
