import { useLang, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

const BLOCKS = [
  { titleKey: 'collab_white_t', descKey: 'collab_white_d' },
  { titleKey: 'collab_scope_t', descKey: 'collab_scope_d' },
  { titleKey: 'collab_avail_t', descKey: 'collab_avail_d' },
  { titleKey: 'collab_rates_t', descKey: 'collab_rates_d' },
];

export default function CollaborateContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useRevealEffect();
  const lp = (path: string) => localePath(lang, path);

  return (
    <div ref={ref} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('collab_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('collab_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="body-lg reveal" style={{ maxWidth: 640 }}>{t('collab_desc')}</p>
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(24px, 5vw, 80px)' }} />

      <section className="section-padding">
        <div className="container" style={{ maxWidth: 980 }}>
          <div style={{ display: 'grid', gap: 0 }}>
            {BLOCKS.map((b, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  gap: 20,
                  padding: '40px 0',
                  borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)',
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', color: 'var(--accent)' }}>
                    0{i + 1}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                      lineHeight: 1.2,
                    }}
                  >
                    {t(b.titleKey)}
                  </h3>
                </div>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.02rem',
                    lineHeight: 1.7,
                    paddingLeft: 'clamp(0px, 8vw, 80px)',
                    maxWidth: 760,
                  }}
                >
                  {t(b.descKey)}
                </p>
              </div>
            ))}
          </div>

          <div
            className="reveal"
            style={{
              marginTop: 64,
              padding: 40,
              background: 'var(--bg-secondary)',
              borderRadius: 6,
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                flex: 1,
                minWidth: 240,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                lineHeight: 1.3,
              }}
            >
              {t('collab_cta')}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </p>
            <a href={lp('/book')} className="btn-primary" style={{ fontSize: '0.9rem' }}>
              {t('avail_cta_book')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
