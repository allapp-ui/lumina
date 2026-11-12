'use client'

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  delay = 0,
  className,
  ...props
}: { children: ReactNode; delay?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function Magnetic({ children, className, strength = 0.3 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 })

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={cn('inline-flex', className)}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) * strength)
        y.set((e.clientY - rect.top - rect.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">{`// ${eyebrow}`}</p>
      <h2 className="text-balance text-3xl font-bold md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-pretty text-muted-foreground md:text-lg">{description}</p>}
    </Reveal>
  )
}
