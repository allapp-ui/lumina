import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminGate } from '@/components/admin/admin-gate'
import { AdminShell } from '@/components/admin/admin-shell'

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  )
}
