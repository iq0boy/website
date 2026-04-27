import { useState, useEffect, useRef } from 'react';
import { useLang, useTheme, localePath } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

interface NavProps {
  currentPage: string;
  lang: Lang;
}

export default function Nav({ currentPage, lang }: NavProps) {
  const { t } = useLang(lang);
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lp = (path: string) => localePath(lang, path);

  const navItems = [
    ['home', t('nav_home'), lp('/')],
    ['services', t('nav_services'), lp('/services')],
    ['portfolio', t('nav_portfolio'), lp('/portfolio')],
    ['blog', t('nav_blog'), lp('/blog')],
    ['contact', t('nav_contact'), lp('/contact')],
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '16px 0' : '28px 0',
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href={lp('/')} style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', textDecoration: 'none', color: 'inherit' }}>
            Joseph<span style={{ color: 'var(--accent)' }}>.</span>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {navItems.map(([key, label, href]) => (
              <a key={key} href={href} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: currentPage === key ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'color 0.3s ease',
              }}
                onMouseEnter={e => { if (currentPage !== key) (e.target as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (currentPage !== key) (e.target as HTMLElement).style.color = 'var(--text-secondary)'; }}
              >{label}</a>
            ))}
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <LanguageSelector lang={lang} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <div className="mobile-nav-controls" style={{ display: 'none', alignItems: 'center', gap: 12 }}>
            <LanguageSelector lang={lang} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 8,
              display: 'flex', flexDirection: 'column', gap: 5,
            }}>
              <span style={{ width: 24, height: 1.5, background: 'var(--text-primary)', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ width: 24, height: 1.5, background: 'var(--text-primary)', display: 'block', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: 24, height: 1.5, background: 'var(--text-primary)', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'var(--bg-primary)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 32,
        opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        {navItems.map(([key, label, href]) => (
          <a key={key} href={href} className="heading-md" style={{
            textDecoration: 'none',
            color: currentPage === key ? 'var(--accent)' : 'var(--text-primary)',
          }} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-controls { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  const isDark = theme === 'dark';
  return (
    <button onClick={onToggle} aria-label="Toggle theme" style={{
      position: 'relative', width: 48, height: 24, borderRadius: 12,
      border: '1px solid var(--border)', background: 'var(--bg-secondary)',
      cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center',
      transition: 'all 0.3s ease', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: isDark ? 2 : 'calc(100% - 22px)',
        width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--bg-primary)',
      }}>
        {isDark ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        )}
      </span>
    </button>
  );
}

function LanguageSelector({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const languages = [
    { code: 'fr' as Lang, label: 'Français', short: 'FR' },
    { code: 'en' as Lang, label: 'English', short: 'EN' },
    { code: 'nl' as Lang, label: 'Nederlands', short: 'NL' },
  ];
  const current = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function switchToLang(newLang: Lang) {
    const path = window.location.pathname;
    const stripped = path.replace(/^\/(en|nl)(\/|$)/, '/') || '/';
    window.location.href = newLang === 'fr' ? stripped : `/${newLang}${stripped}`;
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'transparent', border: '1px solid var(--border)',
        color: 'var(--text-secondary)', padding: '5px 10px',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, height: 24,
        transition: 'all 0.3s ease',
      }}>
        {current.short}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          minWidth: 140, zIndex: 1001, boxShadow: '0 8px 24px oklch(0 0 0 / 0.2)',
        }}>
          {languages.map(l => (
            <button key={l.code} onClick={() => { switchToLang(l.code); setOpen(false); }} style={{
              width: '100%', textAlign: 'left', padding: '10px 14px',
              background: 'transparent', border: 'none',
              color: l.code === lang ? 'var(--accent)' : 'var(--text-primary)',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{l.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', opacity: 0.6 }}>{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
