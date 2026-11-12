'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Braces, Cpu, Database, GitBranch, Layers, Zap } from 'lucide-react'
import { useEffect } from 'react'

const faces = [
  { icon: Braces, transform: 'rotateY(0deg) translateZ(64px)' },
  { icon: Database, transform: 'rotateY(90deg) translateZ(64px)' },
  { icon: Cpu, transform: 'rotateY(180deg) translateZ(64px)' },
  { icon: Layers, transform: 'rotateY(-90deg) translateZ(64px)' },
  { icon: Zap, transform: 'rotateX(90deg) translateZ(64px)' },
  { icon: GitBranch, transform: 'rotateX(-90deg) translateZ(64px)' },
]

const codeLines = [
  { indent: 0, tokens: [['const', 'text-violet'], [' developer', 'text-foreground'], [' = {', 'text-muted-foreground']] },
  { indent: 1, tokens: [['stack', 'text-cyan'], [': [', 'text-muted-foreground'], ["'Next.js'", 'text-emerald-500'], [', ', 'text-muted-foreground'], ["'Node'", 'text-emerald-500'], ['],', 'text-muted-foreground']] },
  { indent: 1, tokens: [['focus', 'text-cyan'], [': ', 'text-muted-foreground'], ["'performance'", 'text-emerald-500'], [',', 'text-muted-foreground']] },
  { indent: 1, tokens: [['coffee', 'text-cyan'], [': ', 'text-muted-foreground'], ['Infinity', 'text-amber-500'], [',', 'text-muted-foreground']] },
  { indent: 1, tokens: [['ship', 'text-cyan'], [': () => ', 'text-muted-foreground'], ["'daily'", 'text-emerald-500']] },
  { indent: 0, tokens: [['}', 'text-muted-foreground']] },
] as const

export function HeroVisual() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 120, damping: 18 })
  const rotateX = useSpring(useTransform(my, [-1, 1], [14, -14]), { stiffness: 120, damping: 18 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md [perspective:1200px]" aria-hidden>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative size-full">
        <div
          className="absolute inset-[12%] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--neon-cyan), var(--neon-violet) 60%, transparent 75%)',
            opacity: 'var(--glow-opacity)',
            transform: 'translateZ(-120px)',
          }}
        />

        <div className="absolute right-[6%] top-[4%] [transform-style:preserve-3d]" style={{ transform: 'translateZ(-40px)' }}>
          <div className="animate-float-slow [transform-style:preserve-3d]">
            <motion.div
              className="relative size-32 [transform-style:preserve-3d]"
              animate={{ rotateY: 360, rotateX: [20, -20, 20] }}
              transition={{ rotateY: { duration: 18, repeat: Infinity, ease: 'linear' }, rotateX: { duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
            >
              {faces.map(({ icon: Icon, transform }, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl border border-cyan/40 bg-gradient-to-br from-cyan/15 to-violet/20 backdrop-blur-md"
                  style={{ transform }}
                >
                  <Icon className="size-10 text-cyan" strokeWidth={1.5} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div
          className="glass absolute bottom-[12%] left-0 w-[88%] overflow-hidden rounded-2xl bg-card/60 shadow-2xl shadow-violet/10"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex items-center gap-1.5 border-b border-glass-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">developer.ts</span>
          </div>
          <pre className="overflow-hidden p-4 font-mono text-[12px] leading-6 sm:text-[13px]">
            {codeLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-4 select-none text-right text-muted-foreground/50">{i + 1}</span>
                <span style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
                  {line.tokens.map(([t, c], j) => (
                    <span key={j} className={c}>
                      {t}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>

        <div
          className="glass absolute left-[4%] top-[18%] flex items-center gap-2 rounded-xl bg-card/60 px-3 py-2 font-mono text-xs shadow-lg"
          style={{ transform: 'translateZ(120px)' }}
        >
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400" />
          build passing
        </div>
        <div
          className="glass absolute bottom-[4%] right-[2%] rounded-xl bg-card/60 px-3 py-2 font-mono text-xs shadow-lg"
          style={{ transform: 'translateZ(140px)' }}
        >
          <span className="text-cyan">lighthouse</span> <span className="text-foreground">100</span>
        </div>
      </motion.div>
    </div>
  )
}
