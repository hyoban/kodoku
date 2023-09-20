import "@hyoban/tailwind-config/globals.css"

import type { Metadata } from "next"
import { TailwindIndicator, ThemeProvider } from "@hyoban/components"
import { cn } from "@hyoban/utils"
import { Analytics } from "@vercel/analytics/react"

import { SiteHeader } from "@/components/site-header"
import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"

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
        <body
          className={cn(
            "h-full bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <ThemeProvider>
            <div className="relative flex h-full flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  )
}
