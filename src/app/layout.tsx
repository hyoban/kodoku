import "./globals.css"

import { SiteHeader } from "~/components/site-header"
import { siteConfig } from "~/config/site"

import Providers from "./providers"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="h-full">
        <head />
        <body className="h-full bg-background">
          <Providers>
            <div className="relative flex h-full flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </Providers>
        </body>
      </html>
    </>
  )
}
