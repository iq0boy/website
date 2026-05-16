import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

interface Item {
  name: string;
  note: string;
  url?: string;
}

const SECTIONS: { titleKey: string; items: Item[] }[] = [
  {
    titleKey: 'uses_hw',
    items: [
      { name: 'MacBook Pro 14" — M3 Pro', note: '16 GB · plenty for Astro builds and a couple of Postgres containers' },
      { name: 'Dell U2723QE', note: '27" 4K, USB-C single-cable docking. Worth every euro.' },
      { name: 'Keychron Q2 Pro', note: 'Wireless, hot-swap, with KTT Strawberry switches.' },
      { name: 'Logitech MX Master 3S', note: 'Quiet click, perfect side scroll for wide spreadsheets.' },
      { name: 'AKG K371', note: 'Closed-back, neutral. The only headphones I’ve kept for 4+ years.' },
    ],
  },
  {
    titleKey: 'uses_editor',
    items: [
      { name: 'VS Code', note: 'Default, with Claude Code in the terminal pane for pair programming.', url: 'https://code.visualstudio.com' },
      { name: 'Ghostty', note: 'Fast, native, GPU-accelerated. Replaced iTerm.', url: 'https://ghostty.org' },
      { name: 'Zsh + Starship', note: 'Minimal prompt, fast cold start.', url: 'https://starship.rs' },
      { name: 'Raycast', note: 'Launcher, clipboard manager, snippet expansion, window manager.', url: 'https://raycast.com' },
    ],
  },
  {
    titleKey: 'uses_stack',
    items: [
      { name: 'Astro', note: 'For content sites — this one runs on it.', url: 'https://astro.build' },
      { name: 'Next.js', note: 'When the project needs server components or aggressive SSR.', url: 'https://nextjs.org' },
      { name: 'TypeScript', note: 'Strict mode, always. End-to-end.' },
      { name: 'PostgreSQL', note: 'Hosted on Neon or Supabase depending on the client.' },
      { name: 'Drizzle ORM', note: 'Schema-first, type-safe, no surprises.', url: 'https://orm.drizzle.team' },
      { name: 'Tailwind CSS', note: 'Pairs well with design tokens and CSS variables.' },
    ],
  },
  {
    titleKey: 'uses_design',
    items: [
      { name: 'Figma', note: 'For wireframes, hi-fi mocks, and design tokens.', url: 'https://figma.com' },
      { name: 'Linear', note: 'Project management that doesn’t hate developers.', url: 'https://linear.app' },
      { name: 'Penpot', note: 'Open-source alternative I reach for on FOSS-leaning clients.', url: 'https://penpot.app' },
    ],
  },
  {
    titleKey: 'uses_other',
    items: [
      { name: '1Password', note: 'Secrets, SSH keys, shared vaults with clients.' },
      { name: 'Fastmail', note: 'Email that respects you. Custom domains, no ads.', url: 'https://fastmail.com' },
      { name: 'Plausible', note: 'Privacy-friendly analytics, no cookies, GDPR-clean.', url: 'https://plausible.io' },
      { name: 'Hetzner', note: 'For when a Docker host beats a serverless invoice.', url: 'https://hetzner.com' },
    ],
  },
];

export default function UsesContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useRevealEffect();

  return (
    <div ref={ref} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('uses_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('uses_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="body-lg reveal" style={{ maxWidth: 640 }}>{t('uses_desc')}</p>
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(24px, 5vw, 80px)' }} />

      <section className="section-padding">
        <div className="container" style={{ display: 'grid', gap: 64 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} className="reveal">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  marginBottom: 32,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>
                  0{i + 1}
                </span>
                {t(s.titleKey)}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {s.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      paddingTop: 20,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.1rem',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          borderBottom: '1px solid var(--accent)',
                          paddingBottom: 1,
                        }}
                      >
                        {item.name} ↗
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{item.name}</span>
                    )}
                    <p
                      style={{
                        marginTop: 8,
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
