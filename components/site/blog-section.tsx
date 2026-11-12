'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSiteData } from '@/lib/store'
import { Reveal, SectionHeading } from './motion'
import { PostCard } from './post-card'

export function BlogSection() {
  const { posts } = useSiteData()
  const published = posts.filter((p) => p.published).slice(0, 3)
  if (published.length === 0) return null

  return (
    <section id="blog" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="writing" title="Notes from the terminal" description="Technical deep-dives on the things I build." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {published.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="glass group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium hover:border-primary/40"
          >
            Read all articles <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
