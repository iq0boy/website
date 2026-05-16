import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    meta: { title?: string; image?: string };
    excerpt: string;
    sub_results?: { title: string; url: string; excerpt: string }[];
  }>;
}

interface PagefindModule {
  init: () => Promise<void>;
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
  options?: (opts: Record<string, unknown>) => Promise<void>;
}

type Hydrated = {
  url: string;
  title: string;
  excerpt: string;
};

export default function SearchModal({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hydrated[]>([]);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<PagefindModule | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      } else if (e.key === '/' && !open && !isTypingTarget(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Expose a global to let other UI (e.g., Nav button) open the modal
  useEffect(() => {
    (window as unknown as { __jpOpenSearch?: () => void }).__jpOpenSearch = () => setOpen(true);
    return () => {
      delete (window as unknown as { __jpOpenSearch?: () => void }).__jpOpenSearch;
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
  }, [open]);

  // Lazy-load Pagefind on first open
  useEffect(() => {
    if (!open || pagefindRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        // Indirection prevents Rollup from trying to resolve at build time.
        const url = `${window.location.origin}/pagefind/pagefind.js`;
        const mod = (await import(/* @vite-ignore */ url)) as PagefindModule;
        if (cancelled) return;
        await mod.init();
        pagefindRef.current = mod;
      } catch {
        // Pagefind isn't available in dev — silently fail; the modal still renders.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Run query
  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const pf = pagefindRef.current;
    if (!pf) return;
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await pf.search(query);
        const top = res.results.slice(0, 8);
        const hydrated = await Promise.all(top.map(r => r.data()));
        if (cancelled) return;
        setResults(
          hydrated.map(d => ({
            url: d.url,
            title: d.meta.title ?? d.url,
            excerpt: d.excerpt,
          }))
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 100);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('search_label')}
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(60px, 12vh, 140px) 16px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
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
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
            }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('search_close')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              padding: '4px 8px',
              borderRadius: 3,
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading && (
            <p style={{ padding: 24, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              …
            </p>
          )}
          {!loading && query && results.length === 0 && (
            <p style={{ padding: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('search_no_results')}</p>
          )}
          {results.map(r => (
            <a
              key={r.url}
              href={r.url}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                {r.title}
              </p>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </a>
          ))}
        </div>
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          <span>↵ open · ⌘K toggle</span>
          <span>powered by pagefind</span>
        </div>
      </div>
    </div>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}
