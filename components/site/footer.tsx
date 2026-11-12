'use client'

import { useSiteData } from '@/lib/store'

export function Footer() {
  const { settings } = useSiteData()
  return (
    <footer className="border-t border-glass-border px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <p>
          {'© '}
          {new Date().getFullYear()} {settings.name}. All rights reserved.
        </p>
        <p className="font-mono text-xs">{'built with next.js · framer-motion · tailwind'}</p>
      </div>
    </footer>
  )
}
