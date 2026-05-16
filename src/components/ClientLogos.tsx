import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { CLIENT_LOGOS } from '../lib/profile';

export default function ClientLogos({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);

  // Hide entirely until at least one real logo is provided.
  if (CLIENT_LOGOS.length === 0) return null;

  return (
    <section
      className="section-padding"
      aria-label={t('clients_label')}
      style={{ paddingTop: 'clamp(40px, 8vh, 80px)', paddingBottom: 'clamp(40px, 8vh, 80px)' }}
    >
      <div className="container">
        <p
          className="label reveal"
          style={{ marginBottom: 32, textAlign: 'center', color: 'var(--text-muted)' }}
        >
          {t('clients_label')}
        </p>
        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))`,
            gap: 32,
            alignItems: 'center',
            justifyItems: 'center',
            opacity: 0.7,
          }}
        >
          {CLIENT_LOGOS.map(logo => {
            const img = logo.src ? (
              <img
                src={`/logos/${logo.src}`}
                alt={logo.name}
                loading="lazy"
                style={{
                  maxHeight: 36,
                  width: 'auto',
                  maxWidth: 140,
                  filter: 'grayscale(100%) brightness(0.9)',
                  transition: 'filter 0.3s ease, opacity 0.3s ease',
                  opacity: 0.75,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'grayscale(0%) brightness(1)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'grayscale(100%) brightness(0.9)';
                  e.currentTarget.style.opacity = '0.75';
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {logo.name}
              </span>
            );
            return logo.href ? (
              <a
                key={logo.name}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={logo.name}
                style={{ display: 'inline-flex' }}
              >
                {img}
              </a>
            ) : (
              <span key={logo.name} style={{ display: 'inline-flex' }}>
                {img}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
