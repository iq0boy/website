import { useState } from 'react';
import { useLang, useRevealEffect, localePath } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

const FAQS = [
  { q: 'faq_q1', a: 'faq_a1' },
  { q: 'faq_q2', a: 'faq_a2' },
  { q: 'faq_q3', a: 'faq_a3' },
  { q: 'faq_q4', a: 'faq_a4' },
  { q: 'faq_q5', a: 'faq_a5' },
  { q: 'faq_q6', a: 'faq_a6' },
];

const PRICING = [
  { title: 'pricing_card_landing_t', price: 'pricing_card_landing_p', desc: 'pricing_card_landing_d' },
  { title: 'pricing_card_app_t',     price: 'pricing_card_app_p',     desc: 'pricing_card_app_d' },
  { title: 'pricing_card_audit_t',   price: 'pricing_card_audit_p',   desc: 'pricing_card_audit_d' },
  { title: 'pricing_card_retainer_t', price: 'pricing_card_retainer_p', desc: 'pricing_card_retainer_d' },
];

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

      {/* Pricing */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('pricing_label')}</p>
          <h2 className="heading-lg reveal" style={{ marginBottom: 24 }}>
            {t('pricing_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <p className="body-lg reveal" style={{ maxWidth: 680, marginBottom: 56 }}>
            {t('pricing_desc')}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {PRICING.map((p, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}
                >
                  {t(p.title)}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                    lineHeight: 1.1,
                    color: 'var(--text-primary)',
                  }}
                >
                  {t(p.price)}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, flex: 1 }}>
                  {t(p.desc)}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 24,
              justifyContent: 'space-between',
            }}
          >
            <a href={lp('/book')} className="btn-primary" style={{ fontSize: '0.9rem' }}>
              {t('pricing_cta_book')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {t('pricing_note')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container">
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('faq_label')}</p>
          <h2 className="heading-lg reveal" style={{ marginBottom: 56 }}>
            {t('faq_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <div style={{ maxWidth: 820 }}>
            {FAQS.map((f, i) => (
              <FaqItem key={i} question={t(f.q)} answer={t(f.a)} index={i} />
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

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div
      className="reveal"
      style={{
        borderTop: '1px solid var(--border)',
        ...(index === FAQS.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}),
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
          lineHeight: 1.3,
        }}
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          style={{
            color: 'var(--accent)',
            fontSize: '1.6rem',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s var(--ease-out-expo)',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 400 : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.5s var(--ease-out-expo), opacity 0.3s ease',
        }}
      >
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            paddingBottom: 28,
            maxWidth: 680,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}
