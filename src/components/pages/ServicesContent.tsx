import { useLang, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

const SERVICES = [
  { icon: '⟨/⟩', titleKey: 'svc_full_web_t', descKey: 'svc_full_web_d', features: ['Single Page Applications', 'Progressive Web Apps', 'API Development', 'E-commerce Solutions'] },
  { icon: '◐', titleKey: 'svc_full_ui_t', descKey: 'svc_full_ui_d', features: ['User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing'] },
  { icon: '⊛', titleKey: 'svc_full_ai_t', descKey: 'svc_full_ai_d', features: ['LLM Integration', 'Custom AI Agents', 'Data Pipelines', 'ML Model Deployment'] },
  { icon: '↗', titleKey: 'svc_full_cons_t', descKey: 'svc_full_cons_d', features: ['Technical Audits', 'Architecture Design', 'Stack Selection', 'Performance Optimization'] },
  { icon: '⎔', titleKey: 'svc_full_form_t', descKey: 'svc_full_form_d', features: ['Team Workshops', 'Code Reviews', '1-on-1 Mentoring', 'Custom Curriculum'] },
  { icon: '⊞', titleKey: 'svc_full_db_t', descKey: 'svc_full_db_d', features: ['Schema Design', 'Migration Strategy', 'Query Optimization', 'Data Modeling'] },
];

const STEPS = [
  { num: '01', titleKey: 'step1_t', descKey: 'step1_d' },
  { num: '02', titleKey: 'step2_t', descKey: 'step2_d' },
  { num: '03', titleKey: 'step3_t', descKey: 'step3_d' },
  { num: '04', titleKey: 'step4_t', descKey: 'step4_d' },
];

export default function ServicesContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const containerRef = useRevealEffect();
  const lp = (path: string) => localePath(lang, path);

  return (
    <div ref={containerRef} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('nav_services')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('services_page_title1')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('services_page_title2')}</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: 600 }}>{t('services_page_desc')}</p>
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(24px, 5vw, 80px)' }} />

      <section className="section-padding">
        <div className="container">
          {SERVICES.map((s, i) => (
            <div key={i}>
              <div className="service-row reveal">
                <span className="service-row-icon">{s.icon}</span>
                <div>
                  <h3 className="service-row-title">{t(s.titleKey)}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 480 }}>{t(s.descKey)}</p>
                </div>
                <div style={{ paddingTop: 8 }}>
                  {s.features.map((f, fi) => (
                    <div key={fi} className="service-feature">
                      <span style={{ color: 'var(--accent)', fontSize: '0.6rem' }}>◆</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              {i < SERVICES.length - 1 && <div className="divider" />}
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('process')}</p>
          <h2 className="heading-lg reveal" style={{ marginBottom: 64 }}>
            {t('how_i_work')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48 }}>
            {STEPS.map((step, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--accent)', lineHeight: 1, display: 'block', marginBottom: 16 }}>{step.num}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 8 }}>{t(step.titleKey)}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(80px, 15vh, 160px) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="heading-lg" style={{ marginBottom: 32 }}>
            {t('ready_to')} <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('start')}</span>?
          </h2>
          <a href={lp('/contact')} className="btn-primary">{t('lets_talk')}</a>
        </div>
      </section>
    </div>
  );
}
