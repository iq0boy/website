import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import ContactSection from '../ContactSection';

export default function ContactContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();

  return (
    <div ref={containerRef} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 80px)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('contact')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('contact_title1')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('contact_title2')}</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: 540 }}>{t('contact_desc')}</p>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <ContactSection lang={lang} />
        </div>
      </section>
    </div>
  );
}
