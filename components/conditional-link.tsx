import Link, { LinkProps } from "next/link"

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export default function ConditionalLink({
  href,
  children,
  ...props
}: Optional<LinkProps, "href"> & { children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  } else {
    return children as JSX.Element
  }
}
