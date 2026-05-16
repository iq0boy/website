import { useLang, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import { STATS, PROFILE } from '../../lib/profile';
import AvailabilityBadge from '../AvailabilityBadge';

const PRINCIPLES = [
  { titleKey: 'about_principle1_t', descKey: 'about_principle1_d' },
  { titleKey: 'about_principle2_t', descKey: 'about_principle2_d' },
  { titleKey: 'about_principle3_t', descKey: 'about_principle3_d' },
  { titleKey: 'about_principle4_t', descKey: 'about_principle4_d' },
];

export default function AboutContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useRevealEffect();
  const lp = (path: string) => localePath(lang, path);

  return (
    <div ref={ref} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 8vh, 80px)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('about_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 40 }}>
            {t('about_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-primary)' }}>
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>
            <p>{t('about_p3')}</p>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(40px, 6vh, 60px)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="reveal">
            <AvailabilityBadge lang={lang} variant="card" />
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('about_principles_label')}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 32,
              marginTop: 32,
            }}
          >
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: '2.5rem',
                    color: 'var(--accent)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: 16,
                  }}
                >
                  0{i + 1}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: 10 }}>{t(p.titleKey)}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t(p.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: 820 }}>
          <div
            className="reveal"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 32,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--accent)', lineHeight: 1 }}>
                {STATS.years}+
              </div>
              <p style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('stat_years')}
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--accent)', lineHeight: 1 }}>
                {STATS.projects}+
              </div>
              <p style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('stat_projects')}
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--accent)', lineHeight: 1 }}>
                {STATS.clients}+
              </div>
              <p style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('stat_clients')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px, 12vh, 140px) 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="heading-lg reveal" style={{ marginBottom: 32 }}>
            {t('home_cta_q')}{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('mind')}</span>?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={lp('/book')} className="btn-primary">{t('avail_cta_book')}</a>
            <a href={`mailto:${PROFILE.email}`} className="btn-outline">{PROFILE.email}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
