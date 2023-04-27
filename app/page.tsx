import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container flex h-full flex-col items-center justify-center gap-6">
      <h1 className="max-w-4xl bg-gradient-to-br from-neutral-400 via-accent-foreground to-slate-400 bg-clip-text text-center text-4xl font-bold text-transparent drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
        {siteConfig.description}
      </h1>
      <p className="max-w-3xl text-center text-muted-foreground/80 md:text-xl">
        Based on the Incremental Static Regeneration function of Next.js and
        shadcn/ui
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={siteConfig.links.vercel}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Deploy Now
        </Link>
        <Link
          href={siteConfig.links.notion}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Notion Template
        </Link>
      </div>
    </section>
  )
}
