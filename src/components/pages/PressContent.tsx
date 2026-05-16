import { useState } from 'react';
import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import { PROFILE, STATS } from '../../lib/profile';

const BIOS = [
  { titleKey: 'press_bio_short_t', bodyKey: 'press_bio_short' },
  { titleKey: 'press_bio_med_t', bodyKey: 'press_bio_med' },
  { titleKey: 'press_bio_long_t', bodyKey: 'press_bio_long' },
];

export default function PressContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useRevealEffect();

  return (
    <div ref={ref} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 60px)' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('press_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('press_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="body-lg reveal" style={{ maxWidth: 660 }}>{t('press_desc')}</p>
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(24px, 5vw, 80px)' }} />

      <section className="section-padding">
        <div className="container" style={{ maxWidth: 880, display: 'grid', gap: 56 }}>
          {BIOS.map((bio, i) => (
            <BioBlock
              key={i}
              index={i}
              title={t(bio.titleKey)}
              body={t(bio.bodyKey)}
              copyLabel={t('press_copy')}
              copiedLabel={t('press_copied')}
            />
          ))}
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 880, display: 'grid', gap: 56 }}>
          <div>
            <p className="label reveal" style={{ marginBottom: 24 }}>{t('press_factsheet_t')}</p>
            <dl
              className="reveal"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 24,
                margin: 0,
              }}
            >
              <FactItem term="Name" value={PROFILE.name} />
              <FactItem term="Based in" value="Belgium" />
              <FactItem term="Languages" value="FR · EN · NL" />
              <FactItem term="Years of experience" value={`${STATS.years}+`} />
              <FactItem term="Stack" value="TypeScript · Astro · Next.js · Node.js · PostgreSQL" />
              <FactItem term="GitHub" value={`@${PROFILE.githubHandle}`} href={PROFILE.github} />
            </dl>
          </div>

          <div>
            <p className="label reveal" style={{ marginBottom: 24 }}>{t('press_assets_t')}</p>
            <p className="reveal" style={{ color: 'var(--text-secondary)', maxWidth: 640, lineHeight: 1.7 }}>
              {t('press_assets_d')}
            </p>
          </div>

          <div className="reveal">
            <p className="label" style={{ marginBottom: 8 }}>{t('press_contact')}</p>
            <a href={`mailto:${PROFILE.email}`} style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
              {PROFILE.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function BioBlock({
  index,
  title,
  body,
  copyLabel,
  copiedLabel,
}: {
  index: number;
  title: string;
  body: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API blocked — selecting the text manually still works.
    }
  };

  return (
    <div className="reveal" style={{ transitionDelay: `${index * 0.06}s` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)' }}>{title}</h2>
        <button
          type="button"
          onClick={copy}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '6px 12px',
            background: 'transparent',
            color: copied ? 'var(--accent)' : 'var(--text-secondary)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            borderRadius: 3,
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
        >
          {copied ? `✓ ${copiedLabel}` : copyLabel}
        </button>
      </div>
      <p
        style={{
          padding: 24,
          background: 'var(--bg-secondary)',
          borderLeft: '2px solid var(--accent)',
          color: 'var(--text-primary)',
          lineHeight: 1.75,
          fontSize: '0.95rem',
        }}
      >
        {body}
      </p>
    </div>
  );
}

function FactItem({ term, value, href }: { term: string; value: string; href?: string }) {
  return (
    <div>
      <dt
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 6,
        }}
      >
        {term}
      </dt>
      <dd style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', borderBottom: '1px solid var(--accent)' }}>
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
