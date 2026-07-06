import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Share2, Clock, CheckCircle, Loader } from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import HumanVisualization from './HumanVisualization';

function AnimatedBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useAnimatedCounter(value, 1800, inView);
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
          className="font-mono font-semibold"
          style={{ color }}
        >
          {count}%
        </motion.span>
      </div>
      <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.8, delay, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

const REPORT_FIELDS = [
  { label: 'Incident Type', value: 'Possible Fall Detected', color: '#ef4444' },
  { label: 'Impact Level', value: 'High Impact Recorded', color: '#f97316' },
  { label: 'User Response', value: 'No User Response', color: '#f97316' },
  { label: 'Location Shared', value: 'Live Feed Active', color: '#10b981' },
  { label: 'Status', value: 'Emergency Protocol Activated', color: '#ef4444' },
];

export default function AIIncidentSummary() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [generating, setGenerating] = useState(true);
  const confidence = useAnimatedCounter(98, 2200, inView);

  // Simulate "generating" state
  useState(() => {
    if (inView) setTimeout(() => setGenerating(false), 2500);
  });

  return (
    <section className="py-24 px-4 relative">
      {/* Glow */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] text-emergency/60 font-mono tracking-[0.3em] uppercase block mb-4">
              06 — AI Incident Summary
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              AI Generated <span className="gradient-text">Report.</span>
            </h2>
            <p className="text-white/40 mb-8 text-base">Complete analysis of the incident. Instantly generated.</p>

            <div className="space-y-4">
              <AnimatedBar label="Detection Confidence" value={98} color="#ef4444" delay={0.2} />
              <AnimatedBar label="Impact Severity" value={94} color="#f97316" delay={0.4} />
              <AnimatedBar label="Location Accuracy" value={100} color="#10b981" delay={0.6} />
              <AnimatedBar label="AI Model Certainty" value={94} color="#3b82f6" delay={0.8} />
            </div>
          </motion.div>

          {/* Right: Report + Human viz */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emergency/50 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-emergency/8 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">AI Incident Report</p>
                  <h3 className="text-lg font-semibold text-emergency">Possible Fall Detected</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emergency/15 border border-emergency/25">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emergency"
                  />
                  <AnimatePresence mode="wait">
                    {generating ? (
                      <motion.span key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-emergency flex items-center gap-1">
                        <Loader className="w-3 h-3 animate-spin" /> Generating
                      </motion.span>
                    ) : (
                      <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emergency">ACTIVE</motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Two-column: human viz + report data */}
              <div className="flex items-start gap-6 mb-6 relative z-10">
                {/* Human visualization */}
                <div className="shrink-0 flex flex-col items-center">
                  <HumanVisualization showImpact={true} compact={true} />
                  <p className="text-[9px] text-white/30 mt-2 text-center">Injury Location</p>
                </div>

                {/* Report fields */}
                <div className="flex-1 space-y-3 pt-2">
                  {REPORT_FIELDS.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="text-[10px] text-white/30">{f.label}</span>
                      <span className="text-xs font-medium" style={{ color: f.color }}>{f.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Confidence display */}
              <motion.div
                className="flex items-center justify-between p-4 rounded-xl bg-white/4 mb-5 relative z-10"
                animate={inView ? { borderColor: ['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.2)'] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <div>
                  <p className="text-[10px] text-white/30 mb-1">AI Confidence Level</p>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-white tabular-nums">{confidence}<span className="text-xl text-white/40">%</span></span>
                    {confidence >= 98 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                        <CheckCircle className="w-5 h-5 text-safe" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-emergency font-medium">Very High</span>
                  {/* Mini confidence ring */}
                  <svg width="44" height="44" className="-rotate-90">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <motion.circle
                      cx="22" cy="22" r="18"
                      fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 18}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                      animate={inView ? { strokeDashoffset: 2 * Math.PI * 18 * (1 - 0.98) } : {}}
                      transition={{ duration: 2.2, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3 relative z-10">
                <button className="flex-1 glass-button py-3 rounded-xl flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />Share Report
                </button>
                <button className="flex-1 glass-button py-3 rounded-xl flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <Clock className="w-4 h-4" />View Timeline
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
