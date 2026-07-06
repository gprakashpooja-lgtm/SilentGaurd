import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Shield } from 'lucide-react';

const navLinks = ['Home', 'Features', 'How It Works', 'Ecosystem', 'About'];

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const translateX = useTransform(x, [-50, 50], [-8, 8]);
  const translateY = useTransform(y, [-50, 50], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ translateX, translateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className={`mx-4 md:mx-8 rounded-2xl transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a14]/90 backdrop-blur-2xl border border-white/8 shadow-2xl'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-electric blur-md opacity-60" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-cyan flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-base font-semibold text-white tracking-tight">SilentGuard</span>
          </motion.div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="text-sm text-white/50 hover:text-white transition-colors duration-300 relative group"
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-electric to-cyan transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <MagneticButton className="relative px-5 py-2.5 rounded-xl text-sm font-medium text-white overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-electric to-cyan opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan to-electric opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -inset-1 bg-gradient-to-r from-electric to-cyan blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
            <span className="relative">Try Live Demo</span>
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
}
