'use client'

import { Mail, MailOpen, Reply, Trash2 } from 'lucide-react'
import { formatDate, siteRepository, useSiteData } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AdminMessagesPage() {
  const { messages } = useSiteData()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Submissions from your contact form.</p>
      </div>
      {messages.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          <Mail className="mx-auto size-8" aria-hidden />
          <p className="mt-3">No messages yet. They will appear here when visitors use the contact form.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li key={m.id} className={cn('glass rounded-2xl p-5', !m.read && 'border-primary/40')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    {!m.read && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                    {m.subject}
                  </p>
                  <p className="text-sm text-muted-foreground">{m.name} · <a href={`mailto:${m.email}`} className="hover:text-primary">{m.email}</a></p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
              <div className="mt-4 flex gap-1">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs hover:bg-foreground/5">
                  <Reply className="size-3.5" aria-hidden /> Reply
                </a>
                <button type="button" onClick={() => siteRepository.markMessageRead(m.id, !m.read)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs hover:bg-foreground/5">
                  <MailOpen className="size-3.5" aria-hidden /> Mark as {m.read ? 'unread' : 'read'}
                </button>
                <button type="button" onClick={() => siteRepository.deleteMessage(m.id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-3.5" aria-hidden /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
