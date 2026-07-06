import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function ClosingCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left phone silhouette glow */}
        <div className="absolute -left-20 bottom-0 w-80 h-[500px] opacity-30"
          style={{ background: 'radial-gradient(ellipse at left center, rgba(239,68,68,0.4) 0%, transparent 70%)' }} />
        {/* Right phone silhouette glow */}
        <div className="absolute -right-20 bottom-0 w-80 h-[500px] opacity-30"
          style={{ background: 'radial-gradient(ellipse at right center, rgba(16,185,129,0.4) 0%, transparent 70%)' }} />
        {/* Center glow */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-safe/30 to-transparent" />
      </div>

      {/* Green particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-safe/40"
          style={{ left: `${10 + i * 4.5}%`, bottom: 0 }}
          animate={{ y: [-Math.random() * 300 - 50], opacity: [0, 0.8, 0] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3, ease: 'easeOut' }}
        />
      ))}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-4">
            The best emergency
            <br />
            is the one detected{' '}
            <br />
            <span className="gradient-text">before it's too late.</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mt-8 mb-12"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-cyan flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-electric to-cyan blur-lg opacity-60" />
              <Shield className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="text-lg font-semibold text-white">SilentGuard</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/40 text-base"
          >
            Help Begins Before You Ask.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-electric to-cyan flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">SilentGuard</span>
        </div>
        <p className="text-xs text-white/25">© 2026 SilentGuard. AI Safety Intelligence Platform.</p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Contact', 'Blog'].map(l => (
            <a key={l} href="#" className="text-xs text-white/30 hover:text-white/70 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
