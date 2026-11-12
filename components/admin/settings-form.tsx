'use client'

import { FileUp, RotateCcw } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { fileToDataUrl, siteRepository, useSiteData } from '@/lib/store'
import type { SiteSettings } from '@/lib/types'
import { ghostBtn, Panel, primaryBtn, TagInput, TextArea, TextInput, Toggle } from './fields'

export function SettingsForm() {
  const data = useSiteData()
  return <SettingsEditor key={JSON.stringify(data.settings).length} initial={data.settings} />
}

function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial)
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }))
  const setSocial = (k: keyof SiteSettings['socials'], v: string) => setS((p) => ({ ...p, socials: { ...p.socials, [k]: v } }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!s.name.trim() || !s.headline.trim()) return toast.error('Name and headline are required.')
    if (s.roles.length === 0) return toast.error('Add at least one typewriter role.')
    try {
      siteRepository.updateSettings(s)
      toast.success('Settings saved', { description: 'Your changes are live on the site.' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save settings')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Site settings</h1>
          <p className="text-muted-foreground">Control your hero content, CV, socials and availability.</p>
        </div>
        <button type="submit" className={primaryBtn}>Save changes</button>
      </div>

      <Panel title="Availability" description="Shown as a live badge in the hero.">
        <div className="flex flex-col gap-4">
          <Toggle label="Available for freelance" checked={s.available} onChange={(v) => set('available', v)} />
          <TextInput label="Badge text" value={s.availabilityText} onChange={(e) => set('availabilityText', e.target.value)} disabled={!s.available} />
        </div>
      </Panel>

      <Panel title="Hero" description="Your introduction on the homepage.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Name" value={s.name} onChange={(e) => set('name', e.target.value)} />
          <TextInput label="Initials" maxLength={3} value={s.initials} onChange={(e) => set('initials', e.target.value.toUpperCase())} />
          <TextInput className="md:col-span-2" label="Headline" hint="The last two words get the gradient highlight." value={s.headline} onChange={(e) => set('headline', e.target.value)} />
          <TextArea className="md:col-span-2" label="Bio" rows={4} value={s.bio} onChange={(e) => set('bio', e.target.value)} />
          <div className="md:col-span-2">
            <TagInput label="Typewriter roles" value={s.roles} onChange={(v) => set('roles', v)} placeholder="Full-Stack Developer" />
          </div>
          <TextInput label="Location" value={s.location} onChange={(e) => set('location', e.target.value)} />
          <TextInput label="Contact email" type="email" value={s.email} onChange={(e) => set('email', e.target.value)} />
        </div>
      </Panel>

      <Panel title="CV / Résumé" description="The file visitors get from the Download CV button.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="CV file URL" value={s.cvUrl.startsWith('data:') ? '' : s.cvUrl} placeholder={s.cvUrl.startsWith('data:') ? 'Uploaded file in use' : 'https://…/cv.pdf'} onChange={(e) => set('cvUrl', e.target.value)} />
          <TextInput label="Download file name" value={s.cvFileName} onChange={(e) => set('cvFileName', e.target.value)} />
        </div>
        <label className={`${ghostBtn} mt-4 cursor-pointer`}>
          <FileUp className="size-4" aria-hidden /> Upload new CV (PDF)
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              try {
                const url = await fileToDataUrl(file, 2 * 1024 * 1024)
                setS((p) => ({ ...p, cvUrl: url, cvFileName: file.name }))
                toast.success('CV attached — remember to save.')
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Upload failed')
              }
            }}
          />
        </label>
      </Panel>

      <Panel title="Social links">
        <div className="grid gap-5 md:grid-cols-3">
          <TextInput label="GitHub" type="url" value={s.socials.github} onChange={(e) => setSocial('github', e.target.value)} />
          <TextInput label="LinkedIn" type="url" value={s.socials.linkedin} onChange={(e) => setSocial('linkedin', e.target.value)} />
          <TextInput label="Twitter / X" type="url" value={s.socials.twitter} onChange={(e) => setSocial('twitter', e.target.value)} />
        </div>
      </Panel>

      <Panel title="Danger zone" description="Restore the original demo content. This removes all your edits.">
        <button
          type="button"
          className={`${ghostBtn} text-destructive`}
          onClick={() => {
            if (!window.confirm('Reset all projects, posts, messages and settings?')) return
            siteRepository.resetToDefaults()
            toast.success('Site reset to defaults')
          }}
        >
          <RotateCcw className="size-4" aria-hidden /> Reset demo data
        </button>
      </Panel>
    </form>
  )
}
