import { useLang, useAnimatedCounter } from '../lib/i18n';

function Counter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useAnimatedCounter(end);
  return (
    <div ref={ref as any} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: 'var(--accent)', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 12 }}>
        {label}
      </p>
    </div>
  );
}

export default function AnimatedCounters() {
  const { t } = useLang();
  const stats = [
    { num: 8, suffix: '+', label: t('stat_years') },
    { num: 120, suffix: '+', label: t('stat_projects') },
    { num: 45, suffix: '+', label: t('stat_clients') },
    { num: 99, suffix: '%', label: t('stat_sat') },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48 }}>
      {stats.map((s, i) => (
        <Counter key={i} end={s.num} suffix={s.suffix} label={s.label} />
      ))}
    </div>
  );
}
