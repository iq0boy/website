import { useState } from 'react';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

export default function ContactSection({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const fields = [
    { key: 'name', label: t('form_name'), type: 'text', placeholder: t('form_name_ph') },
    { key: 'email', label: t('form_email'), type: 'email', placeholder: t('form_email_ph') },
    { key: 'subject', label: t('form_subject'), type: 'text', placeholder: t('form_subject_ph') },
  ] as const;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 'clamp(40px, 8vw, 120px)' }}>
      <div>
        {submitted ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--accent)' }}>✓</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>{t('form_sent')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('form_sent_desc')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom: 40, position: 'relative' }}>
                <label style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: focused === f.key ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'color 0.3s', display: 'block', marginBottom: 8,
                }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  onFocus={() => setFocused(f.key)} onBlur={() => setFocused(null)}
                  required
                />
              </div>
            ))}
            <div style={{ marginBottom: 40 }}>
              <label style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: focused === 'message' ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.3s', display: 'block', marginBottom: 8,
              }}>{t('form_message')}</label>
              <textarea placeholder={t('form_message_ph')} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                rows={5} required
              />
            </div>
            <button type="submit" className="btn-primary">
              {t('form_send')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
        )}
      </div>

      <div>
        <div style={{ marginBottom: 48 }}>
          <p className="label" style={{ marginBottom: 16 }}>{t('form_email')}</p>
          <a href="mailto:hello@josephpire.dev" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--accent)', transition: 'opacity 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >hello@josephpire.dev</a>
        </div>
        <div style={{ marginBottom: 48 }}>
          <p className="label" style={{ marginBottom: 16 }}>{t('based_in')}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{t('location')}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.9rem' }}>{t('remote')}</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <p className="label" style={{ marginBottom: 16 }}>{t('social')}</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
              <a key={s} href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{s}</a>
            ))}
          </div>
        </div>
        <div style={{ padding: 32, background: 'var(--bg-secondary)', borderLeft: '2px solid var(--accent)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', marginBottom: 8 }}>{t('available')}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('available_desc')}</p>
        </div>
      </div>
    </div>
  );
}
