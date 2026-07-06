import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Zap, Activity, Cpu, Mic } from 'lucide-react';
import HumanVisualization from './HumanVisualization';

const SCAN_SEQUENCE = [
  { pct: 0, label: 'Initializing...' },
  { pct: 32, label: 'Motion anomaly detected' },
  { pct: 58, label: 'Impact force analyzed' },
  { pct: 81, label: 'No user response' },
  { pct: 97, label: 'Emergency Confirmed' },
];

const SCAN_ITEMS = [
  { icon: Zap, label: 'Sudden impact detected', color: '#ef4444' },
  { icon: Activity, label: 'Abnormal motion pattern', color: '#f97316' },
  { icon: Cpu, label: 'AI analyzing behavior', color: '#3b82f6' },
  { icon: Mic, label: 'Checking for response', color: '#06b6d4' },
];

export default function EmergencyDetection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [stepIdx, setStepIdx] = useState(0);
  const [targetPct, setTargetPct] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView || phase > 0) return;
    setPhase(1);
    let idx = 0;
    const run = () => {
      if (idx >= SCAN_SEQUENCE.length - 1) {
        setPhase(2);
        return;
      }
      idx++;
      setStepIdx(idx);
      const tgt = SCAN_SEQUENCE[idx].pct;
      setTargetPct(tgt);
      setTimeout(run, 700);
    };
    setTimeout(run, 400);
  }, [inView, phase]);

  // Smooth counter from prev to target
  useEffect(() => {
    let cur = displayPct;
    const inc = setInterval(() => {
      if (cur >= targetPct) { clearInterval(inc); return; }
      cur += 1;
      setDisplayPct(cur);
    }, 20);
    return () => clearInterval(inc);
  }, [targetPct]);

  const isEmergency = displayPct >= 71;

  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${isEmergency ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.4)'} 0%, transparent 70%)` }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] text-emergency/60 font-mono tracking-[0.3em] uppercase block mb-4">
              02 — Emergency Detection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              AI Never <span className="gradient-text">Sleeps.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              Analyzing your environment for any signs of danger in real-time, 24 hours a day.
            </p>

            <div className="space-y-3">
              {SCAN_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                  className="flex items-center gap-4 p-3.5 rounded-xl glass group hover:bg-white/8 transition-colors"
                >
                  <div className="p-2 rounded-lg" style={{ background: `${item.color}15` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm text-white/60 flex-1">{item.label}</span>
                  <motion.div
                    animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                    className="w-8 h-0.5 rounded-full origin-left"
                    style={{ background: item.color }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Human body + confidence display */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8"
          >
            {/* Human visualization */}
            <HumanVisualization showImpact={isEmergency} compact={false} />

            {/* Status + confidence */}
            <div className="text-center w-full max-w-xs">
              {/* Step status */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-white/50 mb-2"
                >
                  {SCAN_SEQUENCE[stepIdx]?.label}
                </motion.p>
              </AnimatePresence>

              {/* Confidence number */}
              <motion.div
                className="text-6xl font-bold tabular-nums mb-3"
                style={{
                  background: isEmergency
                    ? 'linear-gradient(135deg, #ef4444, #f97316)'
                    : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {displayPct}%
              </motion.div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${displayPct}%`,
                    background: isEmergency
                      ? 'linear-gradient(90deg, #ef4444, #f97316)'
                      : 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mt-4 flex items-center gap-2 justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-emergency"
                    />
                    <p className="text-emergency font-semibold">Possible Emergency Detected</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
