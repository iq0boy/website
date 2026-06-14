import { useState, useEffect } from 'react';
import { useLang, useAnimatedCounter, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import type { ProjectItem } from '../PortfolioGrid';
import Testimonials from '../Testimonials';
import AvailabilityBadge from '../AvailabilityBadge';
import { STATS } from '../../lib/profile';

function HeroGradients() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handler = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return (
    <>
      <div style={{ position: 'absolute', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', top: '10%', right: '-15%', transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`, transition: 'transform 0.8s ease-out', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, oklch(0.6 0.12 280 / 0.04) 0%, transparent 70%)', bottom: '-10%', left: '-10%', transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`, transition: 'transform 0.8s ease-out', pointerEvents: 'none' }} />
    </>
  );
}

const MARQUEE_ITEMS = ['Web Development', 'UI/UX Design', 'React', 'Node.js', 'TypeScript', 'AI Integration', 'Next.js', 'PostgreSQL'];

function Counter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useAnimatedCounter(end);
  return (
    <div ref={ref as any} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: 'var(--accent)', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 12 }}>{label}</p>
    </div>
  );
}

export default function HomeContent({ lang, featuredProjects }: { lang: Lang; featuredProjects: ProjectItem[] }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();
  const lp = (path: string) => localePath(lang, path);

  const services = [
    { icon: '⟨/⟩', titleKey: 'svc_web_t', descKey: 'svc_web_d' },
    { icon: '◐', titleKey: 'svc_ui_t', descKey: 'svc_ui_d' },
    { icon: '⊞', titleKey: 'svc_ai_t', descKey: 'svc_ai_d' },
    { icon: '↗', titleKey: 'svc_cons_t', descKey: 'svc_cons_d' },
  ];

  const stats = [
    { num: STATS.years, suffix: '+', labelKey: 'stat_years' },
    { num: STATS.projects, suffix: '+', labelKey: 'stat_projects' },
    { num: STATS.clients, suffix: '+', labelKey: 'stat_clients' },
  ];

  return (
    <div ref={containerRef} className="page-wrapper">
      {/* Hero */}
      <section className="hero-section">
        <HeroGradients />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('home_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('home_title_1')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('home_title_2')}</span>{' '}
            {t('home_title_3')}
          </h1>
          <div className="reveal" style={{ maxWidth: 520, marginBottom: 32 }}>
            <p className="body-lg">{t('home_desc')}</p>
          </div>
          <div className="reveal" style={{ marginBottom: 32 }}>
            <AvailabilityBadge lang={lang} variant="compact" />
          </div>
          <div className="reveal" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href={lp('/book')} className="btn-primary">
              {t('home_cta_start')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href={lp('/portfolio')} className="btn-outline">{t('home_cta_work')}</a>
          </div>
        </div>
        <div className="scroll-indicator">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('scroll')}</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">{item}<span className="marquee-dot">◆</span></span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48 }}>
            {stats.map((s, i) => (
              <Counter key={i} end={s.num} suffix={s.suffix} label={t(s.labelKey)} />
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('home_what')}</p>
          <h2 className="heading-lg reveal" style={{ marginBottom: 64 }}>
            {t('home_services')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border)' }}>
            {services.map((s, i) => (
              <div key={i} className="service-card-home">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--accent)', display: 'block', marginBottom: 20 }}>{s.icon}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>{t(s.titleKey)}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t(s.descKey)}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <a href={lp('/services')} className="btn-outline">
              {t('all_services')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="section-padding">
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('selected_work')}</p>
          <h2 className="heading-lg reveal" style={{ marginBottom: 64 }}>
            {t('portfolio')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 24 }}>
            {featuredProjects.map(p => (
              <a key={p.slug} href={lp(`/portfolio/${p.slug}`)} className="feat-card" style={{ display: 'block', textDecoration: 'none' }}>
                <div className="feat-thumb" style={{ background: p.color, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'oklch(0.7 0 0)', overflow: 'hidden' }}>
                  {p.image ? (
                    <img
                      src={p.image.src}
                      alt={p.title}
                      width={p.image.width}
                      height={p.image.height}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                    />
                  ) : (
                    '[ project screenshot ]'
                  )}
                </div>
                <div className="feat-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'oklch(0.95 0 0)' }}>{p.title}</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'oklch(0.75 0 0)', flexShrink: 0, marginTop: 8 }}>{p.year}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '4px 10px', border: '1px solid oklch(0.65 0 0)', color: 'oklch(0.85 0 0)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <a href={lp('/portfolio')} className="btn-outline">{t('view_all_projects')}</a>
          </div>
        </div>
      </section>

      <Testimonials lang={lang} />

      {/* CTA */}
      <section style={{ padding: 'clamp(80px, 15vh, 180px) 0', background: 'var(--bg-secondary)', textAlign: 'center' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('lets_work')}</p>
          <h2 className="heading-lg" style={{ marginBottom: 32 }}>
            {t('home_cta_q')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('mind')}</span>?
          </h2>
          <a href={lp('/contact')} className="btn-primary">
            {t('get_in_touch')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    </div>
  );
}
