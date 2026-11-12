'use client'

import { ExternalLink, FileText, FolderKanban, LayoutDashboard, LogOut, Mail, Menu, Settings, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { useSiteData } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { adminSession } from './admin-gate'

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Site settings', icon: Settings },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { settings, messages } = useSiteData()
  const [open, setOpen] = useState(false)
  const unread = messages.filter((m) => !m.read).length

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-violet font-heading text-sm font-bold text-white">
          {settings.initials}
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">{settings.name}</p>
          <p className="font-mono text-[11px] text-muted-foreground">admin console</p>
        </div>
      </div>
      <nav aria-label="Admin" className="mt-8 flex-1">
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                    active ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                  {item.label === 'Messages' && unread > 0 && (
                    <span className="ml-auto rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">{unread}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex flex-col gap-1 border-t border-glass-border pt-4">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
          <ExternalLink className="size-4" aria-hidden /> View site
        </Link>
        <button type="button" onClick={() => adminSession.set(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-svh border-r border-glass-border bg-glass p-5 backdrop-blur-xl lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-glass-border bg-background p-5">{sidebar}</aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-glass-border bg-background/70 px-4 backdrop-blur-xl md:px-8">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 hover:bg-foreground/5 lg:hidden">
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
          <p className="font-mono text-xs text-muted-foreground">{'~/admin' + pathname.replace('/admin', '')}</p>
          <ThemeToggle />
        </header>
        <main className="mx-auto max-w-5xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
