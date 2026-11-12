'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useSiteData } from '@/lib/store'
import { DownloadCvButton } from './download-cv-button'
import { HeroVisual } from './hero-visual'
import { Magnetic } from './motion'
import { Typewriter } from './typewriter'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
  const { settings } = useSiteData()

  return (
    <section id="top" className="relative flex min-h-svh items-center px-4 pb-16 pt-32 md:pt-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-start">
          <motion.div variants={item}>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs">
              <span className="relative flex size-2">
                {settings.available && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex size-2 rounded-full ${settings.available ? 'bg-emerald-400' : 'bg-muted-foreground'}`}
                />
              </span>
              {settings.available ? settings.availabilityText : 'Currently booked'}
            </span>
          </motion.div>

          <motion.p variants={item} className="mt-6 font-mono text-sm text-muted-foreground">
            {`Hi, I'm ${settings.name}`}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-3 text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {settings.headline.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-gradient">{settings.headline.split(' ').slice(-2).join(' ')}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 h-8 text-lg sm:text-xl">
            <Typewriter words={settings.roles} />
          </motion.p>

          <motion.p variants={item} className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {settings.bio}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="#projects"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px] shadow-primary/60 transition-shadow hover:shadow-[0_0_40px_-2px]"
              >
                Explore Projects
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic>
              <DownloadCvButton url={settings.cvUrl} fileName={settings.cvFileName} />
            </Magnetic>
          </motion.div>

          <motion.p variants={item} className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden /> {settings.location}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}
