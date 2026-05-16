import { useEffect, useState } from 'react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export default function TableOfContents({ headings, label }: { headings: Heading[]; label: string }) {
  const [activeId, setActiveId] = useState<string>('');
  const items = headings.filter(h => h.depth === 2 || h.depth === 3);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: '0% 0% -80% 0%', threshold: [0, 1] }
    );
    for (const h of items) {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      style={{
        position: 'sticky',
        top: 120,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        lineHeight: 1.5,
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
      }}
    >
      <p
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}
      >
        {label}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map(h => {
          const active = activeId === h.slug;
          return (
            <li key={h.slug} style={{ paddingLeft: h.depth === 3 ? 14 : 0 }}>
              <a
                href={`#${h.slug}`}
                style={{
                  display: 'block',
                  padding: '6px 0',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                  paddingLeft: 12,
                  marginLeft: -12,
                  textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
