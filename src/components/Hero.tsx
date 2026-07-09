import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import {
  Shield, Activity, MapPin, Battery, ArrowDown, Play,
  ChevronDown, Zap, Cpu, Clock, Radio
} from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useMouseParallax } from '../hooks/useMouseParallax';

// ---- Word reveal ----
function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '115%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ---- Stats ----
const STATS = [
  { icon: Clock, value: 3, suffix: 's', prefix: '<', label: 'Detection' },
  { icon: Radio, value: 24, suffix: '/7', label: 'AI Monitoring' },
  { icon: Cpu, value: 98, suffix: '%', label: 'AI Confidence' },
  { icon: Zap, value: 0, suffix: '', label: 'Instant SOS', text: 'Instant' },
];

function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const [visible, setVisible] = useState(false);
  const count = useAnimatedCounter(stat.value, 1800, visible);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onViewportEnter={() => setVisible(true)}
      className="flex flex-col items-center text-center"
    >
      <stat.icon className="w-4 h-4 text-electric mb-1 opacity-70" />
      <span className="text-2xl font-bold text-white tabular-nums leading-none">
        {stat.text ?? `${stat.prefix ?? ''}${count}${stat.suffix}`}
      </span>
      <span className="text-[11px] text-white/35 mt-1 leading-tight">{stat.label}</span>
    </motion.div>
  );
}

