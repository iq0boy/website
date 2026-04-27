import { useLang, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export default function BlogPostContent({ post, lang }: { post: Post; lang: Lang }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();
  const lp = (path: string) => localePath(lang, path);

  return (
    <div ref={containerRef} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 60 }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

          <a href={lp('/blog')} style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 40, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('back_to_blog')}
          </a>

          <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '4px 10px', background: 'var(--bg-tertiary)', color: 'var(--accent)' }}>{post.category}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.date}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.readTime} {t('read')}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: 40 }}>{post.title}</h1>

          <div className="divider" style={{ marginBottom: 40 }} />

          <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: 24, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{post.excerpt}</p>
            <p style={{ marginBottom: 24 }}>The landscape of modern web development continues to evolve at a rapid pace. As developers, we must stay ahead of the curve while building solutions that stand the test of time. This article explores the key principles and patterns that have proven effective across dozens of production applications.</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', margin: '48px 0 16px' }}>The Foundation</h2>
            <p style={{ marginBottom: 24 }}>Every great application starts with solid architectural decisions. Whether you're building a startup MVP or an enterprise platform, the fundamental principles remain the same: separation of concerns, clean abstractions, and pragmatic technology choices.</p>
            <blockquote style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 24, margin: '32px 0', fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              "The best code is the code that doesn't need to exist. Every abstraction should earn its place."
            </blockquote>
            <p style={{ marginBottom: 24 }}>In practice, this means starting simple and adding complexity only when the problem demands it. Premature optimization and over-engineering remain the most common pitfalls in modern development.</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', margin: '48px 0 16px' }}>Key Takeaways</h2>
            <p style={{ marginBottom: 24 }}>Build for the user first, scale second. Use boring technology where possible and novel solutions only where they provide genuine value. Test the critical path, document the decisions, and iterate based on real usage data.</p>
          </div>

          <div className="divider" style={{ margin: '60px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={lp('/blog')} className="btn-outline" style={{ fontSize: '0.85rem', padding: '12px 24px' }}>{t('all_articles')}</a>
            <a href={lp('/contact')} className="btn-outline" style={{ fontSize: '0.85rem', padding: '12px 24px' }}>{t('discuss_this')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
