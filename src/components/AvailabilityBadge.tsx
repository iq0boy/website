import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { AVAILABILITY } from '../lib/profile';

type Variant = 'compact' | 'card';

const DOT_COLOR: Record<typeof AVAILABILITY.status, string> = {
  open: '#62c878',
  limited: '#e1a45a',
  closed: '#d05a5a',
};

function formatNextSlot(iso: string | null, lang: Lang): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const fmt = lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-US';
  return d.toLocaleDateString(fmt, { month: 'long', year: 'numeric' });
}

export default function AvailabilityBadge({
  lang,
  variant = 'compact',
}: {
  lang: Lang;
  variant?: Variant;
}) {
  const { t } = useLang(lang);
  const { status, nextSlotIso } = AVAILABILITY;
  const slot = formatNextSlot(nextSlotIso, lang);

  const statusLabel = t(`avail_status_${status}`);
  const ctaLabel = status === 'closed' ? t('avail_cta_waitlist') : t('avail_cta_book');

  if (variant === 'compact') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px',
          border: '1px solid var(--border)',
          borderRadius: 999,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
          background: 'var(--bg-secondary)',
        }}
      >
        <PulseDot color={DOT_COLOR[status]} />
        <span>
          <span style={{ color: 'var(--text-primary)' }}>{statusLabel}</span>
          {slot && (
            <>
              {' · '}
              <span>{t('avail_next_slot')}: {slot}</span>
            </>
          )}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        padding: 28,
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'var(--bg-secondary)',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ paddingTop: 8 }}>
        <PulseDot color={DOT_COLOR[status]} large />
      </div>
      <div style={{ flex: 1, minWidth: 240 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 6,
          }}
        >
          {t('avail_label')}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          {statusLabel}
        </p>
        {slot && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {t('avail_next_slot')}: <strong style={{ color: 'var(--text-primary)' }}>{slot}</strong>
          </p>
        )}
      </div>
      <a
        href={`/${lang === 'fr' ? '' : lang + '/'}book`}
        className="btn-primary"
        style={{ fontSize: '0.85rem', padding: '12px 20px' }}
      >
        {ctaLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

function PulseDot({ color, large = false }: { color: string; large?: boolean }) {
  const size = large ? 14 : 8;
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 ${large ? 14 : 8}px ${color}`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
          opacity: 0.4,
          animation: 'jp-pulse 2s ease-out infinite',
        }}
      />
      <style>{`
        @keyframes jp-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          80% { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="jp-pulse"] { animation: none !important; }
        }
      `}</style>
    </span>
  );
}
