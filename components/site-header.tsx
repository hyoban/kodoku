import Link from "next/link"
import { AppearanceSwitch } from "@hyoban/components"

import { MainNav } from "@/components/main-nav"
import { siteConfig } from "@/config/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-evenly space-x-4 sm:container sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="hidden flex-1 items-center justify-end space-x-4 sm:flex">
          <nav className="flex items-center space-x-4">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="i-simple-icons-github text-[1.5rem] hover:text-teal-600 transition-colors"
            >
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="i-simple-icons-twitter text-[1.5rem] hover:text-teal-600 transition-colors"
            >
              <span className="sr-only">Twitter</span>
            </Link>
            <AppearanceSwitch enableTransition />
          </nav>
        </div>
      </div>
    </header>
  )
}
