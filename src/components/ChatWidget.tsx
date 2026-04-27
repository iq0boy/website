import { useState, useEffect, useRef } from 'react';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

type Message = { from: 'bot' | 'user'; text: string };

export default function ChatWidget({ lang }: { lang: Lang }) {
  const { t } = useLang(lang);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: t('chat_greet') }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const quickReplies = [
    { label: t('chat_qr_1'), reply: t('chat_reply_1') },
    { label: t('chat_qr_2'), reply: t('chat_reply_2') },
    { label: t('chat_qr_3'), reply: t('chat_reply_3') },
  ];

  const sendMessage = (text: string, replyText?: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: replyText ?? t('chat_reply_default') }]);
    }, 800);
  };

  return (
    <>
      <button style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 1001,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--accent)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px var(--accent-glow)',
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        transform: open ? 'scale(0)' : 'scale(1)',
      }} onClick={() => setOpen(true)} aria-label="Open chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg-primary)" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </button>

      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 1001,
        width: 380, maxWidth: 'calc(100vw - 48px)', height: 520, maxHeight: 'calc(100vh - 100px)',
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 20px 60px oklch(0 0 0 / 0.3)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem' }}>
              Joseph<span style={{ color: 'var(--accent)' }}>.</span> {t('chat_title')}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              {t('chat_status')}
            </p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div ref={messagesEndRef} style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%', padding: '10px 14px',
              background: m.from === 'user' ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: m.from === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
              fontSize: '0.85rem', lineHeight: 1.5,
              borderRadius: m.from === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
            }}>{m.text}</div>
          ))}
          {messages.length === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => sendMessage(qr.label, qr.reply)} style={{
                  alignSelf: 'flex-start', padding: '8px 14px', background: 'transparent',
                  border: '1px solid var(--border)', color: 'var(--accent)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem', borderRadius: 16,
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
                >{qr.label}</button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} style={{
          padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8,
        }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('chat_input_ph')}
            style={{ flex: 1, border: 'none', borderBottom: 'none', padding: '10px 14px', background: 'var(--bg-tertiary)', fontSize: '0.85rem', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}
          />
          <button type="submit" style={{
            background: 'var(--accent)', border: 'none', padding: '0 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', borderRadius: 8,
          }} aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bg-primary)" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
