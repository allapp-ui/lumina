import { ProjectDetail } from '@/components/site/project-detail'
import { SiteShell } from '@/components/site/site-shell'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <SiteShell>
      <ProjectDetail slug={slug} />
    </SiteShell>
  )
}
