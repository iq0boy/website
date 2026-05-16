import { useEffect, useState } from 'react';
import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import { PROFILE } from '../../lib/profile';
import AvailabilityBadge from '../AvailabilityBadge';

const STEPS = [
  { titleKey: 'book_step1_t', descKey: 'book_step1_d' },
  { titleKey: 'book_step2_t', descKey: 'book_step2_d' },
  { titleKey: 'book_step3_t', descKey: 'book_step3_d' },
];

export default function BookContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Mark the embed as loaded so we can hide the placeholder skeleton.
  useEffect(() => {
    const handle = setTimeout(() => setIframeLoaded(true), 1800);
    return () => clearTimeout(handle);
  }, []);

  return (
    <div ref={containerRef} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 60px)' }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('book_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('book_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="body-lg reveal" style={{ maxWidth: 680, marginBottom: 40 }}>{t('book_desc')}</p>
          <div className="reveal" style={{ maxWidth: 680 }}>
            <AvailabilityBadge lang={lang} variant="compact" />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(40px, 8vh, 80px)' }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div
            className="reveal"
            style={{
              position: 'relative',
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: 'var(--bg-secondary)',
              minHeight: 720,
              overflow: 'hidden',
            }}
          >
            {!iframeLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                }}
              >
                {t('book_iframe_loading')}
              </div>
            )}
            <iframe
              src={PROFILE.bookingUrl}
              title={t('book_title')}
              loading="lazy"
              onLoad={() => setIframeLoaded(true)}
              style={{
                width: '100%',
                height: 720,
                border: 'none',
                display: 'block',
                colorScheme: 'normal',
              }}
            />
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('book_what_label')}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 32,
              marginTop: 32,
            }}
          >
            {STEPS.map((s, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3.5rem',
                    color: 'var(--accent)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: 16,
                  }}
                >
                  0{i + 1}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: 10 }}>{t(s.titleKey)}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t(s.descKey)}</p>
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: 56,
              paddingTop: 32,
              borderTop: '1px solid var(--border)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}
          >
            {t('book_fallback')}{' '}
            <a href={`mailto:${PROFILE.email}`} style={{ color: 'var(--accent)' }}>
              {PROFILE.email}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
