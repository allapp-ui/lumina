'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useSiteData } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

const links = [
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
]

export function Navbar() {
  const { settings } = useSiteData()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        aria-label="Main"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'glass flex w-full max-w-5xl items-center justify-between gap-4 rounded-full px-3 py-2 transition-shadow duration-300 md:px-4',
          scrolled && 'shadow-lg shadow-black/5 dark:shadow-black/40',
        )}
      >
        <Link href="/" className="group flex items-center gap-2 rounded-full pr-2" aria-label={`${settings.name} home`}>
          <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet font-mono text-xs font-bold text-white">
            {settings.initials}
          </span>
          <span className="hidden font-heading text-sm font-semibold sm:inline">{settings.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/admin"
            aria-label="Admin dashboard"
            title="Admin"
            className="inline-flex size-9 items-center justify-center rounded-full border border-glass-border text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <ShieldCheck className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-glass-border md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass absolute inset-x-4 top-20 rounded-2xl bg-background/80 p-2 md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