// ---- Glowing Particle ----
function GlowingParticle({ x, y, size, color, delay }: {
  x: string; y: string; size: number; color: string; delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}40`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.8, 0.4, 0.8, 0], scale: [0.5, 1, 0.8, 1, 0.5] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ---- 3D Phone ----
function HolographicPhone({ onEmergency, triggered, containerRef }: {
  onEmergency: () => void; triggered: boolean; containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-120, 120], [8, -8]);
  const rotY = useTransform(mx, [-120, 120], [-8, 8]);
  const springRotX = useSpring(rotX, { stiffness: 100, damping: 25 });
  const springRotY = useSpring(rotY, { stiffness: 100, damping: 25 });

  const [dragDist, setDragDist] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!phoneRef.current || isDragging) return;
    const r = phoneRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };

  // Orbital particles around phone
  const orbitalParticles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * 360,
    radius: 145 + Math.sin(i * 1.7) * 25,
    size: 2 + Math.random() * 2.5,
    speed: 10 + Math.random() * 8,
    delay: Math.random() * 5,
    color: i % 4 === 0 ? '#3b82f6' : i % 4 === 1 ? '#06b6d4' : i % 4 === 2 ? '#10b981' : '#60a5fa',
  }));

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center"
      style={{ perspective: '1600px' }}
    >
      {/* Volumetric light cone behind phone */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 180,
          height: 400,
          background: 'linear-gradient(0deg, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.08) 40%, transparent 100%)',
          clipPath: 'polygon(30% 100%, 70% 100%, 90% 0%, 10% 0%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Soft bloom aura */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          width: 320,
          height: 320,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Holographic expanding rings behind phone */}
      {[180, 230, 280, 340].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: r,
            height: r,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: `1px solid rgba(59,130,246,${0.35 - i * 0.07})`,
            boxShadow: `0 0 ${15 - i * 2}px rgba(59,130,246,${0.2 - i * 0.04})`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 4 + i * 0.8, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Rotating holographic platform */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 260,
          height: 50,
        }}
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(59,130,246,0.4) 0%, rgba(6,182,212,0.3) 50%, rgba(16,185,129,0.2) 100%)',
            filter: 'blur(3px)',
          }}
        />
        {/* Platform ring detail */}
        <svg viewBox="0 0 260 50" className="absolute inset-0">
          <ellipse cx="130" cy="25" rx="128" ry="24" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="1" />
          <ellipse cx="130" cy="25" rx="100" ry="18" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Orbital particles */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{ transform: 'translateZ(20px)' }}>
        {orbitalParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: '50%',
              top: '50%',
              boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 5}px ${p.color}60`,
            }}
            animate={{
              x: [
                Math.cos((p.angle * Math.PI) / 180) * p.radius - p.size / 2,
                Math.cos(((p.angle + 360) * Math.PI) / 180) * p.radius - p.size / 2,
              ],
              y: [
                Math.sin((p.angle * Math.PI) / 180) * p.radius * 0.35 - p.size / 2,
                Math.sin(((p.angle + 360) * Math.PI) / 180) * p.radius * 0.35 - p.size / 2,
              ],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: p.speed, repeat: Infinity, ease: 'linear', delay: p.delay }}
          />
        ))}
      </div>

      {/* Phone body - highest z-index */}
      <motion.div
        ref={phoneRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        className="relative z-30"
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          triggered
            ? { y: 600, rotateZ: -30, opacity: 0 }
            : { y: [0, -18, 0], rotateZ: [0, 1.2, -0.8, 0], rotateY: [0, 2, -2, 0] }
        }
        transition={
          triggered
            ? { duration: 1, ease: 'easeIn' }
            : {
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                rotateZ: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                rotateY: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        drag={triggered ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 320 }}
        dragElastic={0.08}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => setDragDist(info.offset.y)}
        onDragEnd={() => {
          if (dragDist > 180) onEmergency();
          setDragDist(0);
          setIsDragging(false);
        }}
      >
        {/* Phone outer glow */}
        <div
          className="absolute -inset-8 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Phone frame */}
        <div className="relative w-56 h-[460px] cursor-grab active:cursor-grabbing select-none">
          <div className="absolute inset-0 rounded-[42px] bg-gradient-to-b from-[#2a2a35] via-[#1a1a25] to-[#0d0d18] shadow-2xl">
            <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-white/12 via-transparent to-white/5 pointer-events-none" />
            {/* Side reflection */}
            <div className="absolute right-0 top-[15%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>

          {/* Screen */}
          <div className="absolute inset-[3px] rounded-[40px] overflow-hidden bg-gradient-to-br from-[#06061a] to-[#0a0a20]">
            <div className="absolute inset-0 bg-gradient-to-br from-electric/12 via-transparent to-cyan/8 pointer-events-none" />

            {/* Scan line */}
            <motion.div
              className="absolute inset-x-0 h-0.5 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)' }}
              animate={{ top: ['-1%', '101%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mb-2"
              >
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full bg-electric/25 blur-lg" />
                  <div className="absolute inset-1 rounded-full border border-electric/40 animate-ping" style={{ animationDuration: '2.5s' }} />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center relative z-10 shadow-lg shadow-electric/30">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
              </motion.div>
              <p className="text-sm font-semibold text-white/90">SilentGuard</p>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[10px] text-electric/90 mt-0.5 tracking-widest uppercase font-medium"
              >
                AI Active
              </motion.p>

              {/* Status row */}
              <div className="absolute bottom-6 left-3 right-3 grid grid-cols-3 gap-1">
                {[
                  { icon: Activity, l: 'Normal', c: '#10b981' },
                  { icon: MapPin, l: 'GPS', c: '#06b6d4' },
                  { icon: Battery, l: '98%', c: '#3b82f6' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <s.icon className="w-3 h-3" style={{ color: s.c }} />
                    <span className="text-[7px] text-white/40">{s.l}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dynamic island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black" />
          </div>

          {/* Side buttons */}
          <div className="absolute -left-[2px] top-20 w-[2px] h-7 rounded-l-sm bg-[#3a3a45]" />
          <div className="absolute -left-[2px] top-32 w-[2px] h-7 rounded-l-sm bg-[#3a3a45]" />
          <div className="absolute -right-[2px] top-28 w-[2px] h-10 rounded-r-sm bg-[#3a3a45]" />
        </div>
      </motion.div>

      {/* Drag hint */}
      <AnimatePresence>
        {!isDragging && !triggered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-14 flex flex-col items-center gap-1 z-20"
          >
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <ArrowDown className="w-4 h-4 text-electric/50" />
            </motion.div>
            <p className="text-[10px] text-white/30">Drag down to simulate emergency</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag progress bar */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-14 flex flex-col items-center gap-1 z-20"
          >
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-electric to-emergency"
                style={{ width: `${Math.min((dragDist / 180) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-white/40">{dragDist > 150 ? 'Release!' : 'Pull more'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Live System Status Panel ----
function LiveStatusPanel() {
  const [data, setData] = useState({ motion: 'Normal', impact: 'Low', battery: 87, connection: 'Strong' });
  useEffect(() => {
    const t = setInterval(() => {
      setData(d => ({ ...d, battery: Math.max(85, Math.min(99, d.battery + (Math.random() > 0.5 ? 1 : -1))) }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-electric/60 font-mono tracking-[0.25em] uppercase">Always Watching.</p>
            <p className="text-base font-semibold text-white mt-0.5">Always <span className="text-electric">Protecting.</span></p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-safe/15 border border-safe/25">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-safe" />
            <span className="text-[10px] text-safe font-medium">Live</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {STATS.map((s, i) => (
            <StatCard key={i} stat={s} delay={1.2 + i * 0.1} />
          ))}
        </div>

        <div className="h-px bg-white/6 mb-4" />

        {/* System status cards */}
        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">System Status</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Motion', value: data.motion, color: '#10b981' },
            { label: 'Impact', value: data.impact, color: '#10b981' },
            { label: 'Battery', value: `${data.battery}%`, color: '#3b82f6' },
            { label: 'Signal', value: data.connection, color: '#10b981' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/4 hover:bg-white/7 transition-colors">
              <p className="text-[10px] text-white/35 mb-1">{item.label}</p>
              <p className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</p>
              <div className="flex items-end gap-0.5 h-3 mt-1.5">
                {Array.from({ length: 10 }).map((_, j) => (
                  <motion.div
                    key={j}
                    className="flex-1 rounded-t-sm"
                    style={{ background: `${item.color}60` }}
                    animate={{ height: ['20%', `${Math.random() * 70 + 30}%`, '20%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.08 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main Hero ----
export default function Hero({ onEmergency, triggered }: { onEmergency: () => void; triggered: boolean }) {
  const mouse = useMouseParallax(0.02);
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  // Generate neural particle positions
  const particles = Array.from({ length: 25 }, (_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 1.5 + Math.random() * 2.5,
    color: ['#3b82f6', '#06b6d4', '#10b981', '#60a5fa'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 3,
  }));

  return (
    <section id="home" className="min-h-screen relative flex items-center overflow-hidden pt-20 pb-10">
      {/* Background gradient orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: mouse.x * -0.3, y: mouse.y * -0.3 }}
      >
        <div className="absolute top-[20%] left-[15%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-[25%] right-[20%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      </motion.div>

      {/* Subtle neural particles across hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <GlowingParticle key={i} {...p} />
        ))}
      </div>

      {/* Light streak */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute top-[35%] left-0 right-0 h-px origin-left pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.15) 30%, rgba(6,182,212,0.15) 70%, transparent)' }}
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr_minmax(0,380px)] gap-8 xl:gap-16 items-center">

          {/* ---- LEFT: Copy ---- */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-full border border-electric/30 bg-electric/5"
            >
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-electric" />
              <span className="text-[11px] text-electric font-medium tracking-widest uppercase">AI Safety Intelligence</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              <WordReveal text="Help Begins" className="block text-white" delay={0.4} />
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '115%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-white">Before You </span>
                  <span className="gradient-text-blue">Ask.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="text-base text-white/45 leading-relaxed max-w-md"
            >
              AI that detects emergencies, verifies safety, and coordinates help—before it's too late.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="flex flex-wrap gap-3"
            >
              <button className="group relative px-6 py-3.5 rounded-xl font-medium text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-electric to-cyan" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan to-electric opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-electric to-cyan blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 text-sm font-semibold">
                  <Shield className="w-4 h-4" />
                  Try Live Demo
                </span>
              </button>

              <button className="group px-6 py-3.5 rounded-xl font-medium text-white/60 hover:text-white transition-colors flex items-center gap-2 glass-button text-sm">
                <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center group-hover:border-electric/50 transition-colors">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                Watch Overview
              </button>
            </motion.div>
          </div>

          {/* ---- CENTER: Phone ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center min-h-[520px] py-8"
          >
            <HolographicPhone
              onEmergency={onEmergency}
              triggered={triggered}
              containerRef={phoneContainerRef}
            />
          </motion.div>

          {/* ---- RIGHT: Dashboard panel ---- */}
          <div className="flex justify-center lg:justify-end">
            <LiveStatusPanel />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#060610] to-transparent pointer-events-none" />
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-white/25 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/25" />
      </motion.div>
    </section>
  );
}
