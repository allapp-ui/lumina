'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Github } from './brand-icons'
import Link from 'next/link'
import type { Project } from '@/lib/types'

export function ProjectCard({ project }: { project: Project }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 })
  const glareX = useTransform(x, (v) => `${v * 100}%`)
  const glareY = useTransform(y, (v) => `${v * 100}%`)
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.14), transparent 50%)`,
  )

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="[perspective:1000px]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const rect = e.currentTarget.getBoundingClientRect()
          x.set((e.clientX - rect.left) / rect.width)
          y.set((e.clientY - rect.top) / rect.height)
        }}
        onPointerLeave={() => {
          x.set(0.5)
          y.set(0.5)
        }}
        className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl transition-colors hover:border-primary/40"
      >
        <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity group-hover:opacity-100" />
        <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- supports admin-uploaded data URLs */}
          <img
            src={project.image || '/placeholder.svg'}
            alt={`${project.title} preview`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="glass absolute left-3 top-3 rounded-full bg-background/50 px-3 py-1 font-mono text-[11px]">
            {project.category}
          </span>
        </Link>
        <div className="flex flex-1 flex-col p-5" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-xl font-semibold">
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus:outline-none">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.tech.slice(0, 4).map((t) => (
              <li key={t} className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
                {t}
              </li>
            ))}
            {project.tech.length > 4 && (
              <li className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                +{project.tech.length - 4}
              </li>
            )}
          </ul>
          <div className="relative z-20 mt-auto flex items-center gap-2 pt-5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-85"
              >
                Live demo <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source on GitHub`}
                className="inline-flex size-8 items-center justify-center rounded-full border border-glass-border transition-colors hover:bg-foreground/5"
              >
                <Github className="size-4" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}
