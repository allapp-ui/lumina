'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Mail, Send } from 'lucide-react'
import { Github, Linkedin, Twitter } from './brand-icons'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { siteRepository, useSiteData } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Magnetic, Reveal, SectionHeading } from './motion'

type Field = 'name' | 'email' | 'subject' | 'message'
type Values = Record<Field, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (values.subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters.'
  if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'
  if (values.message.length > 2000) errors.message = 'Message must be under 2000 characters.'
  return errors
}

const empty: Values = { name: '', email: '', subject: '', message: '' }

export function ContactSection() {
  const { settings } = useSiteData()
  const [values, setValues] = useState<Values>(empty)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const errors = validate(values)

  const socials = [
    { label: 'GitHub', href: settings.socials.github, icon: Github, handle: settings.socials.github.replace(/^https?:\/\/(www\.)?/, '') },
    { label: 'LinkedIn', href: settings.socials.linkedin, icon: Linkedin, handle: settings.socials.linkedin.replace(/^https?:\/\/(www\.)?/, '') },
    { label: 'Twitter', href: settings.socials.twitter, icon: Twitter, handle: settings.socials.twitter.replace(/^https?:\/\/(www\.)?/, '') },
    { label: 'Email', href: `mailto:${settings.email}`, icon: Mail, handle: settings.email },
  ].filter((s) => s.href && s.href !== 'mailto:')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    if (Object.keys(errors).length) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    try {
      siteRepository.addMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      })
      toast.success('Message sent!', { description: "Thanks for reaching out — I'll reply within 24 hours." })
      setValues(empty)
      setTouched({})
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name: Field) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    'aria-invalid': Boolean(touched[name] && errors[name]),
    'aria-describedby': touched[name] && errors[name] ? `contact-${name}-error` : undefined,
    className: cn(
      'w-full rounded-xl border bg-background/50 px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:ring-2',
      touched[name] && errors[name]
        ? 'border-destructive/60 focus:ring-destructive/30'
        : touched[name] && !errors[name]
          ? 'border-emerald-500/50 focus:ring-emerald-500/20'
          : 'border-glass-border focus:border-primary/60 focus:ring-primary/20',
    ),
  })

  const ErrorText = ({ name }: { name: Field }) => (
    <AnimatePresence>
      {touched[name] && errors[name] && (
        <motion.p
          id={`contact-${name}-error`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 text-xs text-destructive"
        >
          {errors[name]}
        </motion.p>
      )}
    </AnimatePresence>
  )

  return (
    <section id="contact" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="contact"
          title="Let's build something great"
          description="Have a project in mind or just want to say hi? My inbox is always open."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="flex flex-col gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.label === 'Email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{s.label}</span>
                  <span className="block truncate font-mono text-xs text-muted-foreground">{s.handle}</span>
                </span>
              </a>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <form noValidate onSubmit={onSubmit} className="glass rounded-3xl p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">Name</label>
                  <input {...field('name')} autoComplete="name" placeholder="Jane Doe" />
                  <ErrorText name="name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">Email</label>
                  <input {...field('email')} type="email" autoComplete="email" placeholder="jane@company.com" />
                  <ErrorText name="email" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium">Subject</label>
                  <input {...field('subject')} placeholder="Project inquiry" />
                  <ErrorText name="subject" />
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="contact-message" className="block text-sm font-medium">Message</label>
                    <span className="font-mono text-[11px] text-muted-foreground">{values.message.length}/2000</span>
                  </div>
                  <textarea {...field('message')} rows={5} placeholder="Tell me about your project…" />
                  <ErrorText name="message" />
                </div>
              </div>
              <Magnetic className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px] shadow-primary/60 transition-opacity disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
