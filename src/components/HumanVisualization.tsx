import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Premium holographic human body SVG paths
// Head: circle, body: detailed torso + limbs as smooth bezier paths
const BODY_PATH = `
  M 100,28
  C 100,14 90,6 80,6
  C 70,6 60,14 60,28
  C 60,42 70,50 80,50
  C 90,50 100,42 100,28 Z

  M 66,52 C 56,56 50,65 48,76
  L 42,104 C 40,110 44,116 50,116
  C 54,116 57,113 58,110 L 62,90
  L 62,130
  L 56,165 C 54,172 58,178 64,178
  C 68,178 72,175 73,171 L 80,145
  L 87,171 C 88,175 92,178 96,178
  C 102,178 106,172 104,165 L 98,130
  L 98,90 L 102,110
  C 103,113 106,116 110,116
  C 116,116 120,110 118,104
  L 112,76 C 110,65 104,56 94,52 Z
`;

const IMPACT_ZONE_PATH = `M 60,115 Q 80,120 100,115 Q 105,130 100,145 Q 80,150 60,145 Q 55,130 60,115 Z`;

interface HumanVisualizationProps {
  showImpact?: boolean;
  compact?: boolean;
}

export default function HumanVisualization({ showImpact = true, compact = false }: HumanVisualizationProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const scale = compact ? 1.6 : 2.2;
  const viewW = 160;
  const viewH = 190;

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{ width: viewW * scale, height: viewH * scale }}
    >
      {/* Outer holographic rings */}
      {[1.4, 1.2, 1.0].map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: 90 * scale * s,
            height: 200 * scale * s * 0.35,
            borderColor: `rgba(59,130,246,${0.15 - i * 0.04})`,
            bottom: compact ? -10 : -15,
            left: '50%',
            transform: 'translateX(-50%) rotateX(70deg)',
          }}
          animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [1, 1.04, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Volumetric glow behind body */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div
          className="w-3/4 h-4/5 rounded-full"
          style={{ background: showImpact
            ? 'radial-gradient(ellipse, rgba(239,68,68,0.2) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)'
          }}
        />
      </motion.div>

      {/* Main SVG */}
      <svg
        viewBox={`40 0 ${viewW} ${viewH}`}
        width={viewW * scale}
        height={viewH * scale}
        className="relative z-10"
        style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.5))' }}
      >
        <defs>
          {/* Body gradient - gives 3D depth */}
          <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.15" />
          </linearGradient>

          {/* Scan line gradient */}
          <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Impact glow */}
          <radialGradient id="impact-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          {/* Edge highlight */}
          <filter id="body-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <filter id="impact-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Clip path for scan line */}
          <clipPath id="body-clip">
            <path d={BODY_PATH} />
          </clipPath>
        </defs>

        {/* Body fill - semi-transparent holographic */}
        <path
          d={BODY_PATH}
          fill="url(#body-grad)"
          stroke="rgba(96,165,250,0.6)"
          strokeWidth="1"
          filter="url(#body-glow)"
        />

        {/* Inner body wireframe lines for depth */}
        {/* Torso center line */}
        <line x1="80" y1="52" x2="80" y2="130" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" strokeDasharray="3,3" />
        {/* Shoulder line */}
        <line x1="48" y1="70" x2="112" y2="70" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5" />
        {/* Hip line */}
        <line x1="60" y1="110" x2="100" y2="110" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5" />

        {/* Skeletal accent lines on limbs */}
        <line x1="50" y1="90" x2="44" y2="115" stroke="rgba(96,165,250,0.2)" strokeWidth="0.4" />
        <line x1="110" y1="90" x2="116" y2="115" stroke="rgba(96,165,250,0.2)" strokeWidth="0.4" />

        {/* Body outer glow edge */}
        <path
          d={BODY_PATH}
          fill="none"
          stroke="rgba(147,197,253,0.3)"
          strokeWidth="2"
        />

        {/* Impact zone highlight */}
        {showImpact && (
          <motion.path
            d={IMPACT_ZONE_PATH}
            fill="url(#impact-grad)"
            filter="url(#impact-glow)"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        {/* Scanning laser line */}
        <motion.rect
          x="40"
          y="0"
          width="160"
          height="2"
          fill="url(#scan-grad)"
          initial={{ y: 0, opacity: 0 }}
          animate={inView ? { y: [0, 190, 0], opacity: [0, 1, 0.8, 0] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Heart rate line on chest */}
        <motion.path
          d="M 60,80 L 64,80 L 66,73 L 68,87 L 70,76 L 72,80 L 100,80"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: [0, 1, 0], opacity: [0, 1, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </svg>

      {/* Scanning laser across full width */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none z-20"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8) 30%, rgba(34,211,238,1) 50%, rgba(6,182,212,0.8) 70%, transparent)' }}
        animate={inView ? { top: ['5%', '92%', '5%'], opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Impact pulse rings */}
      {showImpact && (
        <div
          className="absolute pointer-events-none"
          style={{ left: '50%', top: '65%', transform: 'translate(-50%, -50%)' }}
        >
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-emergency/60"
              style={{ inset: -(ring * 8) }}
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: ring * 0.3 }}
            />
          ))}
          <div className="w-3 h-3 rounded-full bg-emergency shadow-glow-red" />
        </div>
      )}

      {/* Floating biometric indicators */}
      {inView && (
        <>
          {/* Heart rate */}
          <motion.div
            className="absolute glass rounded-xl px-2.5 py-1.5"
            style={{ right: compact ? -10 : -20, top: '20%' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-[9px] text-white/40 uppercase tracking-wider">Heart Rate</p>
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emergency"
              />
              <span className="text-sm font-bold text-white">94 <span className="text-[9px] text-white/40">bpm</span></span>
            </div>
          </motion.div>

          {/* Movement */}
          <motion.div
            className="absolute glass rounded-xl px-2.5 py-1.5"
            style={{ left: compact ? -10 : -20, top: '35%' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-[9px] text-white/40 uppercase tracking-wider">Movement</p>
            <p className="text-sm font-bold text-electric">Detected</p>
          </motion.div>

          {/* Breathing */}
          <motion.div
            className="absolute glass rounded-xl px-2.5 py-1.5"
            style={{ right: compact ? -10 : -20, top: '50%' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-[9px] text-white/40 uppercase tracking-wider">Breathing</p>
            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-sm font-bold text-cyan"
            >
              18 rpm
            </motion.p>
          </motion.div>

          {/* Impact */}
          {showImpact && (
            <motion.div
              className="absolute glass rounded-xl px-2.5 py-1.5 border border-emergency/30"
              style={{ left: compact ? -10 : -20, top: '60%' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <p className="text-[9px] text-white/40 uppercase tracking-wider">Impact</p>
              <p className="text-sm font-bold text-emergency">High</p>
            </motion.div>
          )}
        </>
      )}

      {/* AI analysis particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-electric/60 pointer-events-none"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
