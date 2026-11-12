'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useHydrated } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = useHydrated()
  const isDark = !hydrated || resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-glass-border text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: -16, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 16, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {isDark ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
