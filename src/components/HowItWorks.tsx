import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, ShieldCheck, Bell, Car } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Eye,
    title: 'Detect',
    desc: 'AI detects unusual activity across all sensors',
    color: '#3b82f6',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Verify',
    desc: 'Cross-checks sensors & biometric data',
    color: '#06b6d4',
  },
  {
    num: '03',
    icon: Bell,
    title: 'Alert',
    desc: 'Instant alerts sent to contacts immediately',
    color: '#f97316',
  },
  {
    num: '04',
    icon: Car,
    title: 'Respond',
    desc: 'Help is on the way within seconds',
    color: '#10b981',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Subtle separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] text-electric/60 font-mono tracking-[0.3em] uppercase block mb-3">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            From Detection to <span className="gradient-text-blue">Response</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #f97316, #10b981)' }}>
            <motion.div
              className="absolute inset-0 origin-left"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #f97316, #10b981)' }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 z-10 glass-card"
                  style={{ border: `1px solid ${step.color}40` }}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${step.color}20`, boxShadow: `0 0 20px ${step.color}40` }} />
                  {/* Number tag */}
                  <div
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </div>
                  <step.icon className="w-6 h-6 relative z-10" style={{ color: step.color }} />
                </motion.div>

                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>

                {/* Bottom indicator */}
                <motion.div
                  className="mt-4 w-8 h-0.5 rounded-full"
                  animate={{ scaleX: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  style={{ background: step.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
