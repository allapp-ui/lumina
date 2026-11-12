'use client'

import { Lock, Terminal } from 'lucide-react'
import Link from 'next/link'
import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react'
import { inputClass, primaryBtn } from './fields'

/**
 * Demo-only gate so the dashboard works instantly in preview.
 * Replace with real server-side auth (e.g. Better Auth) before deploying publicly.
 */
const SESSION_KEY = 'portfolio:admin-session'
export const DEMO_PASSCODE = 'admin'
const listeners = new Set<() => void>()

export const adminSession = {
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  get: () => window.sessionStorage.getItem(SESSION_KEY) === '1',
  set(on: boolean) {
    if (on) window.sessionStorage.setItem(SESSION_KEY, '1')
    else window.sessionStorage.removeItem(SESSION_KEY)
    listeners.forEach((l) => l())
  },
}

export function AdminGate({ children }: { children: ReactNode }) {
  const authed = useSyncExternalStore(adminSession.subscribe, adminSession.get, () => null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (authed === null) return null
  if (authed) return <>{children}</>

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (code === DEMO_PASSCODE) adminSession.set(true)
    else setError('Incorrect passcode.')
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <form onSubmit={onSubmit} className="glass w-full max-w-sm rounded-3xl p-8">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-5" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Admin access</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your passcode to manage the site.</p>
        <label htmlFor="passcode" className="mt-6 block text-sm font-medium">Passcode</label>
        <input
          id="passcode"
          type="password"
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby="passcode-help"
          className={`${inputClass} mt-1.5`}
        />
        <p id="passcode-help" className={`mt-1.5 text-xs ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
          {error || (
            <>
              <Terminal className="mr-1 inline size-3" aria-hidden />
              Demo passcode: <code className="font-mono text-primary">{DEMO_PASSCODE}</code>
            </>
          )}
        </p>
        <button type="submit" className={`${primaryBtn} mt-6 w-full`}>Unlock dashboard</button>
        <Link href="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
          Back to site
        </Link>
      </form>
    </main>
  )
}
