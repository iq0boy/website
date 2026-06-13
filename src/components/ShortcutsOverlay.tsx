import { useEffect, useState } from 'react';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

// A `?`-triggered panel documenting the keyboard shortcuts the site already
// supports (⌘K / `/` open search, Esc closes). Mounted globally in Layout.
export default function ShortcutsOverlay({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // `?` is Shift+/, so e.key is '?' — no clash with the `/` search shortcut.
      if (e.key === '?' && !isTypingTarget(e.target)) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const rows: { keys: string[]; label: string }[] = [
    { keys: ['⌘K', '/'], label: t('shortcuts_search') },
    { keys: ['Esc'], label: t('shortcuts_dismiss') },
    { keys: ['?'], label: t('shortcuts_help') },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('shortcuts_title')}
      onClick={e => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay-dim)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 10vh, 120px) 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            {t('shortcuts_title')}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('shortcuts_dismiss')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 3,
              padding: '2px 7px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
            }}
          >
            ESC
          </button>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
          {rows.map((row, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 20px',
              }}
            >
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{row.label}</span>
              <span style={{ display: 'inline-flex', gap: 6 }}>
                {row.keys.map((k, j) => (
                  <kbd
                    key={j}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      minWidth: 22,
                      textAlign: 'center',
                      padding: '3px 7px',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-primary)',
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
