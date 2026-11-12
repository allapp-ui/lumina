'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'done'

export function DownloadCvButton({ url, fileName, className }: { url: string; fileName: string; className?: string }) {
  const [status, setStatus] = useState<Status>('idle')

  const handleClick = () => {
    if (status !== 'idle') return
    if (!url) {
      toast.error('CV is not available yet.')
      return
    }
    setStatus('loading')
    window.setTimeout(() => {
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || 'cv.pdf'
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setStatus('done')
      window.setTimeout(() => setStatus('idle'), 2200)
    }, 1100)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={cn(
        'glass relative inline-flex h-12 min-w-44 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold transition-colors hover:border-primary/50',
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan/25 to-violet/25"
        initial={false}
        animate={{ width: status === 'idle' ? '0%' : '100%' }}
        transition={{ duration: status === 'loading' ? 1.1 : 0.3, ease: 'easeInOut' }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center gap-2"
        >
          {status === 'idle' && (
            <>
              <Download className="size-4" aria-hidden /> Download CV
            </>
          )}
          {status === 'loading' && (
            <>
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="flex">
                <Download className="size-4" aria-hidden />
              </motion.span>
              Preparing…
            </>
          )}
          {status === 'done' && (
            <>
              <Check className="size-4 text-emerald-500" aria-hidden /> Downloaded
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
