import { motion } from 'framer-motion';
import { Watch, Car, Building, Glasses, Home, Plane, Heart, Cpu, CheckCircle } from 'lucide-react';

const integrations = [
  { icon: Watch, label: 'Smartwatch Integration', desc: 'Continuous vitals monitoring', available: true },
  { icon: Car, label: 'Connected Vehicles', desc: 'Automatic crash detection', available: true },
  { icon: Building, label: 'Hospital Network', desc: 'Direct ER connection', available: true },
  { icon: Glasses, label: 'Smart Glasses', desc: 'AR safety assistance', available: false },
  { icon: Home, label: 'Smart Home Protection', desc: 'Integrated home safety', available: true },
  { icon: Plane, label: 'Emergency Drones', desc: 'Rapid delivery response', available: false },
  { icon: Heart, label: 'Wearable Sensors', desc: 'Advanced biometric monitoring', available: false },
  { icon: Cpu, label: 'AI Risk Prediction', desc: 'Proactive danger forecasting', available: false },
];

export default function FutureVision() {
  return (
    <section id="about" className="py-24 px-4 relative">
      {/* Green gradient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-safe/30 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-[10px] text-safe/60 font-mono tracking-[0.3em] uppercase block mb-4">
            08 — Future Vision
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            A Safer Tomorrow{' '}
            <span className="gradient-text">With SilentGuard.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-base">
            Building an ecosystem that protects you everywhere, from your wrist to the road.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {integrations.map((item, i) => {
            const rowDir = Math.floor(i / 4) % 2 === 0 ? (i % 2 === 0 ? -40 : 40) : (i % 2 === 0 ? 40 : -40);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: rowDir, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                className={`relative glass-card rounded-2xl p-5 overflow-hidden group cursor-pointer ${!item.available ? 'opacity-50' : ''}`}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: item.available ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))' : 'none' }} />

                {/* Future vision tag */}
                {!item.available && (
                  <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] text-white/40">
                    Future
                  </div>
                )}

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    item.available
                      ? 'bg-gradient-to-br from-electric/80 to-cyan/80'
                      : 'bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </motion.div>

                <h3 className="text-sm font-semibold text-white mb-1">{item.label}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed">{item.desc}</p>

                {item.available && (
                  <div className="flex items-center gap-1 mt-3">
                    <CheckCircle className="w-3 h-3 text-safe" />
                    <span className="text-[10px] text-safe">Available</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
