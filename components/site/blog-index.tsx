'use client'

import { useSiteData } from '@/lib/store'
import { Reveal, SectionHeading } from './motion'
import { PostCard } from './post-card'

export function BlogIndex() {
  const { posts } = useSiteData()
  const published = posts.filter((p) => p.published)
  return (
    <section className="px-4 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="blog" title="Articles & notes" description="Writing about frontend architecture, design systems and shipping fast." />
        {published.length === 0 ? (
          <p className="text-center text-muted-foreground">No articles published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {published.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.08}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
