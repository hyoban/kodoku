import Link from "~/components/link"
import { siteConfig, type NavItem } from "~/config/site"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <nav className="flex items-center gap-4 md:gap-10">
      <Link href="/" className="font-bold text-xl">
        {siteConfig.name}
      </Link>
      {!!items?.length && (
        <>
          {items.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className="text-lg font-semibold text-muted-foreground"
                >
                  {item.title}
                </Link>
              ),
          )}
        </>
      )}
    </nav>
  )
}
