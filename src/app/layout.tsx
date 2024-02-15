import './globals.css'

import type { Metadata } from 'next'

import { SiteHeader } from '~/components/site-header'
import { Toaster } from '~/components/ui/sonner'
import { siteConfig } from '~/config/site'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head />
      <body className="h-full bg-background overflow-auto">
        <Providers>
          <div className="relative flex h-full flex-col">
            <SiteHeader />
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
