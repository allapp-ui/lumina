export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] opacity-60" />
      <div
        className="absolute -left-40 -top-40 size-[36rem] rounded-full blur-[120px]"
        style={{ background: 'var(--neon-cyan)', opacity: 'var(--glow-opacity)' }}
      />
      <div
        className="absolute -right-40 top-1/3 size-[32rem] rounded-full blur-[140px]"
        style={{ background: 'var(--neon-violet)', opacity: 'var(--glow-opacity)' }}
      />
    </div>
  )
}
