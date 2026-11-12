import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Markdown({ content }: { content: string }) {
  return (
    <div className="max-w-none text-[17px] leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h2 className="mb-4 mt-10 text-3xl font-bold" {...p} />,
          h2: (p) => <h2 className="mb-4 mt-10 text-2xl font-bold" {...p} />,
          h3: (p) => <h3 className="mb-3 mt-8 text-xl font-semibold" {...p} />,
          p: (p) => <p className="my-5" {...p} />,
          a: (p) => <a className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...p} />,
          ul: (p) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-primary" {...p} />,
          ol: (p) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-primary" {...p} />,
          blockquote: (p) => <blockquote className="my-6 border-l-2 border-primary pl-4 italic text-muted-foreground" {...p} />,
          hr: () => <hr className="my-10 border-glass-border" />,
          img: ({ alt, src }) => (
            // eslint-disable-next-line @next/next/no-img-element -- markdown images can be any URL
            <img alt={alt ?? ''} src={typeof src === 'string' ? src : ''} className="my-6 rounded-2xl border border-glass-border" />
          ),
          pre: (p) => (
            <pre className="glass my-6 overflow-x-auto rounded-2xl p-5 font-mono text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0" {...p} />
          ),
          code: (p) => <code className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[0.85em] text-primary" {...p} />,
          table: (p) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...p} />
            </div>
          ),
          th: (p) => <th className="border-b border-glass-border px-3 py-2 text-left font-semibold" {...p} />,
          td: (p) => <td className="border-b border-glass-border px-3 py-2" {...p} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
