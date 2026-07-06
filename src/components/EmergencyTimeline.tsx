import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Bell, MapPin, Building, Car, Clock } from 'lucide-react';

const timelineItems = [
  { time: '10:24:15 PM', icon: AlertTriangle, label: 'AI detected unusual activity', color: '#3b82f6', side: 'left' },
  { time: '10:24:35 PM', icon: Shield, label: 'User verification failed', color: '#f97316', side: 'right' },
  { time: '10:24:36 PM', icon: Bell, label: 'Emergency contacts notified', color: '#3b82f6', side: 'left' },
  { time: '10:24:37 PM', icon: MapPin, label: 'Live location shared', color: '#10b981', side: 'right' },
  { time: '10:24:38 PM', icon: Building, label: 'Nearest hospital identified', color: '#ef4444', side: 'left' },
  { time: '10:24:00 PM', icon: Car, label: 'Ambulance dispatched', color: '#06b6d4', side: 'right' },
];

export default function EmergencyTimeline() {
  return (
    <section className="py-24 px-4 relative">
      {/* Light streak */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-0 right-0 h-px pointer-events-none origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-[10px] text-emergency/60 font-mono tracking-[0.3em] uppercase block mb-4">
              04 — Emergency Response
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Help is on <span className="gradient-text">the Way.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Our AI has alerted your contacts and the nearest emergency services. Help is coordinated automatically within seconds.
            </p>

            {/* ETA card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass-card rounded-2xl p-5 flex items-center gap-5"
            >
              <div className="p-3 rounded-xl bg-safe/20">
                <Clock className="w-6 h-6 text-safe" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/40">Estimated arrival</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5 items-end h-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 rounded-full bg-safe"
                        animate={{ height: ['40%', '100%', '40%'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-white">7 <span className="text-base font-normal text-white/60">min</span></span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: timeline */}
          <div className="relative">
            {/* Vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="absolute left-6 top-0 bottom-0 w-px origin-top"
              style={{ background: 'linear-gradient(180deg, #3b82f6, #10b981)' }}
            />

            <div className="space-y-5">
              {timelineItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-5 pl-16 relative group"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-[18px] w-4 h-4 rounded-full -translate-x-1/2 border-2 border-[#060610] shadow-lg"
                    style={{ background: item.color }}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ background: item.color }} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 flex items-center gap-4 p-4 rounded-xl glass-card group-hover:bg-white/8 transition-all">
                    <div className="p-2 rounded-lg" style={{ background: `${item.color}20` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{item.label}</p>
                    </div>
                    <span className="text-[10px] text-white/30 font-mono">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
