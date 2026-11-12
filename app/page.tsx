import { BlogSection } from '@/components/site/blog-section'
import { ContactSection } from '@/components/site/contact-section'
import { Hero } from '@/components/site/hero'
import { ProjectsSection } from '@/components/site/projects-section'
import { SiteShell } from '@/components/site/site-shell'
import { Skills } from '@/components/site/skills'

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Skills />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </SiteShell>
  )
}
