import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import PortfolioGrid, { type ProjectItem } from '../PortfolioGrid';

export default function PortfolioContent({ lang, projects }: { lang: Lang; projects: ProjectItem[] }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();

  return (
    <div ref={containerRef} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 80px)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('nav_portfolio')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('portfolio_title1')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('portfolio_title2')}</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: 540 }}>{t('portfolio_desc')}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(80px, 12vh, 160px)' }}>
        <div className="container">
          <PortfolioGrid lang={lang} projects={projects} />
        </div>
      </section>
    </div>
  );
}
