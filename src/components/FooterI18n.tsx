import { useLang, localePath } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { LEGAL } from '../lib/profile';

export default function FooterI18n({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const lp = (path: string) => localePath(lang, path);

  // Belgian/EU mandatory legal mentions. Each empty field is omitted, so the
  // line stays clean until the real BCE number / address are filled in profile.ts.
  const legalMention = [
    LEGAL.legalName,
    t('legal_status'),
    LEGAL.enterpriseNumber && `${t('legal_company_no')} ${LEGAL.enterpriseNumber}`,
    LEGAL.enterpriseNumber && `${t('legal_vat')} ${LEGAL.enterpriseNumber}`,
    LEGAL.vatRegime === 'franchise' && t('legal_vat_franchise'),
    LEGAL.address,
    t('legal_country'),
  ]
    .filter(Boolean)
    .join(' · ');

  const navLinks = [
    [t('nav_home'), lp('/')],
    [t('about_label'), lp('/about')],
    [t('nav_services'), lp('/services')],
    [t('nav_portfolio'), lp('/portfolio')],
    [t('nav_blog'), lp('/blog')],
    [t('now_label'), lp('/now')],
    [t('uses_label'), lp('/uses')],
    [t('collab_label'), lp('/collaborate')],
    [t('press_label'), lp('/press')],
    [t('nav_contact'), lp('/contact')],
    [t('nav_book'), lp('/book')],
  ];

  const legalLinks: [string, string][] = [
    [(lang === 'fr' ? 'Mentions légales' : lang === 'nl' ? 'Wettelijke vermelding' : 'Legal notice'), lp('/legal')],
    [(lang === 'fr' ? 'Confidentialité' : lang === 'nl' ? 'Privacy' : 'Privacy'), lp('/privacy')],
    [(lang === 'fr' ? 'Conditions générales' : lang === 'nl' ? 'Voorwaarden' : 'Terms'), lp('/terms')],
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
            <a href="mailto:josephpire.dev@gmail.com" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>josephpire.dev@gmail.com</a>
            <a
              href="/rss.xml"
              style={{ ...linkStyle, marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              RSS ↗
            </a>
          </div>
        </div>
        <div className="divider" style={{ marginBottom: 30 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('rights')}</p>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {legalLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {label}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>{t('built_with')}</p>
        </div>
        <p style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
          {legalMention}
        </p>
      </div>
    </footer>
  );
}
