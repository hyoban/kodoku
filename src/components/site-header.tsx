import { AppearanceSwitch } from "@hyoban/components"

import Link from "~/components/link"
import { MainNav } from "~/components/main-nav"
import { siteConfig } from "~/config/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 px-4 sm:px-8">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link
              href={siteConfig.links.github}
              className="i-simple-icons-github text-[1.5rem] hover:text-teal-600 transition-colors"
            >
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              className="i-simple-icons-twitter text-[1.5rem] hover:text-teal-600 transition-colors"
            >
              <span className="sr-only">Twitter</span>
            </Link>
          </nav>
          <AppearanceSwitch enableTransition />
        </div>
      </div>
    </header>
  )
}
