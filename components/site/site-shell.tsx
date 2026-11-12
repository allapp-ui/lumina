import type { ReactNode } from 'react'
import { AmbientBackground } from './ambient-background'
import { Footer } from './footer'
import { Navbar } from './navbar'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AmbientBackground />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
