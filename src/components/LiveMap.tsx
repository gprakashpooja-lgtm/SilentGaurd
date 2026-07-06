import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Navigation, Car, ShieldCheck, Users, Building, MapPin } from 'lucide-react';

/* ─── ROUTE BEZIER PATH (SVG coords, viewBox 1000 550) ──────────────── */
const ROUTE = 'M 160,420 C 260,380 360,300 480,240 C 580,190 660,160 780,120';

/* ─── ROUTE PARTICLES ──────────────────────────────────────────────── */
function RouteParticles({ animate }: { animate: boolean }) {
  const count = 14;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r={2.5}
          fill="#22d3ee"
          opacity={0.8}
          // @ts-expect-error – SVG motion property via CSS custom
          style={{
            offsetPath: `path('${ROUTE}')`,
            filter: 'drop-shadow(0 0 5px #22d3ee)',
          }}
          animate={
            animate
              ? {
                  offsetDistance: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                }
              : {}
          }
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: (i / count) * 3.5,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

/* ─── DETAILED AMBULANCE (top-down SVG) ─────────────────────────────── */
function AmbulanceSVG() {
  return (
    <g>
      {/* Glow beneath */}
      <ellipse cx="0" cy="4" rx="22" ry="10" fill="rgba(239,68,68,0.25)" />
      {/* Body */}
      <rect x="-18" y="-28" width="36" height="56" rx="6" fill="#f1f5f9" />
      {/* Cab (front) */}
      <rect x="-16" y="-28" width="32" height="20" rx="5" fill="#e2e8f0" />
      {/* Windshield */}
      <rect x="-11" y="-25" width="22" height="12" rx="3" fill="rgba(96,165,250,0.7)" />
      {/* Red cross */}
      <rect x="-3" y="-5" width="6" height="18" rx="1.5" fill="#ef4444" />
      <rect x="-9" y="-1" width="18" height="6" rx="1.5" fill="#ef4444" />
      {/* Stripe */}
      <rect x="-18" y="6" width="36" height="6" rx="0" fill="#ef4444" opacity="0.85" />
      {/* Wheels */}
      <rect x="-21" y="-24" width="7" height="10" rx="2" fill="#334155" />
      <rect x="14" y="-24" width="7" height="10" rx="2" fill="#334155" />
      <rect x="-21" y="18" width="7" height="10" rx="2" fill="#334155" />
      <rect x="14" y="18" width="7" height="10" rx="2" fill="#334155" />
      {/* Lights */}
      <circle cx="-12" cy="-28" r="3" fill="#3b82f6" opacity="0.9" />
      <circle cx="12" cy="-28" r="3" fill="#ef4444" opacity="0.9" />
    </g>
  );
}

/* ─── GPS RINGS (user location) ─────────────────────────────────────── */
function GPSRings({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      {[28, 48, 68, 90].map((r, i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={i === 0 ? 1.5 : 1}
          opacity={0}
          animate={{
            r: [r * 0.6, r],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={10} fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={5} fill="#3b82f6" />
      <motion.circle
        cx={cx} cy={cy} r={8}
        fill="none" stroke="#3b82f6" strokeWidth="1.5"
        animate={{ opacity: [1, 0], r: [8, 22] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </>
  );
}

/* ─── EMERGENCY BEACON (destination) ────────────────────────────────── */
function EmergencyBeacon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      {/* Glow platform */}
      <motion.circle
        cx={cx} cy={cy + 4} r={55}
        fill="url(#beacon-glow)"
        animate={{ r: [50, 65, 50], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Pin shadow */}
      <ellipse cx={cx} cy={cy + 8} rx={14} ry={5} fill="rgba(0,0,0,0.4)" />
      {/* Pin body */}
      <motion.path
        d={`M${cx},${cy + 8} L${cx - 16},${cy - 20} C${cx - 16},${cy - 45} ${cx + 16},${cy - 45} ${cx + 16},${cy - 20} Z`}
        fill="#ef4444"
        animate={{ filter: ['drop-shadow(0 0 8px #ef4444)', 'drop-shadow(0 0 20px #ef4444)', 'drop-shadow(0 0 8px #ef4444)'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <circle cx={cx} cy={cy - 20} r={10} fill="#fff" opacity={0.9} />
      <motion.circle cx={cx} cy={cy - 20} r={6} fill="#ef4444"
        animate={{ r: [6, 8, 6] }} transition={{ duration: 1, repeat: Infinity }} />
    </>
  );
}

/* ─── CITY GRID ─────────────────────────────────────────────────────── */
function CityGrid() {
  // Perspective grid lines converging toward horizon (~Y=40)
  const horizon = 40;
  const bottom = 550;
  const vw = 1000;

  // Vertical perspective lines (fan out from vanishing point center)
  const vpX = 500; // vanishing point x
  const cols = 14;
  const hLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const vLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  for (let i = 0; i <= cols; i++) {
    const bx = (i / cols) * vw;
    vLines.push({ x1: vpX, y1: horizon, x2: bx, y2: bottom });
  }

  // Horizontal lines (evenly spaced, slightly curved perspective)
  const rows = 10;
  for (let i = 0; i <= rows; i++) {
    const t = i / rows;
    // exponential spacing for perspective feel
    const y = horizon + Math.pow(t, 1.6) * (bottom - horizon);
    const spread = t * (vw / 2);
    hLines.push({ x1: vpX - spread, y1: y, x2: vpX + spread, y2: y });
  }

  return (
    <g opacity={0.55}>
      {vLines.map((l, i) => (
        <line key={`v${i}`} {...l} stroke="rgba(59,130,246,0.25)" strokeWidth="0.6" />
      ))}
      {hLines.map((l, i) => (
        <line key={`h${i}`} {...l} stroke="rgba(59,130,246,0.3)" strokeWidth="0.7" />
      ))}

      {/* Road outlines — key streets */}
      <path d="M 0,280 Q 500,220 1000,180" fill="none" stroke="rgba(96,165,250,0.18)" strokeWidth="14" />
      <path d="M 0,380 Q 400,330 1000,280" fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="10" />
      <path d="M 250,0 Q 320,200 380,550" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="10" />
      <path d="M 600,0 Q 650,200 680,550" fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="8" />

      {/* Road highlights (center dividers) */}
      <path d="M 0,280 Q 500,220 1000,180" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1.5" strokeDasharray="12,8" />
      <path d="M 250,0 Q 320,200 380,550" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="1" strokeDasharray="10,7" />
    </g>
  );
}

/* ─── BUILDING BLOCKS ────────────────────────────────────────────────── */
function CityBuildings() {
  const blocks = [
    { x: 60, y: 160, w: 50, h: 35, color: 'rgba(30,41,59,0.9)', glow: false },
    { x: 130, y: 150, w: 40, h: 45, color: 'rgba(30,41,59,0.8)', glow: false },
    { x: 430, y: 80, w: 55, h: 45, color: 'rgba(30,58,138,0.7)', glow: true },
    { x: 510, y: 70, w: 45, h: 55, color: 'rgba(30,58,138,0.8)', glow: true },
    { x: 700, y: 60, w: 60, h: 40, color: 'rgba(30,41,59,0.85)', glow: false },
    { x: 780, y: 50, w: 45, h: 50, color: 'rgba(15,23,42,0.9)', glow: false },
    { x: 840, y: 55, w: 35, h: 40, color: 'rgba(30,41,59,0.8)', glow: false },
    { x: 50, y: 300, w: 60, h: 30, color: 'rgba(15,23,42,0.9)', glow: false },
    { x: 900, y: 200, w: 50, h: 40, color: 'rgba(30,41,59,0.85)', glow: false },
  ];

  return (
    <g>
      {blocks.map((b, i) => (
        <g key={i}>
          {b.glow && (
            <rect
              x={b.x - 4} y={b.y - 4}
              width={b.w + 8} height={b.h + 8}
              rx={4} fill="rgba(59,130,246,0.08)"
              style={{ filter: 'blur(4px)' }}
            />
          )}
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={2} fill={b.color} />
          {/* Window grid */}
          {b.glow && (
            <g opacity={0.5}>
              {Array.from({ length: Math.floor(b.w / 10) }).map((_, wi) =>
                Array.from({ length: Math.floor(b.h / 10) }).map((_, hi) => (
                  <rect
                    key={`${wi}-${hi}`}
                    x={b.x + 4 + wi * 10}
                    y={b.y + 4 + hi * 10}
                    width={5}
                    height={5}
                    rx={0.5}
                    fill={Math.random() > 0.4 ? 'rgba(147,197,253,0.7)' : 'rgba(30,58,138,0.3)'}
                  />
                ))
              )}
            </g>
          )}
          {/* Building top edge */}
          <line x1={b.x} y1={b.y} x2={b.x + b.w} y2={b.y} stroke="rgba(148,163,184,0.2)" strokeWidth="0.8" />
        </g>
      ))}
    </g>
  );
}

/* ─── MAP MARKER ─────────────────────────────────────────────────────── */
function MapMarker({
  cx, cy, label, color, Icon, pulse, delay,
}: {
  cx: number; cy: number; label: string; color: string; Icon: React.ElementType; pulse?: boolean; delay: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 180 }}
    >
      {pulse && (
        <motion.circle cx={cx} cy={cy} r={14}
          fill={color} opacity={0.15}
          animate={{ r: [14, 26, 14], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {/* Icon bg */}
      <circle cx={cx} cy={cy} r={14} fill={`${color}25`} stroke={`${color}60`} strokeWidth={1.2} />
      {/* Label pill */}
      <rect x={cx - 38} y={cy + 18} width={76} height={16} rx={8} fill="rgba(10,10,20,0.9)" stroke={`${color}30`} strokeWidth={0.8} />
      <text x={cx} y={cy + 29} textAnchor="middle" fontSize="8" fill={color} fontFamily="Inter, sans-serif" fontWeight="500">
        {label}
      </text>
    </motion.g>
  );
}

/* ─── FLOATING HUD CARD ─────────────────────────────────────────────── */
function HUDCard({
  x, y, title, value, color, delay, inView,
}: {
  x: string; y: string; title: string; value: string; color: string; delay: number; inView: boolean;
}) {
  return (
    <AnimatePresence>
      {inView && (
        <motion.div
          className="absolute flex items-start gap-2 pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Connector dot + line */}
          <div className="flex flex-col items-center mt-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <div className="w-px h-4" style={{ background: `${color}40` }} />
          </div>
          <div className="glass rounded-xl px-2.5 py-2" style={{ border: `1px solid ${color}30` }}>
            <p className="text-[9px] text-white/40 uppercase tracking-wider leading-none mb-1">{title}</p>
            <p className="text-[11px] font-semibold leading-none" style={{ color }}>{value}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── SCAN LINE ─────────────────────────────────────────────────────── */
function ScanLine({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="absolute inset-x-0 h-px pointer-events-none z-20"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.0) 5%, rgba(6,182,212,0.5) 30%, rgba(34,211,238,0.8) 50%, rgba(6,182,212,0.5) 70%, rgba(6,182,212,0.0) 95%, transparent 100%)',
      }}
      animate={inView ? { top: ['0%', '100%', '0%'] } : {}}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
    />
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function LiveMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [eta, setEta] = useState(7);
  const [progress, setProgress] = useState(0); // 0..1 ambulance progress
  const [routeDrawn, setRouteDrawn] = useState(false);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 50, damping: 20 });
  const py = useSpring(my, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 20);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  // ETA countdown
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => {
      setEta(e => Math.max(1, e - 1));
    }, 7000);
    return () => clearInterval(t);
  }, [inView]);

  // Ambulance progress loop
  useEffect(() => {
    if (!inView) return;
    setTimeout(() => setRouteDrawn(true), 1200);
    let p = 0;
    const t = setInterval(() => {
      p += 0.004;
      if (p > 1.05) p = 0;
      setProgress(Math.min(p, 1));
    }, 40);
    return () => clearInterval(t);
  }, [inView]);

  // Ambulance position along bezier (cubic: P0=160,420 P1=260,380 P2=480,240 P3=780,120)
  const t = progress;
  const cx = 160 * (1 - t) ** 3 + 3 * 260 * (1 - t) ** 2 * t + 3 * 480 * (1 - t) * t ** 2 + 780 * t ** 3;
  // Use two-segment bezier since our route is: M 160,420 C 260,380 360,300 480,240 C 580,190 660,160 780,120
  // Split at t=0.5 midpoint for the two-segment path; simple approximation:
  const cy_pos =
    t < 0.5
      ? 420 * (1 - t * 2) ** 3 + 3 * 380 * (1 - t * 2) ** 2 * (t * 2) + 3 * 300 * (1 - t * 2) * (t * 2) ** 2 + 240 * (t * 2) ** 3
      : 240 * (1 - (t - 0.5) * 2) ** 3 + 3 * 190 * (1 - (t - 0.5) * 2) ** 2 * ((t - 0.5) * 2) + 3 * 160 * (1 - (t - 0.5) * 2) * ((t - 0.5) * 2) ** 2 + 120 * ((t - 0.5) * 2) ** 3;

  // Route dash animation
  const routeLength = 720;

  return (
    <section className="py-24 px-4 relative" id="ecosystem">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-safe"
              />
              <span className="text-[10px] text-safe/70 font-mono tracking-[0.25em] uppercase">
                Live Response Map
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Live Tracking <span className="gradient-text-blue">in Action.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-lg">
              Real-time location and fastest emergency response. Every second counts.
            </p>
          </motion.div>

          {/* Ambulance status card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card rounded-2xl p-4 min-w-[220px]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative p-2.5 rounded-xl bg-emergency/15">
                <div className="absolute inset-0 rounded-xl bg-emergency/20 blur-md" />
                <Car className="w-6 h-6 text-emergency relative z-10" />
              </div>
              <div>
                <p className="text-xs text-white/40">Ambulance En Route</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emergency"
                  />
                  <span className="text-[10px] text-emergency font-medium">Live</span>
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-white/40 text-sm">ETA:</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={eta}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-bold text-emergency tabular-nums"
                >
                  {eta}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/40 text-sm">min</span>
            </div>
          </motion.div>
        </div>

        {/* ── MAP CONTAINER ─────────────────────────────────────────── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-card rounded-3xl overflow-hidden select-none"
          style={{ height: 500 }}
          onMouseMove={handleMouseMove}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-[#06061a]/90 to-transparent pointer-events-none">
            <div className="flex items-center gap-2">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-safe" />
              <span className="text-[11px] text-white/60 font-mono">LIVE RESPONSE MAP</span>
            </div>
            {/* 3D / zoom controls */}
            <div className="flex items-center gap-1 pointer-events-auto">
              {['3D', '+', '−'].map(b => (
                <button key={b} className="px-2.5 py-1.5 rounded-lg text-[11px] text-white/50 hover:text-white hover:bg-white/10 transition-colors glass">
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Scan line */}
          <ScanLine inView={inView} />

          {/* Vignette edges */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ boxShadow: 'inset 0 0 120px rgba(4,4,20,0.7)' }} />

          {/* Parallax map layer */}
          <motion.div
            className="absolute inset-0"
            style={{ x: px, y: py }}
          >
            {/* SVG map */}
            <svg
              viewBox="0 0 1000 550"
              className="w-full h-full"
              style={{ background: 'transparent' }}
            >
              <defs>
                {/* Route gradient */}
                <linearGradient id="route-neon" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                {/* User location glow */}
                <radialGradient id="user-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>

                {/* Beacon glow */}
                <radialGradient id="beacon-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>

                {/* Map dark bg gradient */}
                <radialGradient id="map-bg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0d1628" />
                  <stop offset="100%" stopColor="#060610" />
                </radialGradient>

                {/* Bloom filter for glow effects */}
                <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Map background */}
              <rect width="1000" height="550" fill="url(#map-bg)" />

              {/* City grid */}
              <CityGrid />

              {/* City buildings */}
              <CityBuildings />

              {/* ── ROUTE ── */}
              {/* Shadow/glow layer */}
              <path d={ROUTE} fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="18" strokeLinecap="round" />
              {/* Drawn route */}
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="url(#route-neon)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={routeLength}
                initial={{ strokeDashoffset: routeLength }}
                animate={routeDrawn ? { strokeDashoffset: 0 } : {}}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                filter="url(#bloom)"
              />
              {/* Animated glowing segment ahead of ambulance */}
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="rgba(34,211,238,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${routeLength * 0.12} ${routeLength}`}
                animate={{ strokeDashoffset: [0, -routeLength] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Route particles (using motion.g and CSS offsetPath trick) */}
              {inView && (
                <g>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const offset = (i / 10) * routeLength;
                    return (
                      <motion.circle
                        key={i}
                        r={2}
                        fill="#22d3ee"
                        strokeDasharray={`${routeLength} ${routeLength}`}
                        initial={{ strokeDashoffset: routeLength - offset }}
                        animate={{ strokeDashoffset: [-(offset), -(offset + routeLength)] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: (i / 10) * 0.5 }}
                        style={{ offsetPath: `path('${ROUTE}')`, offsetDistance: `${(i / 10) * 100}%`, filter: 'drop-shadow(0 0 4px #22d3ee)' } as React.CSSProperties}
                      />
                    );
                  })}
                </g>
              )}

              {/* User location GPS rings */}
              <GPSRings cx={160} cy={420} />

              {/* Emergency beacon at destination */}
              <EmergencyBeacon cx={780} cy={150} />

              {/* Other map markers */}
              <MapMarker cx={430} cy={200} label="City Hospital" color="#10b981" Icon={Building} pulse delay={0.8} />
              <MapMarker cx={680} cy={290} label="Police" color="#06b6d4" Icon={ShieldCheck} delay={1.0} />
              <MapMarker cx={280} cy={330} label="Safe Zone" color="#10b981" Icon={MapPin} delay={1.2} />
              <MapMarker cx={600} cy={180} label="Emergency Contact" color="#f97316" Icon={Users} pulse delay={0.9} />

              {/* ── AMBULANCE ── */}
              {inView && (
                <motion.g
                  transform={`translate(${cx}, ${cy_pos}) rotate(-35)`}
                  filter="url(#glow-strong)"
                >
                  <AmbulanceSVG />
                </motion.g>
              )}

              {/* Progress trail dots */}
              {[0.2, 0.4, 0.6].map((p, i) => {
                if (progress < p) return null;
                const tx = 160 * (1 - p) ** 3 + 3 * 260 * (1 - p) ** 2 * p + 3 * 480 * (1 - p) * p ** 2 + 780 * p ** 3;
                const ty = p < 0.5
                  ? 420 * (1 - p * 2) ** 3 + 3 * 380 * (1 - p * 2) ** 2 * (p * 2) + 3 * 300 * (1 - p * 2) * (p * 2) ** 2 + 240 * (p * 2) ** 3
                  : 240 * (1 - (p - 0.5) * 2) ** 3 + 3 * 190 * (1 - (p - 0.5) * 2) ** 2 * ((p - 0.5) * 2) + 3 * 160 * (1 - (p - 0.5) * 2) * ((p - 0.5) * 2) ** 2 + 120 * ((p - 0.5) * 2) ** 3;
                return (
                  <circle key={i} cx={tx} cy={ty} r={4} fill="rgba(239,68,68,0.4)"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.8))' }} />
                );
              })}
            </svg>

            {/* Floating HUD cards */}
            <HUDCard x="18%" y="52%" title="Your Location" value="Live GPS" color="#3b82f6" delay={0.8} inView={inView} />
            <HUDCard x="70%" y="12%" title="Destination" value="1.2 km" color="#ef4444" delay={1.0} inView={inView} />
            <HUDCard x="40%" y="32%" title="City Hospital" value="Ready" color="#10b981" delay={1.2} inView={inView} />
          </motion.div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="glass rounded-xl p-3 flex items-center gap-5">
              {[
                { color: '#3b82f6', label: 'You' },
                { color: '#ef4444', label: 'Ambulance' },
                { color: '#10b981', label: 'Destination' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                  <span className="text-[10px] text-white/50">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#06061a]/80 to-transparent pointer-events-none z-10" />
        </motion.div>
      </div>
    </section>
  );
}
