import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import { NOW, NOW_SECTIONS, formatLastUpdated } from '../../lib/now-data';

export default function NowContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useRevealEffect();
  const sections = NOW_SECTIONS.filter(s => s.data.length > 0);

  return (
    <div ref={ref} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 60px)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('now_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('now_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="body-lg reveal" style={{ maxWidth: 640, marginBottom: 24 }}>
            {t('now_desc')}
          </p>
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {t('now_updated')} · {formatLastUpdated(NOW.lastUpdatedIso, lang)}
          </p>
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(24px, 5vw, 80px)' }} />

      <section className="section-padding">
        <div className="container" style={{ maxWidth: 820, display: 'grid', gap: 56 }}>
          {sections.map((section, i) => (
            <div key={section.key} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 14,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)' }}>
                  0{i + 1}
                </span>
                {t(section.key)}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.data.map((item, j) => (
                  <li
                    key={j}
                    style={{
                      padding: '14px 0',
                      borderTop: '1px solid var(--border)',
                      ...(j === section.data.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}),
                    }}
                  >
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}
                      >
                        {item.label} ↗
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
