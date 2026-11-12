import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate, readingTime } from '@/lib/store'
import type { Post } from '@/lib/types'

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl transition-colors hover:border-primary/40">
      <div className="aspect-[16/9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- supports admin-uploaded data URLs */}
        <img
          src={post.cover || '/placeholder.svg'}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs text-muted-foreground">
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          {' · '}
          {readingTime(post.content)} min read
        </p>
        <h3 className="mt-2 text-balance text-xl font-semibold">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <ul className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
                #{t}
              </li>
            ))}
          </ul>
          <ArrowUpRight
            className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </div>
      </div>
    </article>
  )
}
