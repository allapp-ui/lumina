'use client'

import { useEffect, useState } from 'react'

export function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const list = words.length ? words : ['Developer']
  const word = list[index % list.length]

  useEffect(() => {
    let delay: number
    if (!deleting && text === word) delay = 1600
    else if (deleting && text === '') delay = 300
    else if (deleting) delay = 35
    else delay = 55 + Math.random() * 90

    const timer = window.setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % list.length)
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [text, deleting, word, list.length])

  return (
    <span className="font-mono">
      <span className="text-primary">{'> '}</span>
      <span aria-hidden>{text}</span>
      <span className="sr-only">{list.join(', ')}</span>
      <span aria-hidden className="animate-blink ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] bg-primary" />
    </span>
  )
}
