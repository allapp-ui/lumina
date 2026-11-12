'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate, readingTime, useHydrated, useSiteData } from '@/lib/store'
import { Markdown } from './markdown'

export function PostDetail({ slug }: { slug: string }) {
  const { posts } = useSiteData()
  const hydrated = useHydrated()
  const post = posts.find((p) => p.slug === slug && p.published)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 pt-24 text-center">
        <p className="font-mono text-sm text-primary">{hydrated ? '404' : 'loading…'}</p>
        {hydrated && (
          <>
            <h1 className="mt-2 text-3xl font-bold">Article not found</h1>
            <Link href="/blog" className="mt-6 text-primary underline underline-offset-4">Back to blog</Link>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-cyan to-violet" />
      <article className="px-4 pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden /> All articles
          </Link>
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <p className="font-mono text-xs text-muted-foreground">
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time> · {readingTime(post.content)} min read
            </p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">{post.excerpt}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t} className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">#{t}</li>
              ))}
            </ul>
          </motion.header>
          {post.cover && (
            // eslint-disable-next-line @next/next/no-img-element -- supports admin-uploaded data URLs
            <img src={post.cover} alt="" className="mt-10 aspect-[16/9] w-full rounded-3xl border border-glass-border object-cover" />
          )}
          <div className="mt-10">
            <Markdown content={post.content} />
          </div>
        </div>
      </article>
    </>
  )
}
