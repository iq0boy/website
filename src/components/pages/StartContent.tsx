import { useState } from 'react';
import { useLang, useRevealEffect } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';
import { PROFILE } from '../../lib/profile';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const TIMELINE_OPTIONS = [
  { value: 'urgent', labelKey: 'start_timeline_urgent' },
  { value: 'soon', labelKey: 'start_timeline_soon' },
  { value: 'planned', labelKey: 'start_timeline_planned' },
  { value: 'flexible', labelKey: 'start_timeline_flexible' },
] as const;

const BUDGET_OPTIONS = [
  { value: 'small', labelKey: 'start_budget_small' },
  { value: 'mid', labelKey: 'start_budget_mid' },
  { value: 'large', labelKey: 'start_budget_large' },
  { value: 'xl', labelKey: 'start_budget_xl' },
  { value: 'unsure', labelKey: 'start_budget_unsure' },
] as const;

const ROLE_OPTIONS = [
  { value: 'founder', labelKey: 'start_role_founder' },
  { value: 'pm', labelKey: 'start_role_pm' },
  { value: 'agency', labelKey: 'start_role_agency' },
  { value: 'other', labelKey: 'start_role_other' },
] as const;

export default function StartContent({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const ref = useRevealEffect();
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    what: '',
    timeline: 'soon' as (typeof TIMELINE_OPTIONS)[number]['value'],
    budget: 'mid' as (typeof BUDGET_OPTIONS)[number]['value'],
    stack: '',
    role: 'founder' as (typeof ROLE_OPTIONS)[number]['value'],
    name: '',
    email: '',
    botcheck: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    if (form.botcheck) return; // honeypot tripped
    setStatus('submitting');

    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus('error');
      return;
    }

    try {
      const payload = {
        access_key: accessKey,
        from_name: 'josephpire.dev — /start',
        subject: `Project brief from ${form.name}`,
        name: form.name,
        email: form.email,
        message: [
          `Role: ${form.role}`,
          `Timeline: ${form.timeline}`,
          `Budget: ${form.budget}`,
          form.stack ? `Existing stack: ${form.stack}` : null,
          '',
          'What:',
          form.what,
        ]
          .filter(Boolean)
          .join('\n'),
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div ref={ref} className="page-wrapper">
        <section
          style={{
            paddingTop: 'clamp(140px, 20vh, 200px)',
            paddingBottom: 'clamp(80px, 15vh, 160px)',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: 640 }}>
            <p className="label" style={{ marginBottom: 24 }}>{t('start_label')}</p>
            <h1 className="heading-xl" style={{ marginBottom: 24 }}>
              {t('start_sent_title')}<span style={{ color: 'var(--accent)' }}>.</span>
            </h1>
            <p className="body-lg" style={{ marginBottom: 48, color: 'var(--text-secondary)' }}>
              {t('start_sent_desc')}
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setForm({
                  what: '',
                  timeline: 'soon',
                  budget: 'mid',
                  stack: '',
                  role: 'founder',
                  name: '',
                  email: '',
                  botcheck: '',
                });
              }}
              className="btn-outline"
              style={{ fontSize: '0.9rem' }}
            >
              {t('start_send_another')}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={ref} className="page-wrapper">
      <section style={{ paddingTop: 'clamp(140px, 20vh, 200px)', paddingBottom: 'clamp(40px, 6vh, 60px)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <p className="label reveal" style={{ marginBottom: 24 }}>{t('start_label')}</p>
          <h1 className="heading-xl reveal" style={{ marginBottom: 32 }}>
            {t('start_title')}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="body-lg reveal" style={{ maxWidth: 640 }}>{t('start_desc')}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(80px, 15vh, 160px)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 40 }}>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              name="botcheck"
              value={form.botcheck}
              onChange={e => setForm({ ...form, botcheck: e.target.value })}
              style={{ position: 'absolute', left: -9999, opacity: 0, pointerEvents: 'none' }}
              aria-hidden="true"
            />

            <Field label={t('start_q_what')} help={t('start_q_what_help')}>
              <textarea
                required
                value={form.what}
                onChange={e => setForm({ ...form, what: e.target.value })}
                rows={5}
                style={textareaStyle}
              />
            </Field>

            <Field label={t('start_q_timeline')}>
              <Pills
                options={TIMELINE_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
                value={form.timeline}
                onChange={v => setForm({ ...form, timeline: v as typeof form.timeline })}
              />
            </Field>

            <Field label={t('start_q_budget')}>
              <Pills
                options={BUDGET_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
                value={form.budget}
                onChange={v => setForm({ ...form, budget: v as typeof form.budget })}
              />
            </Field>

            <Field label={t('start_q_stack')} help={t('start_q_stack_help')}>
              <input
                type="text"
                value={form.stack}
                onChange={e => setForm({ ...form, stack: e.target.value })}
                placeholder="React, PostgreSQL, AWS…"
                style={inputStyle}
              />
            </Field>

            <Field label={t('start_q_role')}>
              <Pills
                options={ROLE_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
                value={form.role}
                onChange={v => setForm({ ...form, role: v as typeof form.role })}
              />
            </Field>

            <Field label={t('start_q_contact')}>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={t('start_q_name')}
                  style={inputStyle}
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder={t('start_q_email')}
                  style={inputStyle}
                />
              </div>
            </Field>

            <div>
              <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? t('start_submitting') : t('start_submit')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              {status === 'error' && (
                <p style={{ marginTop: 16, color: '#d05a5a', fontSize: '0.9rem' }}>
                  {t('start_error')}{' '}
                  <a href={`mailto:${PROFILE.email}`} style={{ color: 'var(--accent)' }}>
                    {PROFILE.email}
                  </a>
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  borderRadius: 3,
  outline: 'none',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 120,
  lineHeight: 1.6,
};

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal" style={{ display: 'grid', gap: 8 }}>
      <label
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
        }}
      >
        {label}
      </label>
      {help && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{help}</p>
      )}
      {children}
    </div>
  );
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid',
              borderColor: active ? 'var(--accent)' : 'var(--border)',
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              borderRadius: 3,
              transition: 'all 0.2s ease',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
