import Balancer from "react-wrap-balancer"

import Link from "~/components/link"
import { buttonVariants } from "~/components/ui/button"
import { siteConfig } from "~/config/site"

export default function IndexPage() {
  return (
    <section className="container flex h-full flex-col items-center justify-center gap-6">
      <h1 className="bg-gradient-to-br from-neutral-400 via-accent-foreground to-slate-400 bg-clip-text text-center text-4xl font-bold text-transparent drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
        <Balancer>{siteConfig.description}</Balancer>
      </h1>
      <p className="text-center text-muted-foreground/80 md:text-xl">
        <Balancer>
          Based on the Incremental Static Regeneration function of Next.js and
          shadcn/ui
        </Balancer>
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={siteConfig.links.vercel}
          className={buttonVariants({ size: "lg" })}
        >
          Deploy Now
        </Link>
        <Link
          href={siteConfig.links.notion}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Notion Template
        </Link>
      </div>
    </section>
  )
}
