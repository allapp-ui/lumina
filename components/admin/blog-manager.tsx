'use client'

import { Bold, Code, Eye, Heading2, Italic, Link2, List, Pencil, Plus, Quote, Trash2, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Markdown } from '@/components/site/markdown'
import { formatDate, siteRepository, useSiteData } from '@/lib/store'
import type { Post } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ghostBtn, ImageInput, inputClass, Panel, primaryBtn, TagInput, TextArea, TextInput, Toggle } from './fields'

type Draft = Omit<Post, 'id' | 'slug' | 'createdAt'> & { id?: string }
const blank: Draft = { title: '', excerpt: '', content: '', cover: '', tags: [], published: true }

const tools = [
  { icon: Heading2, label: 'Heading', before: '## ', after: '' },
  { icon: Bold, label: 'Bold', before: '**', after: '**' },
  { icon: Italic, label: 'Italic', before: '_', after: '_' },
  { icon: Code, label: 'Code', before: '`', after: '`' },
  { icon: Link2, label: 'Link', before: '[', after: '](https://)' },
  { icon: List, label: 'List', before: '- ', after: '' },
  { icon: Quote, label: 'Quote', before: '> ', after: '' },
]

function Editor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [preview, setPreview] = useState(false)

  const wrap = (before: string, after: string) => {
    const el = ref.current
    if (!el) return
    const { selectionStart: s, selectionEnd: e } = el
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(s + before.length, e + before.length)
    })
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor="post-content" className="text-sm font-medium">Content (Markdown)</label>
        <span className="font-mono text-[11px] text-muted-foreground">{value.split(/\s+/).filter(Boolean).length} words</span>
      </div>
      <div className="overflow-hidden rounded-xl border border-glass-border">
        <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-glass-border bg-background/40 p-1.5">
          {tools.map((t) => (
            <button key={t.label} type="button" disabled={preview} onClick={() => wrap(t.before, t.after)} aria-label={t.label} title={t.label} className="rounded-md p-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground disabled:opacity-40">
              <t.icon className="size-4" aria-hidden />
            </button>
          ))}
          <div className="ml-auto flex rounded-lg bg-muted p-0.5 text-xs">
            {[{ v: false, l: 'Write', i: Pencil }, { v: true, l: 'Preview', i: Eye }].map((m) => (
              <button key={m.l} type="button" onClick={() => setPreview(m.v)} aria-pressed={preview === m.v} className={cn('flex items-center gap-1 rounded-md px-2.5 py-1', preview === m.v ? 'bg-background shadow-sm' : 'text-muted-foreground')}>
                <m.i className="size-3" aria-hidden /> {m.l}
              </button>
            ))}
          </div>
        </div>
        {preview ? (
          <div className="min-h-80 bg-background/60 p-5">{value ? <Markdown content={value} /> : <p className="text-sm text-muted-foreground">Nothing to preview.</p>}</div>
        ) : (
          <textarea
            id="post-content"
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={16}
            placeholder={'## Introduction\n\nStart writing…'}
            className={cn(inputClass, 'min-h-80 rounded-none border-0 font-mono focus:ring-0')}
          />
        )}
      </div>
    </div>
  )
}

export function BlogManager() {
  const { posts } = useSiteData()
  const params = useSearchParams()
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(params.get('new') ? { ...blank } : null)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d))

  const close = () => {
    setDraft(null)
    router.replace('/admin/blog')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft) return
    if (draft.title.trim().length < 3) return toast.error('Title is required.')
    if (draft.content.trim().length < 20) return toast.error('Write a bit more content first.')
    try {
      siteRepository.savePost({ ...draft, title: draft.title.trim(), excerpt: draft.excerpt.trim() || draft.content.replace(/[#*_`>\[\]]/g, '').slice(0, 160) })
      toast.success(draft.published ? 'Post published' : 'Draft saved')
      close()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save post')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">{posts.filter((p) => p.published).length} published · {posts.filter((p) => !p.published).length} drafts</p>
        </div>
        {!draft && (
          <button type="button" onClick={() => setDraft({ ...blank })} className={primaryBtn}>
            <Plus className="size-4" aria-hidden /> New post
          </button>
        )}
      </div>

      {draft && (
        <form onSubmit={onSubmit}>
          <Panel
            title={draft.id ? 'Edit post' : 'New post'}
            actions={<button type="button" onClick={close} aria-label="Close editor" className="rounded-lg p-1.5 hover:bg-foreground/5"><X className="size-4" aria-hidden /></button>}
          >
            <div className="flex flex-col gap-5">
              <TextInput label="Title" value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="How I built…" />
              <TextArea label="Excerpt" hint="Leave empty to generate from content." rows={2} value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
              <ImageInput label="Cover image" value={draft.cover} onChange={(v) => set('cover', v)} />
              <TagInput label="Tags" value={draft.tags} onChange={(v) => set('tags', v)} placeholder="react, performance" />
              <Editor value={draft.content} onChange={(v) => set('content', v)} />
              <Toggle label="Published" description="Drafts are hidden from the public blog" checked={draft.published} onChange={(v) => set('published', v)} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={close} className={ghostBtn}>Cancel</button>
              <button type="submit" className={primaryBtn}>{draft.published ? 'Publish' : 'Save draft'}</button>
            </div>
          </Panel>
        </form>
      )}

      <ul className="grid gap-3">
        {posts.map((p) => (
          <li key={p.id} className="glass flex flex-col gap-4 rounded-2xl p-3 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
            <img src={p.cover || '/placeholder.svg'} alt="" className="aspect-[16/9] w-full rounded-xl object-cover sm:w-32" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{p.title}</p>
                <span className={cn('shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]', p.published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>
                  {p.published ? 'live' : 'draft'}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">{p.excerpt}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{formatDate(p.createdAt)}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => { setDraft({ ...p }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label={`Edit ${p.title}`} className="rounded-lg p-2 hover:bg-foreground/5"><Pencil className="size-4" aria-hidden /></button>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm(`Delete "${p.title}"?`)) return
                  siteRepository.deletePost(p.id)
                  toast.success('Post deleted')
                }}
                aria-label={`Delete ${p.title}`}
                className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
