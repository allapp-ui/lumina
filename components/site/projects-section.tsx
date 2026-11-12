'use client'

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useSiteData } from '@/lib/store'
import { cn } from '@/lib/utils'
import { SectionHeading } from './motion'
import { ProjectCard } from './project-card'

export function ProjectsSection() {
  const { projects } = useSiteData()
  const [filter, setFilter] = useState('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects])
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="projects"
          title="Selected work"
          description="A few products I've designed, engineered and shipped recently."
        />

        <LayoutGroup>
          <div role="toolbar" aria-label="Filter projects" className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={filter === cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm transition-colors',
                  filter === cat ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {filter === cat && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
          {visible.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No projects in this category yet.</p>
          )}
        </LayoutGroup>
      </div>
    </section>
  )
}
