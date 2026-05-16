import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { TESTIMONIALS } from '../lib/testimonials';

export default function Testimonials({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const allPlaceholders = TESTIMONIALS.length > 0 && TESTIMONIALS.every(q => q.placeholder);

  // Nothing to show at all — hide the section entirely.
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <p className="label reveal" style={{ marginBottom: 24 }}>
          {t('testimonials_label')}
        </p>
        <h2 className="heading-lg reveal" style={{ marginBottom: allPlaceholders ? 24 : 56 }}>
          {t('testimonials_title')}
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h2>
        {allPlaceholders && (
          <p
            className="reveal"
            style={{
              marginBottom: 56,
              padding: '12px 16px',
              border: '1px dashed var(--border)',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              maxWidth: 720,
            }}
          >
            {t('testimonials_empty')}
          </p>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((q, i) => (
            <figure
              key={i}
              className="reveal"
              style={{
                margin: 0,
                padding: 32,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '3rem',
                  color: 'var(--accent)',
                  lineHeight: 0.6,
                  height: '0.6em',
                }}
              >
                “
              </span>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  lineHeight: 1.55,
                  color: 'var(--text-primary)',
                  flex: 1,
                }}
              >
                {q.quote}
              </blockquote>
              <figcaption style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {q.author}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: 4,
                  }}
                >
                  {q.role}
                  {q.project ? ` · ${q.project}` : ''}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
