'use client'

import { useSyncExternalStore } from 'react'
import { DATA_VERSION, seedData } from './seed'
import type { ContactMessage, Post, Project, SiteData, SiteSettings } from './types'

/**
 * Mock persistence layer backed by localStorage.
 * Every mutation goes through `siteRepository`, so swapping this file for
 * fetch() calls to a real API/database later does not affect any UI code.
 */

const STORAGE_KEY = 'portfolio:data'

let state: SiteData = seedData
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SiteData
      if (parsed.version === DATA_VERSION) {
        state = { ...seedData, ...parsed, settings: { ...seedData.settings, ...parsed.settings } }
      }
    }
  } catch {
    state = seedData
  }
}

function commit(next: SiteData) {
  const serialized = JSON.stringify(next)
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized)
  } catch {
    throw new Error('Storage is full. Use an image URL instead of uploading large files.')
  }
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  load()
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      loaded = false
      load()
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot() {
  load()
  return state
}

function getServerSnapshot() {
  return seedData
}

export function useSiteData() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function createId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function uniqueSlug(base: string, taken: string[]) {
  const root = slugify(base) || 'untitled'
  let slug = root
  let i = 2
  while (taken.includes(slug)) slug = `${root}-${i++}`
  return slug
}

export const siteRepository = {
  saveProject(input: Omit<Project, 'id' | 'slug' | 'createdAt'> & { id?: string }) {
    const existing = input.id ? state.projects.find((p) => p.id === input.id) : undefined
    const others = state.projects.filter((p) => p.id !== input.id)
    const project: Project = {
      ...input,
      id: existing?.id ?? createId(),
      slug: uniqueSlug(input.title, others.map((p) => p.slug)),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    const projects = existing
      ? state.projects.map((p) => (p.id === project.id ? project : p))
      : [project, ...state.projects]
    commit({ ...state, projects })
    return project
  },
  deleteProject(id: string) {
    commit({ ...state, projects: state.projects.filter((p) => p.id !== id) })
  },
  savePost(input: Omit<Post, 'id' | 'slug' | 'createdAt'> & { id?: string }) {
    const existing = input.id ? state.posts.find((p) => p.id === input.id) : undefined
    const others = state.posts.filter((p) => p.id !== input.id)
    const post: Post = {
      ...input,
      id: existing?.id ?? createId(),
      slug: uniqueSlug(input.title, others.map((p) => p.slug)),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    const posts = existing ? state.posts.map((p) => (p.id === post.id ? post : p)) : [post, ...state.posts]
    commit({ ...state, posts })
    return post
  },
  deletePost(id: string) {
    commit({ ...state, posts: state.posts.filter((p) => p.id !== id) })
  },
  updateSettings(settings: SiteSettings) {
    commit({ ...state, settings })
  },
  addMessage(input: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>) {
    const message: ContactMessage = { ...input, id: createId(), read: false, createdAt: new Date().toISOString() }
    commit({ ...state, messages: [message, ...state.messages] })
  },
  markMessageRead(id: string, read = true) {
    commit({ ...state, messages: state.messages.map((m) => (m.id === id ? { ...m, read } : m)) })
  },
  deleteMessage(id: string) {
    commit({ ...state, messages: state.messages.filter((m) => m.id !== id) })
  },
  resetToDefaults() {
    commit(seedData)
  },
}

export function readingTime(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 220))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fileToDataUrl(file: File, maxBytes = 1.5 * 1024 * 1024) {
  return new Promise<string>((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`File is larger than ${Math.round(maxBytes / 1024 / 1024)}MB. Paste a URL instead.`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsDataURL(file)
  })
}
