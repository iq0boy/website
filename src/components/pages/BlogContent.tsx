import { useLang, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: number;
}

export default function BlogContent({ lang, posts }: { lang: Lang; posts: Post[] }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();
  const lp = (path: string) => localePath(lang, path);

  return (
    <div ref={containerRef} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 80px)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('blog')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('blog_title1')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('blog_title2')}</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: 540 }}>{t('blog_desc')}</p>
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(24px, 5vw, 80px)' }} />

      <section className="section-padding">
        <div className="container">
          {posts.length === 0 && (
            <div className="reveal" style={{ padding: '80px 0', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24 }}>
                {t('blog_empty_title')}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                {t('blog_empty_desc')}
              </p>
            </div>
          )}
          {posts.map((post, i) => (
            <div key={post.slug}>
              <a href={lp(`/blog/${post.slug}`)} className="blog-article" style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start', padding: '48px 0', cursor: 'pointer' }}>
                <div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '4px 10px', background: 'var(--bg-tertiary)', color: 'var(--accent)' }}>{post.category}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.readTime} {t('read')}</span>
                  </div>
                  <h2 className="blog-title">{post.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 600 }}>{post.excerpt}</p>
                </div>
                <div style={{ textAlign: 'right', paddingTop: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
              </a>
              {i < posts.length - 1 && <div className="divider" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
