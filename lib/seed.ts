import type { SiteData } from './types'

export const DATA_VERSION = 1

export const seedData: SiteData = {
  version: DATA_VERSION,
  settings: {
    name: 'Alex Rivera',
    initials: 'AR',
    headline: 'I build fast, beautiful products for the web.',
    bio: 'Full-stack engineer with 7+ years shipping production apps in React, Next.js, Node and Postgres. I care about performance, accessibility and interfaces that feel effortless.',
    roles: ['Full-Stack Web Developer', 'UI/UX Architect', 'Problem Solver', 'Open Source Contributor'],
    location: 'Lisbon, Portugal · Remote',
    email: 'hello@alexrivera.dev',
    cvUrl: '/alex-rivera-cv.pdf',
    cvFileName: 'alex-rivera-cv.pdf',
    available: true,
    availabilityText: 'Available for freelance',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
    },
  },
  projects: [
    {
      id: 'p1',
      slug: 'nebula-analytics',
      title: 'Nebula Analytics',
      description: 'Real-time product analytics platform processing 40M events per day with sub-second dashboards.',
      problem:
        'Product teams were waiting hours for batch reports to answer basic questions about user behavior. They needed live funnels, retention and segmentation without writing SQL.',
      architecture:
        'Event ingestion through an edge collector into a streaming queue, materialized into ClickHouse rollups. A Next.js App Router frontend streams query results with React Server Components and caches hot dashboards at the edge.',
      features: [
        'Live dashboards with sub-second query latency',
        'Drag-and-drop funnel and retention builder',
        'Role-based workspaces and SSO',
        'Scheduled Slack and email digests',
      ],
      image: '/images/projects/nebula-analytics.png',
      gallery: ['/images/projects/nebula-analytics.png'],
      tech: ['Next.js', 'TypeScript', 'ClickHouse', 'Kafka', 'Tailwind CSS'],
      category: 'Web App',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      createdAt: '2026-08-12T10:00:00.000Z',
    },
    {
      id: 'p2',
      slug: 'synapse-ai',
      title: 'Synapse AI',
      description: 'An AI pair-programmer for internal codebases with retrieval over docs, tickets and source.',
      problem:
        'Engineers spent a large share of their week hunting for context across repositories, wikis and tickets before they could write a single line of code.',
      architecture:
        'Incremental indexing pipeline chunks and embeds repositories into a vector store. A streaming chat UI built with the AI SDK calls tools for code search, file reading and ticket lookup.',
      features: [
        'Streaming answers with cited sources',
        'Tool calling for code search and ticket lookup',
        'Per-team permissions on indexed content',
        'Usage analytics and feedback loop',
      ],
      image: '/images/projects/synapse-ai.png',
      gallery: ['/images/projects/synapse-ai.png'],
      tech: ['Next.js', 'AI SDK', 'Postgres', 'pgvector', 'Python'],
      category: 'AI',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      createdAt: '2026-06-02T10:00:00.000Z',
    },
    {
      id: 'p3',
      slug: 'orbit-commerce',
      title: 'Orbit Commerce',
      description: 'Headless storefront with instant search, edge-rendered product pages and one-click checkout.',
      problem:
        'A growing sneaker brand was losing mobile customers to slow page loads and a checkout flow with seven steps.',
      architecture:
        'Headless commerce backend with a statically generated catalog and on-demand revalidation. Search runs on a hosted index, and checkout is handled by Stripe with server-side price validation.',
      features: [
        'Sub-100ms instant search',
        'Edge-cached product pages with ISR',
        'One-click checkout with Stripe',
        '42% lift in mobile conversion',
      ],
      image: '/images/projects/orbit-commerce.png',
      gallery: ['/images/projects/orbit-commerce.png'],
      tech: ['Next.js', 'Stripe', 'Shopify', 'Algolia', 'Framer Motion'],
      category: 'E-commerce',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false,
      createdAt: '2026-03-18T10:00:00.000Z',
    },
    {
      id: 'p4',
      slug: 'pulse-fitness',
      title: 'Pulse Fitness',
      description: 'Cross-platform fitness tracker with adaptive training plans and wearable sync.',
      problem:
        'Generic workout plans lead to drop-off. Users wanted training that adapts to how they actually recover and perform.',
      architecture:
        'React Native app sharing a typed API client with the web dashboard. A Node service syncs wearable data and recalculates plans nightly with a lightweight scoring model.',
      features: [
        'Adaptive weekly training plans',
        'Apple Health and Google Fit sync',
        'Offline-first workout logging',
        'Streaks, rings and social challenges',
      ],
      image: '/images/projects/pulse-mobile.png',
      gallery: ['/images/projects/pulse-mobile.png'],
      tech: ['React Native', 'Expo', 'Node.js', 'GraphQL', 'Postgres'],
      category: 'Mobile',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false,
      createdAt: '2025-11-05T10:00:00.000Z',
    },
  ],
  posts: [
    {
      id: 'b1',
      slug: 'server-components-in-production',
      title: 'Lessons from a year of React Server Components in production',
      excerpt: 'What worked, what bit us, and the mental model that finally made RSC click for our whole team.',
      cover: '/images/blog/server-components.png',
      tags: ['React', 'Next.js', 'Architecture'],
      published: true,
      createdAt: '2026-10-21T09:00:00.000Z',
      content: `Server Components changed how we think about the boundary between data and UI. After a year of running them in production, here is what we learned.

## Start with the data, not the component tree

The biggest shift is deciding **where data lives** before deciding where components live. Fetch close to where the data is used, and let the framework deduplicate requests.

\`\`\`tsx
export default async function Page() {
  const projects = await getProjects()
  return <ProjectGrid projects={projects} />
}
\`\`\`

## Keep client components at the leaves

Interactivity is a leaf concern. Buttons, inputs and animations become small client islands inside a mostly-server tree.

- Smaller bundles
- Fewer waterfalls
- Easier caching

> The fastest JavaScript is the JavaScript you never send.

## Cache deliberately

Explicit caching with \`use cache\` made our performance predictable. We cache pages that are the same for everyone, and stream everything personal.`,
    },
    {
      id: 'b2',
      slug: 'design-systems-that-scale',
      title: 'Design systems that scale beyond the first team',
      excerpt: 'Tokens, composition and documentation patterns that keep a design system alive as an org grows.',
      cover: '/images/blog/design-systems.png',
      tags: ['Design Systems', 'CSS', 'UI/UX'],
      published: true,
      createdAt: '2026-09-04T09:00:00.000Z',
      content: `A design system is a product, and its users are your engineers and designers.

## Tokens first

Semantic tokens such as \`--background\` and \`--primary\` let you re-theme an entire product without touching components.

## Compose, do not configure

Prefer small composable primitives over components with twenty boolean props.

1. Primitives handle behavior and accessibility
2. Patterns combine primitives
3. Product teams compose patterns

## Document with real examples

Every component page should show the component in a realistic product context, not floating alone on a white canvas.`,
    },
  ],
  messages: [],
}
