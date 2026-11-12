import { Suspense } from 'react'
import { ProjectManager } from '@/components/admin/project-manager'

export default function AdminProjectsPage() {
  return (
    <Suspense>
      <ProjectManager />
    </Suspense>
  )
}
