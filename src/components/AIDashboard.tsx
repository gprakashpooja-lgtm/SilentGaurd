import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, Zap, Mic, MapPin, Battery, Eye, ShieldCheck, Cpu } from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

// Animated progress ring
function AnimatedRing({
  value,
  max,
  size,
  stroke,
  color,
  label,
  unit,
}: {
  value: number;
  max: number;
  size: number;
  stroke: number;
  color: string;
  label: string;
  unit?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useAnimatedCounter(value, 2200, inView);
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (count / max) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        {/* Center glow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{count}</span>
          {unit && <span className="text-xs text-white/40">{unit}</span>}
        </div>
      </div>
      <p className="text-xs text-white/50 text-center">{label}</p>
    </div>
  );
}

// Waveform chart that draws itself
function WaveformChart({ color, height = 40 }: { color: string; height?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const points = Array.from({ length: 40 }, (_, i) => ({
    x: (i / 39) * 100,
    y: 50 + Math.sin(i * 0.8) * 30 + Math.sin(i * 0.3) * 15 + (Math.random() * 10 - 5),
  }));
  const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div ref={ref} style={{ height }} className="w-full overflow-hidden">
      <svg width="100%" height={height} viewBox={`0 0 100 100`} preserveAspectRatio="none">
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        {/* Fill gradient */}
        <defs>
          <linearGradient id={`wave-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${path} L 100,100 L 0,100 Z`}
          fill={`url(#wave-grad-${color.replace('#', '')})`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 2.5, delay: 0.5 }}
        />
      </svg>
    </div>
  );
}

// Live metric card
function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  status,
  index,
}: {
  title: string;
  value: string;
  unit?: string;
  icon: React.ElementType;
  color: string;
  status: string;
  index: number;
}) {
  const directions = ['left', 'right', 'bottom', 'left', 'right', 'bottom', 'left', 'right'];
  const dir = directions[index % directions.length];
  const initial = dir === 'left' ? { x: -60 } : dir === 'right' ? { x: 60 } : { y: 60 };

  return (
    <motion.div
      initial={{ ...initial, opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group"
    >
      {/* Hover glow */}
      <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          {/* Live dot */}
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-safe"
            />
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Live</span>
          </div>
        </div>

        <p className="text-white/40 text-xs mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">
          {value}
          {unit && <span className="text-sm text-white/40 ml-1">{unit}</span>}
        </p>

        <p className="text-xs mt-2" style={{ color }}>
          {status}
        </p>

        <WaveformChart color={color} height={36} />
      </div>
    </motion.div>
  );
}

// Self-drawing bar chart
function BarChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const bars = Array.from({ length: 24 }, () => ({
    height: Math.random() * 70 + 15,
    status: Math.random() > 0.92 ? 'emergency' : Math.random() > 0.75 ? 'alert' : 'normal',
  }));

  return (
    <div ref={ref} className="flex items-end gap-1 h-24">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            background: bar.status === 'emergency' ? '#ef4444' : bar.status === 'alert' ? '#3b82f6' : '#10b981',
            opacity: 0.6,
          }}
          initial={{ height: 0 }}
          animate={inView ? { height: `${bar.height}%` } : {}}
          transition={{ duration: 0.5, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }}
        />
      ))}
    </div>
  );
}

export default function AIDashboard() {
  const [motionX, setMotionX] = useState(0.12);

  useEffect(() => {
    const interval = setInterval(() => {
      setMotionX(+(Math.random() * 2 - 1).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: 'Motion Detection', value: `${motionX}g`, icon: Activity, color: '#3b82f6', status: 'Normal activity', index: 0 },
    { title: 'Impact Sensor', value: '0.2', unit: 'G', icon: Zap, color: '#10b981', status: 'No impact detected', index: 1 },
    { title: 'Microphone Analysis', value: 'Normal', icon: Mic, color: '#06b6d4', status: 'Ambient audio only', index: 2 },
    { title: 'Location Tracking', value: 'Active', icon: MapPin, color: '#10b981', status: 'GPS signal strong', index: 3 },
  ];

  return (
    <section id="features" className="py-24 px-4 relative">
      {/* Section label */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] text-electric/60 font-mono tracking-[0.3em] uppercase block mb-4">
            01 — Live AI Monitoring
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Always Watching.{' '}
            <span className="gradient-text-blue">Always Protecting.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-base leading-relaxed">
            Advanced AI sensors running 24/7 to detect anomalies before they become emergencies.
          </p>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Safety Score */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-4">Safety Score</p>
            <div className="flex items-center gap-6">
              <AnimatedRing value={100} max={100} size={100} stroke={8} color="#10b981" label="Score" unit="/100" />
              <div>
                <p className="text-3xl font-bold text-white">Excellent</p>
                <p className="text-safe text-sm mt-1">All systems nominal</p>
              </div>
            </div>
          </motion.div>

          {/* Battery Health */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Battery Health</p>
              <Battery className="w-5 h-5 text-electric" />
            </div>
            <div className="flex items-center gap-6">
              <AnimatedRing value={87} max={100} size={100} stroke={8} color="#3b82f6" label="Battery" unit="%" />
              <div>
                <p className="text-3xl font-bold text-white">Good</p>
                <p className="text-electric text-sm mt-1">12h monitoring left</p>
              </div>
            </div>
          </motion.div>

          {/* AI Confidence */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">AI Confidence</p>
              <Eye className="w-5 h-5 text-cyan" />
            </div>
            <div className="flex items-center gap-6">
              <AnimatedRing value={98} max={100} size={100} stroke={8} color="#06b6d4" label="Confidence" unit="%" />
              <div>
                <p className="text-3xl font-bold text-white">Very High</p>
                <p className="text-cyan text-sm mt-1">Neural net active</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mt-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-white">Activity Timeline</p>
              <p className="text-xs text-white/30">Last 24 hours</p>
            </div>
            <div className="flex items-center gap-4">
              {[{ label: 'Normal', color: '#10b981' }, { label: 'Alert', color: '#3b82f6' }, { label: 'Warning', color: '#ef4444' }].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] text-white/40">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart />
        </motion.div>

        {/* System status banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 flex items-center gap-4 p-4 rounded-2xl border border-safe/30 bg-safe/5"
        >
          <div className="relative">
            <ShieldCheck className="w-6 h-6 text-safe" />
            <div className="absolute inset-0 blur-lg bg-safe/30" />
          </div>
          <div>
            <p className="text-sm font-medium text-safe">AI is Active and Protecting You</p>
            <p className="text-xs text-white/40">Everything looks good. You're safe.</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white/20" />
            <div className="flex gap-0.5 items-end h-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full bg-safe/60"
                  animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
