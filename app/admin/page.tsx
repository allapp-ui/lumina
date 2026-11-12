'use client'

import { FileText, FolderKanban, Mail, Plus, Radio } from 'lucide-react'
import Link from 'next/link'
import { formatDate, useSiteData } from '@/lib/store'

export default function AdminOverview() {
  const { projects, posts, messages, settings } = useSiteData()
  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderKanban, href: '/admin/projects' },
    { label: 'Published posts', value: posts.filter((p) => p.published).length, icon: FileText, href: '/admin/blog' },
    { label: 'Unread messages', value: messages.filter((m) => !m.read).length, icon: Mail, href: '/admin/messages' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Manage everything on your portfolio from here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="glass rounded-2xl p-5 transition-colors hover:border-primary/40">
            <s.icon className="size-5 text-primary" aria-hidden />
            <p className="mt-4 font-heading text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Radio className={`size-5 ${settings.available ? 'text-emerald-500' : 'text-muted-foreground'}`} aria-hidden />
          <div>
            <p className="font-medium">{settings.available ? settings.availabilityText : 'Not available'}</p>
            <p className="text-sm text-muted-foreground">Current availability status shown on the site</p>
          </div>
        </div>
        <Link href="/admin/settings" className="text-sm text-primary underline underline-offset-4">Change</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/projects?new=1" className="glass flex items-center gap-3 rounded-2xl p-5 hover:border-primary/40">
          <Plus className="size-5 text-primary" aria-hidden /> <span className="font-medium">Add a new project</span>
        </Link>
        <Link href="/admin/blog?new=1" className="glass flex items-center gap-3 rounded-2xl p-5 hover:border-primary/40">
          <Plus className="size-5 text-accent" aria-hidden /> <span className="font-medium">Write a blog post</span>
        </Link>
      </div>

      <section className="glass rounded-2xl p-5">
        <h2 className="font-semibold">Latest messages</h2>
        {messages.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-glass-border">
            {messages.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{m.subject}</span>
                  <span className="block truncate text-muted-foreground">{m.name} · {m.email}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
