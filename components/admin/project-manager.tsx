'use client'

import { ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { siteRepository, useSiteData } from '@/lib/store'
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from '@/lib/types'
import { Field, ghostBtn, ImageInput, inputClass, Panel, primaryBtn, TagInput, TextArea, TextInput, Toggle } from './fields'

type Draft = Omit<Project, 'id' | 'slug' | 'createdAt'> & { id?: string }

const blank: Draft = {
  title: '', description: '', problem: '', architecture: '', features: [], image: '', gallery: [],
  tech: [], category: 'Web App', liveUrl: '', githubUrl: '', featured: false,
}

const isUrl = (v: string) => !v || /^https?:\/\/\S+$/.test(v)

export function ProjectManager() {
  const { projects } = useSiteData()
  const params = useSearchParams()
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(params.get('new') ? { ...blank } : null)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d))

  const close = () => {
    setDraft(null)
    router.replace('/admin/projects')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft) return
    if (draft.title.trim().length < 2) return toast.error('Title is required.')
    if (!draft.description.trim()) return toast.error('Short description is required.')
    if (!isUrl(draft.liveUrl) || !isUrl(draft.githubUrl)) return toast.error('Links must start with http:// or https://')
    try {
      siteRepository.saveProject({ ...draft, title: draft.title.trim() })
      toast.success(draft.id ? 'Project updated' : 'Project published')
      close()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save project')
    }
  }

  const remove = (p: Project) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    siteRepository.deleteProject(p.id)
    toast.success('Project deleted')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">{projects.length} projects in your showcase</p>
        </div>
        {!draft && (
          <button type="button" onClick={() => setDraft({ ...blank })} className={primaryBtn}>
            <Plus className="size-4" aria-hidden /> New project
          </button>
        )}
      </div>

      {draft && (
        <form onSubmit={onSubmit}>
          <Panel
            title={draft.id ? 'Edit project' : 'New project'}
            actions={<button type="button" onClick={close} aria-label="Close form" className="rounded-lg p-1.5 hover:bg-foreground/5"><X className="size-4" aria-hidden /></button>}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Title" required value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="Nebula Analytics" />
              <Field label="Category" htmlFor="project-category">
                <select id="project-category" value={draft.category} onChange={(e) => set('category', e.target.value as ProjectCategory)} className={inputClass}>
                  {PROJECT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <TextArea className="md:col-span-2" label="Short description" rows={2} value={draft.description} onChange={(e) => set('description', e.target.value)} placeholder="One or two sentences shown on the card." />
              <TextArea label="Problem statement" rows={4} value={draft.problem} onChange={(e) => set('problem', e.target.value)} />
              <TextArea label="Architecture" rows={4} value={draft.architecture} onChange={(e) => set('architecture', e.target.value)} />
              <TextArea
                className="md:col-span-2"
                label="Key features"
                hint="One feature per line."
                rows={4}
                value={draft.features.join('\n')}
                onChange={(e) => set('features', e.target.value.split('\n'))}
                onBlur={(e) => set('features', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
              />
              <div className="md:col-span-2">
                <ImageInput label="Cover image" value={draft.image} onChange={(v) => set('image', v)} />
              </div>
              <div className="md:col-span-2">
                <TagInput label="Tech stack" value={draft.tech} onChange={(v) => set('tech', v)} placeholder="Next.js, Postgres…" />
              </div>
              <TextInput label="Live URL" type="url" value={draft.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} placeholder="https://" />
              <TextInput label="GitHub URL" type="url" value={draft.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/…" />
              <div className="md:col-span-2">
                <Toggle label="Featured" description="Highlight this project" checked={draft.featured} onChange={(v) => set('featured', v)} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={close} className={ghostBtn}>Cancel</button>
              <button type="submit" className={primaryBtn}>{draft.id ? 'Save changes' : 'Publish project'}</button>
            </div>
          </Panel>
        </form>
      )}

      <ul className="grid gap-3">
        {projects.map((p) => (
          <li key={p.id} className="glass flex flex-col gap-4 rounded-2xl p-3 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
            <img src={p.image || '/placeholder.svg'} alt="" className="aspect-[16/10] w-full rounded-xl object-cover sm:w-32" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{p.title}</p>
              <p className="truncate text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{p.category} · {p.tech.slice(0, 4).join(', ')}</p>
            </div>
            <div className="flex gap-1">
              <Link href={`/projects/${p.slug}`} target="_blank" aria-label={`View ${p.title}`} className="rounded-lg p-2 hover:bg-foreground/5"><ExternalLink className="size-4" aria-hidden /></Link>
              <button type="button" onClick={() => { setDraft({ ...p }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label={`Edit ${p.title}`} className="rounded-lg p-2 hover:bg-foreground/5"><Pencil className="size-4" aria-hidden /></button>
              <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="size-4" aria-hidden /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
