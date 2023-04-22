import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[900px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          {siteConfig.description}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Based on the Incremental Static Regeneration function of Next.js and
          shadcn/ui
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.deployUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Deploy Now
        </Link>
        <Link
          href="/subscription"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Demo
        </Link>
      </div>
    </section>
  )
}
