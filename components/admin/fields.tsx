'use client'

import { ImagePlus, X } from 'lucide-react'
import { useId, useState, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { toast } from 'sonner'
import { fileToDataUrl } from '@/lib/store'
import { cn } from '@/lib/utils'

export const inputClass =
  'w-full rounded-xl border border-glass-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20'

export function Field({ label, hint, htmlFor, children, className }: { label: string; hint?: string; htmlFor?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function TextInput({ label, hint, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <input id={id} className={inputClass} {...props} />
    </Field>
  )
}

export function TextArea({ label, hint, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <textarea id={id} className={cn(inputClass, 'min-h-24 resize-y')} {...props} />
    </Field>
  )
}

export function TagInput({ label, value, onChange, placeholder, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string }) {
  const id = useId()
  const [draft, setDraft] = useState('')
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) onChange(Array.from(new Set([...value, ...parts])))
    setDraft('')
  }
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }
  return (
    <Field label={label} hint={hint ?? 'Press Enter or comma to add.'} htmlFor={id}>
      <div className={cn(inputClass, 'flex flex-wrap items-center gap-1.5 py-2')}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`} className="rounded hover:bg-primary/20">
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input id={id} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} onBlur={add} placeholder={value.length ? '' : placeholder} className="min-w-24 flex-1 bg-transparent outline-none" />
      </div>
    </Field>
  )
}

export function ImageInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId()
  const fileId = useId()
  return (
    <Field label={label} htmlFor={id} hint="Paste an image URL or upload a file (max 1.5MB in demo storage).">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-glass-border bg-background/40 sm:w-48">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- live preview of URL or data URL
            <img src={value} alt="Preview" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input id={id} value={value.startsWith('data:') ? '' : value} onChange={(e) => onChange(e.target.value)} placeholder={value.startsWith('data:') ? 'Uploaded file in use' : 'https://… or /images/…'} className={inputClass} />
          <div className="flex gap-2">
            <label htmlFor={fileId} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-glass-border px-3 py-2 text-xs font-medium hover:bg-foreground/5">
              <ImagePlus className="size-3.5" aria-hidden /> Upload image
            </label>
            <input
              id={fileId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                try {
                  onChange(await fileToDataUrl(file))
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Upload failed')
                }
              }}
            />
            {value && (
              <button type="button" onClick={() => onChange('')} className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-destructive">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </Field>
  )
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-muted')}
      >
        <span className={cn('absolute top-0.5 size-5 rounded-full bg-background shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  )
}

export function Panel({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

export const primaryBtn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60'
export const ghostBtn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-glass-border px-4 text-sm font-medium transition-colors hover:bg-foreground/5'
