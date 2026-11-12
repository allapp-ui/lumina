'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Layers, Target } from 'lucide-react'
import { Github } from './brand-icons'
import Link from 'next/link'
import { useState } from 'react'
import { useHydrated, useSiteData } from '@/lib/store'
import { Reveal } from './motion'

export function ProjectDetail({ slug }: { slug: string }) {
  const { projects } = useSiteData()
  const hydrated = useHydrated()
  const project = projects.find((p) => p.slug === slug)
  const [active, setActive] = useState(0)

  if (!project) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 pt-24 text-center">
        <p className="font-mono text-sm text-primary">{hydrated ? '404' : 'loading…'}</p>
        {hydrated && (
          <>
            <h1 className="mt-2 text-3xl font-bold">Project not found</h1>
            <Link href="/#projects" className="mt-6 text-primary underline underline-offset-4">
              Back to projects
            </Link>
          </>
        )}
      </div>
    )
  }

  const images = [project.image, ...project.gallery].filter(Boolean)
  const others = projects.filter((p) => p.id !== project.id).slice(0, 2)

  return (
    <article className="px-4 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> All projects
        </Link>

        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">{project.category}</span>
          <h1 className="mt-2 text-balance text-4xl font-bold md:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                Live demo <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold">
                <Github className="size-4" aria-hidden /> Source code
              </a>
            )}
          </div>
        </motion.header>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="glass mt-10 overflow-hidden rounded-3xl p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- supports admin-uploaded data URLs */}
          <img src={images[active] || '/placeholder.svg'} alt={`${project.title} screenshot ${active + 1}`} className="aspect-[16/10] w-full rounded-2xl object-cover" />
        </motion.div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={`${src.slice(0, 40)}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show screenshot ${i + 1}`}
                aria-pressed={active === i}
                className={`shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${active === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail */}
                <img src={src} alt="" className="h-16 w-28 object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Target className="size-5 text-primary" aria-hidden /> The problem
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.08} className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Layers className="size-5 text-accent" aria-hidden /> Architecture
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{project.architecture}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-glass-border bg-background/40 px-3 py-1 font-mono text-xs">{t}</li>
              ))}
            </ul>
          </Reveal>
          {project.features.length > 0 && (
            <Reveal delay={0.12} className="glass rounded-3xl p-6 md:col-span-2">
              <h2 className="text-lg font-semibold">Key features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        {others.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold">More projects</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.id} href={`/projects/${p.slug}`} className="glass group flex items-center gap-4 rounded-2xl p-3 hover:border-primary/40">
                  {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail */}
                  <img src={p.image || '/placeholder.svg'} alt="" className="h-16 w-24 rounded-xl object-cover" />
                  <span>
                    <span className="block font-semibold group-hover:text-primary">{p.title}</span>
                    <span className="block text-xs text-muted-foreground">{p.category}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
