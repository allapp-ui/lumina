'use client'

import { motion } from 'framer-motion'
import { Code2, Gauge, Server, Wrench } from 'lucide-react'
import { Reveal, SectionHeading } from './motion'

const groups = [
  {
    title: 'Frontend',
    icon: Code2,
    blurb: 'Interfaces that are fast, accessible and a joy to use.',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    className: 'md:col-span-2',
  },
  {
    title: 'Backend',
    icon: Server,
    blurb: 'Reliable APIs and data layers that scale.',
    items: ['Node.js', 'PostgreSQL', 'GraphQL', 'Redis', 'Python'],
    className: 'md:row-span-2',
  },
  {
    title: 'Tools & Cloud',
    icon: Wrench,
    blurb: 'Shipping pipelines and infrastructure.',
    items: ['Vercel', 'Docker', 'AWS', 'GitHub Actions', 'Figma'],
    className: '',
  },
]

const stats = [
  { value: '7+', label: 'Years shipping' },
  { value: '60+', label: 'Projects delivered' },
  { value: '99', label: 'Avg. Lighthouse' },
]

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="skills"
          title="A modern stack, end to end"
          description="From pixel-perfect UI to production infrastructure, I own the full lifecycle of a product."
        />

        <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-3">
          {groups.map((group, gi) => (
            <Reveal
              key={group.title}
              delay={gi * 0.08}
              className={`glass group relative overflow-hidden rounded-3xl p-6 transition-colors hover:border-primary/40 ${group.className}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <group.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{group.blurb}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {group.items.map((skill, i) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="rounded-full border border-glass-border bg-background/40 px-3 py-1.5 font-mono text-xs"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.24} className="glass rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Gauge className="size-5" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold">By the numbers</h3>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-muted-foreground sm:text-sm">{s.label}</dt>
                  <dd className="text-gradient font-heading text-3xl font-bold sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
