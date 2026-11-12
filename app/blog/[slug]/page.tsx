import { PostDetail } from '@/components/site/post-detail'
import { SiteShell } from '@/components/site/site-shell'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <SiteShell>
      <PostDetail slug={slug} />
    </SiteShell>
  )
}
