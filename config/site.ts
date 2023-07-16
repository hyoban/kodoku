export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Kodoku",
  description: "A website that helps you track RSS subscription updates",
  mainNav: [
    {
      title: "Subscription",
      href: "/subscription",
    },
    {
      title: "Timeline",
      href: "/timeline",
    },
    {
      title: "People",
      href: "/people",
    },
  ],
  links: {
    twitter: "https://twitter.com/0xhyoban",
    github: "https://github.com/hyoban/kodoku",
    vercel:
      "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhyoban%2Fkodoku&env=NOTION_FEED_ID,NOTION_TOKEN",
    notion:
      "https://hyoban.notion.site/dfebcfeeaf2e4f049304cf113eb90252?v=9d9ccbc838b84e75b324d2ab28f053c0",
  },
  timeZone: "Asia/Shanghai",
}
