import { useLang, localePath } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

export default function FooterI18n({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const lp = (path: string) => localePath(lang, path);

  const navLinks = [
    [t('nav_home'), lp('/')],
    [t('nav_services'), lp('/services')],
    [t('nav_portfolio'), lp('/portfolio')],
    [t('nav_blog'), lp('/blog')],
    [t('nav_contact'), lp('/contact')],
  ];

  const linkStyle: React.CSSProperties = {
    display: 'block', color: 'var(--text-secondary)', marginBottom: 10, fontSize: '0.9rem', transition: 'color 0.3s', textDecoration: 'none',
  };

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 0 40px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 60 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 16 }}>
              Joseph<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <p className="body-lg" style={{ fontSize: '0.9rem', maxWidth: 280 }}>{t('footer_tagline')}</p>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 16 }}>{t('navigation')}</p>
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{label}</a>
            ))}
          </div>
          <div>
            <p className="label" style={{ marginBottom: 16 }}>{t('connect')}</p>
            {([
              ['GitHub', 'https://github.com/iq0boy'],
              // ['LinkedIn', null],
              // ['Twitter / X', null],
              // ['Dribbble', null],
            ] as [string, string | null][]).map(([label, href]) =>
              href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{label}</a>
              ) : (
                <span key={label} style={{ ...linkStyle, opacity: 0.3, cursor: 'default' }}>{label}</span>
              )
            )}
          </div>
          <div>
            <p className="label" style={{ marginBottom: 16 }}>{t('footer_contact')}</p>
            <a href="mailto:hello@josephpire.dev" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>hello@josephpire.dev</a>
          </div>
        </div>
        <div className="divider" style={{ marginBottom: 30 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('rights')}</p>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>{t('built_with')}</p>
        </div>
      </div>
    </footer>
  );
}
