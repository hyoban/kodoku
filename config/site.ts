export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Kodoku",
  description: "A website that helps you track RSS subscription updates",
  mainNav: [
    {
      title: "Subscription",
      href: "/subscription",
    },
  ],
  links: {
    twitter: "https://twitter.com/0xhyoban",
    github: "https://github.com/hyoban/kodoku",
  },
}
