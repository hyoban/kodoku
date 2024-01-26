import NextLink from "next/link"

import { isExternalLink } from "~/lib/utils"

import type { LinkProps } from "next/link"

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export function Link({
  href,
  children,
  ...props
}: Optional<LinkProps, "href"> & {
  children: React.ReactNode
} & React.PropsWithoutRef<JSX.IntrinsicElements["a"]>) {
  if (href) {
    if (typeof href === "string" && isExternalLink(href)) {
      return (
        <a href={href} {...props} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }

    return (
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    )
  } else {
    return children as JSX.Element
  }
}
