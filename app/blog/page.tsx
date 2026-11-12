import type { Metadata } from 'next'
import { BlogIndex } from '@/components/site/blog-index'
import { SiteShell } from '@/components/site/site-shell'

export const metadata: Metadata = { title: 'Blog', description: 'Technical articles on web development and design.' }

export default function BlogPage() {
  return (
    <SiteShell>
      <BlogIndex />
    </SiteShell>
  )
}
