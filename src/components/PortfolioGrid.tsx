import { useState } from 'react';
import { useLang, useReveal, localePath } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

export type ProjectItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  year: string;
  color: string;
  image?: { src: string; width: number; height: number };
};

function ProjectCard({ project, index, lang }: { project: ProjectItem; index: number; lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useReveal();

  return (
    <div ref={ref as any} className="reveal proj-card" style={{ transitionDelay: `${index * 0.08}s` }}>
      <div className="proj-thumb" style={{ background: project.color, height: 320, position: 'relative', overflow: 'hidden' }}>
        {project.image ? (
          <img
            src={project.image.src}
            alt={project.title}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'oklch(0.8 0 0 / 0.55)',
          }}>{project.category}</div>
        )}
        <a href={localePath(lang, `/portfolio/${project.slug}`)} className="proj-overlay" style={{ textDecoration: 'none' }}>
          <span style={{
            padding: '12px 28px', border: '1px solid oklch(0.95 0 0)', color: 'oklch(0.95 0 0)',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>{t('view_project')}</span>
        </a>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <h3 className="proj-title">{project.title}</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, marginTop: 8 }}>{project.year}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>{project.excerpt}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '3px 8px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioGrid({ lang, projects }: { lang: Lang; projects: ProjectItem[] }) {
  const { t } = useLang(lang);
  const [filter, setFilter] = useState('All');

  const categoryLabels: Record<string, string> = {
    'All': t('cat_all'), 'Web App': t('cat_webapp'), 'Mobile': t('cat_mobile'), 'AI': t('cat_ai'),
  };
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '8px 20px',
            background: filter === cat ? 'var(--accent)' : 'transparent',
            color: filter === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
            border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}`,
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease',
          }}>{categoryLabels[cat] || cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 24 }}>
        {filtered.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} lang={lang} />
        ))}
      </div>
    </>
  );
}
