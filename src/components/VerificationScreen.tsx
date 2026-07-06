import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CheckCircle, X, Volume2, Phone } from 'lucide-react';

// ---- Full-screen cinematic overlay ----
export function VerificationOverlay({ onTimeout, onSafe }: { onTimeout: () => void; onSafe: () => void }) {
  const [count, setCount] = useState(20);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (count <= 0) { onTimeout(); return; }
    const t = setTimeout(() => {
      setCount(c => c - 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }, 1000);
    return () => clearTimeout(t);
  }, [count, onTimeout]);

  const pct = count / 20;
  // Color transitions: blue (20s) → orange (10s) → red (0s)
  const bgColor = count > 13
    ? `rgba(59,130,246,${0.12 + (1 - pct) * 0.05})`
    : count > 6
    ? `rgba(249,115,22,${0.12 + (1 - pct) * 0.08})`
    : `rgba(239,68,68,${0.15 + (1 - pct) * 0.12})`;

  const ringColor = count > 13 ? ['#3b82f6', '#06b6d4'] : count > 6 ? ['#f97316', '#ef4444'] : ['#ef4444', '#dc2626'];
  const r = 115;
  const circ = 2 * Math.PI * r;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic background */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: `radial-gradient(ellipse at center, ${bgColor} 0%, rgba(4,4,14,0.98) 70%)` }}
        transition={{ duration: 0.8 }}
      />

      {/* Expanding pulse rings every second */}
      <AnimatePresence>
        {pulse && (
          <motion.div
            key={count}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{ borderColor: ringColor[0] + '40' }}
                initial={{ width: 280, height: 280, opacity: 0.6 }}
                animate={{ width: 280 + i * 200, height: 280 + i * 200, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-5" style={{ color: ringColor[0] + 'aa' }}>
          03 — Verification
        </p>
        <motion.h2
          animate={{ scale: pulse ? [1, 1.008, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight"
        >
          Are You Safe?
        </motion.h2>
        <p className="text-white/40 text-sm mb-10">We need to make sure you're okay. Please respond.</p>

        {/* Countdown ring */}
        <div className="relative mb-8">
          <div className="relative w-64 h-64">
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-3 rounded-full"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: pulse ? 0.3 : 1.5, repeat: Infinity }}
              style={{ background: `radial-gradient(circle, ${ringColor[0]}30 0%, transparent 70%)` }}
            />

            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="128" cy="128" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="128" cy="128" r={r}
                fill="none" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${circ}`}
                animate={{ strokeDashoffset: circ - pct * circ }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                stroke={`url(#verify-ring-grad)`}
              />
              <defs>
                <linearGradient id="verify-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={ringColor[0]} />
                  <stop offset="100%" stopColor={ringColor[1]} />
                </linearGradient>
              </defs>
            </svg>

            {/* Heartbeat line around ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              animate={{ opacity: pulse ? [0, 0.8, 0] : 0, scale: pulse ? [1, 1.04, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{ borderColor: ringColor[0] }}
            />

            {/* Center number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={count}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-7xl font-bold text-white tabular-nums"
                style={{ textShadow: `0 0 40px ${ringColor[0]}80` }}
              >
                {count}
              </motion.span>
              <span className="text-xs text-white/35 mt-1">seconds</span>
            </div>
          </div>

          {/* ECG heartbeat line */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-48">
            <svg viewBox="0 0 192 20" className="w-full h-5">
              <motion.path
                d="M0,10 L30,10 L38,2 L44,18 L50,6 L56,10 L80,10 L88,2 L94,18 L100,6 L106,10 L130,10 L138,2 L144,18 L150,6 L156,10 L192,10"
                fill="none"
                stroke={ringColor[0]}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>

        <p className="text-white/30 text-xs mb-8">Swipe or tap to respond</p>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {[
            { icon: CheckCircle, title: "I'm Safe", desc: 'Tap to stop alert', bg: '#10b981', onClick: onSafe },
            { icon: X, title: 'Swipe to Cancel', desc: 'Swipe right to cancel', bg: null, onClick: undefined },
            { icon: Volume2, title: 'Voice Confirmation', desc: 'Say "I\'m Safe"', bg: null, onClick: undefined },
            { icon: Phone, title: 'Emergency Call', desc: 'Call emergency services', bg: '#ef4444', onClick: undefined },
          ].map((btn, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={btn.onClick}
              className="relative p-5 rounded-2xl flex flex-col items-center gap-2.5 overflow-hidden text-center"
              style={btn.bg ? { background: btn.bg + 'cc' } : undefined}
            >
              {!btn.bg && <div className="absolute inset-0 glass-card" />}
              {btn.bg && (
                <div className="absolute -inset-1 blur-xl opacity-0 hover:opacity-30 transition-opacity"
                  style={{ background: btn.bg }} />
              )}
              <btn.icon className="w-6 h-6 text-white relative z-10" />
              <div className="relative z-10">
                <p className="text-sm font-semibold text-white">{btn.title}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{btn.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---- In-page demo section ----
export default function VerificationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [inView]);

  const displayCount = Math.max(0, 20 - tick);
  const pct = displayCount / 20;
  const r = 115;
  const circ = 2 * Math.PI * r;

  const ringColor = displayCount > 13 ? '#3b82f6' : displayCount > 6 ? '#f97316' : '#ef4444';

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[600px] h-[600px] rounded-full opacity-10"
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: `radial-gradient(circle, ${ringColor}80 0%, transparent 70%)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Countdown */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: ringColor + 'aa' }}>
              03 — Verification
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Are You Safe?</h2>
            <p className="text-white/40">We need to make sure you're okay. Please respond.</p>

            <div className="relative w-64 h-64">
              <motion.div
                className="absolute -inset-2 rounded-full opacity-20"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ background: `radial-gradient(circle, ${ringColor} 0%, transparent 70%)` }}
              />
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="128" cy="128" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="128" cy="128" r={r}
                  fill="none" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${circ}`}
                  animate={{ strokeDashoffset: circ - pct * circ }}
                  transition={{ duration: 0.6 }}
                  stroke={ringColor}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={displayCount}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="text-7xl font-bold text-white tabular-nums"
                  style={{ textShadow: `0 0 30px ${ringColor}60` }}
                >
                  {displayCount}
                </motion.span>
                <span className="text-xs text-white/35 mt-1">seconds</span>
              </div>
            </div>
            <p className="text-white/30 text-sm">Swipe or tap to respond</p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-3"
          >
            {[
              { icon: CheckCircle, title: "I'm Safe", desc: 'Tap to stop alert', color: '#10b981' },
              { icon: X, title: 'Swipe to Cancel', desc: 'Swipe right to cancel', color: '#ffffff99' },
              { icon: Volume2, title: 'Voice Confirmation', desc: 'Say "I\'m Safe"', color: '#06b6d4' },
              { icon: Phone, title: 'Emergency Call', desc: 'Call emergency services', color: '#ef4444' },
            ].map((btn, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-5 rounded-2xl text-left glass-card hover:bg-white/8 transition-all"
              >
                <div className="p-3 rounded-xl bg-white/8" style={{ boxShadow: `0 0 20px ${btn.color}30` }}>
                  <btn.icon className="w-5 h-5" style={{ color: btn.color }} />
                </div>
                <div>
                  <p className="font-semibold text-white">{btn.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{btn.desc}</p>
                </div>
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: btn.color }} />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
