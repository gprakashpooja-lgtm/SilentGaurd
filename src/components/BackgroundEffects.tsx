import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// ---- Particle Field ----
export function ParticleField() {
  const [particles] = useState(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.35 + 0.08,
      color: i % 3 === 0 ? '59,130,246' : i % 3 === 1 ? '6,182,212' : '16,185,129',
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/5 w-[700px] h-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
        animate={{ x: [0, -60, 50, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Light streaks */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.12) 40%, rgba(6,182,212,0.12) 60%, transparent)' }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-2/3 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.08) 50%, transparent)' }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay: 5 }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.016]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: `rgba(${p.color},${p.opacity})` }}
          animate={{ y: [0, -120, 0], x: [0, (Math.random() - 0.5) * 40, 0], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ---- Scroll Progress ----
export function ScrollProgress() {
  const scrollY = useMotionValue(0);
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      scrollY.set(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [scrollY]);
  const scaleX = useSpring(scrollY, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{ scaleX, background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)' }}
    />
  );
}

// ---- Mouse Glow ----
export function MouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });
  useEffect(() => {
    const h = (e: MouseEvent) => { x.set(e.clientX - 300); y.set(e.clientY - 300); };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [x, y]);
  return (
    <motion.div
      className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
      style={{ x: sx, y: sy, background: 'radial-gradient(circle, rgba(59,130,246,0.035) 0%, transparent 70%)' }}
    />
  );
}

// ---- AI Scanning Overlay ----
const SCAN_STEPS = [
  { pct: 0, status: 'Initializing sensors...' },
  { pct: 12, status: 'Detecting Motion...' },
  { pct: 31, status: 'Checking Impact...' },
  { pct: 48, status: 'Verifying User...' },
  { pct: 71, status: 'Analyzing Environment...' },
  { pct: 89, status: 'Cross-checking Location...' },
  { pct: 97, status: 'Emergency Confirmed' },
];

const SENSOR_CARDS = ['Motion', 'Impact', 'Audio', 'GPS', 'AI', 'Bio'];

export function AIScanningOverlay({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const tick = () => {
      if (idx >= SCAN_STEPS.length - 1) {
        setDone(true);
        setTimeout(onComplete, 900);
        return;
      }
      idx++;
      setStepIdx(idx);
      const target = SCAN_STEPS[idx].pct;
      let cur = SCAN_STEPS[idx - 1].pct;
      const inc = setInterval(() => {
        cur += 1;
        setDisplayPct(cur);
        if (cur >= target) clearInterval(inc);
      }, 18);
      setTimeout(tick, 650);
    };
    const init = setTimeout(tick, 400);
    return () => clearTimeout(init);
  }, [onComplete]);

  const r = 100;
  const circ = 2 * Math.PI * r;
  const fillPct = (displayPct / 100) * circ;
  const isEmergency = displayPct >= 71;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'rgba(4,4,14,0.97)', backdropFilter: 'blur(24px)' }}
    >
      {/* Flash on trigger */}
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-white pointer-events-none"
      />

      {/* Background color bleed */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: isEmergency ? [0, 0.15, 0.1] : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)' }} />
      </motion.div>

      {/* Horizontal scan laser */}
      <motion.div
        className="absolute inset-x-0 h-0.5 pointer-events-none z-20"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.9) 30%, rgba(34,211,238,1) 50%, rgba(6,182,212,0.9) 70%, transparent)' }}
        animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 0.8, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-sm text-center">
        {/* Radar rings */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                inset: i * 18,
                borderColor: isEmergency ? `rgba(239,68,68,${0.25 - i * 0.06})` : `rgba(59,130,246,${0.25 - i * 0.06})`,
              }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {/* Rotating radar sweep */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-0 left-1/2 w-0.5 h-1/2 origin-bottom"
              style={{ background: `linear-gradient(to top, ${isEmergency ? 'rgba(239,68,68,0.7)' : 'rgba(59,130,246,0.7)'}, transparent)` }} />
          </motion.div>

          {/* Confidence ring SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="112" cy="112" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <motion.circle
              cx="112"
              cy="112"
              r={r}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${circ}`}
              animate={{ strokeDashoffset: circ - fillPct }}
              transition={{ duration: 0.3 }}
              stroke={isEmergency ? 'url(#scan-emergency)' : 'url(#scan-normal)'}
            />
            <defs>
              <linearGradient id="scan-normal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="scan-emergency" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center: percentage */}
          <div className="relative z-10 text-center">
            <motion.p
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-5xl font-bold tabular-nums"
              style={{
                color: isEmergency ? '#ef4444' : '#3b82f6',
                textShadow: `0 0 30px ${isEmergency ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)'}`,
              }}
            >
              {displayPct}%
            </motion.p>
          </div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`text-base font-semibold ${done ? 'text-emergency' : isEmergency ? 'text-emergency' : 'text-white'}`}
            >
              {SCAN_STEPS[stepIdx]?.status}
            </motion.p>
          </AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emergency/70 text-sm"
            >
              Possible Emergency Detected
            </motion.p>
          )}
        </div>

        {/* Sensor cards pulsing */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {SENSOR_CARDS.map((card, i) => (
            <motion.div
              key={card}
              className="py-2 px-3 rounded-xl text-center glass"
              animate={i <= stepIdx ? { borderColor: ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.7)', 'rgba(59,130,246,0.2)'] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <motion.div
                animate={i <= stepIdx ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              >
                <p className="text-[10px] text-white/60">{card}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${i <= stepIdx ? 'text-electric' : 'text-white/25'}`}>
                  {i <= stepIdx ? 'Active' : 'Idle'}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
