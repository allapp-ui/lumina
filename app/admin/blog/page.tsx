import { Suspense } from 'react'
import { BlogManager } from '@/components/admin/blog-manager'

export default function AdminBlogPage() {
  return (
    <Suspense>
      <BlogManager />
    </Suspense>
  )
}
