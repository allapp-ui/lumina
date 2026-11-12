export type ProjectCategory = 'Web App' | 'AI' | 'Mobile' | 'E-commerce' | 'Open Source'

export const PROJECT_CATEGORIES: ProjectCategory[] = ['Web App', 'AI', 'Mobile', 'E-commerce', 'Open Source']

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  problem: string
  architecture: string
  features: string[]
  image: string
  gallery: string[]
  tech: string[]
  category: ProjectCategory
  liveUrl: string
  githubUrl: string
  featured: boolean
  createdAt: string
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover: string
  tags: string[]
  published: boolean
  createdAt: string
}

export interface SiteSettings {
  name: string
  initials: string
  headline: string
  bio: string
  roles: string[]
  location: string
  email: string
  cvUrl: string
  cvFileName: string
  available: boolean
  availabilityText: string
  socials: {
    github: string
    linkedin: string
    twitter: string
  }
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface SiteData {
  version: number
  projects: Project[]
  posts: Post[]
  settings: SiteSettings
  messages: ContactMessage[]
}
