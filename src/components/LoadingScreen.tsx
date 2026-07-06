import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060610]"
        >
          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 1.5], opacity: [0, 0.4, 0.2] }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)' }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-4 relative z-10"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 rounded-full border border-electric/30 border-dashed"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center shadow-glow-blue"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-white tracking-tight">SilentGuard</p>
              <p className="text-sm text-white/40 mt-1">Initializing AI Safety Systems...</p>
            </motion.div>

            {/* Loading bar */}
            <motion.div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-gradient-to-r from-electric to-cyan rounded-full"
              />
            </motion.div>

            {/* Status text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-xs text-white/30 font-mono"
            >
              SYSTEM ONLINE
            </motion.div>
          </motion.div>

          {/* Corner accents */}
          {[
            'top-8 left-8 border-t-2 border-l-2',
            'top-8 right-8 border-t-2 border-r-2',
            'bottom-8 left-8 border-b-2 border-l-2',
            'bottom-8 right-8 border-b-2 border-r-2',
          ].map((classes, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className={`absolute ${classes} w-8 h-8 border-electric/50`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
