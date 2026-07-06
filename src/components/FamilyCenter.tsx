import { motion } from 'framer-motion';
import { MapPin, Phone, MessageSquare, Plus } from 'lucide-react';

const contacts = [
  {
    name: 'Mom',
    status: 'Online',
    statusColor: '#10b981',
    lastSeen: 'Just now',
    location: 'Home',
    avatar: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Reid',
    status: '5 min ago',
    statusColor: '#3b82f6',
    lastSeen: '5 min ago',
    location: 'Office',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Best Friend',
    status: '2 min ago',
    statusColor: '#10b981',
    lastSeen: '2 min ago',
    location: 'Nearby',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Sheila',
    status: '1 min ago',
    statusColor: '#f97316',
    lastSeen: '1 min ago',
    location: 'En route',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=80&h=80&fit=crop&crop=face',
  },
];

export default function FamilyCenter() {
  return (
    <section className="py-24 px-4 relative">
      {/* Subtle blue glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contacts */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] text-cyan/60 font-mono tracking-[0.3em] uppercase block mb-4">
              07 — Family Safety Center
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Your Loved Ones.{' '}
              <span className="gradient-text-blue">Always Informed.</span>
            </h2>
            <p className="text-white/40 mb-8 text-base">
              Keep everyone in the loop with real-time updates and instant emergency alerts.
            </p>

            {/* Contact list */}
            <div className="space-y-3">
              {contacts.map((contact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, x: -30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4 p-4 glass-card rounded-2xl group"
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0f]"
                      style={{ background: contact.statusColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-xs text-white/40 truncate">{contact.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium" style={{ color: contact.statusColor }}>{contact.status}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{contact.lastSeen}</p>
                  </div>
                </motion.div>
              ))}

              {/* Add contact */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/15 hover:border-electric/40 text-white/30 hover:text-electric transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Emergency Contact
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Live update + quick actions */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Live update card */}
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-5">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emergency"
                />
                <span className="text-xs text-emergency font-medium tracking-wide uppercase">Live Update</span>
              </div>

              <p className="text-lg font-semibold text-white mb-1">Ambulance is 7 minutes away</p>

              {/* Mini route visualization */}
              <div className="relative h-24 my-4 rounded-xl bg-[#0c0c20] overflow-hidden">
                {/* Route path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <path d="M 20,60 C 80,55 150,30 200,20 C 230,12 260,8 280,10"
                    fill="none" stroke="url(#mini-route)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="20" cy="60" r="5" fill="#ef4444" />
                  <circle cx="280" cy="10" r="5" fill="#10b981" />
                  <motion.circle
                    r="5"
                    fill="#f97316"
                    animate={{
                      cx: [20, 150, 280],
                      cy: [60, 35, 10],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <defs>
                    <linearGradient id="mini-route" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-white/50 text-sm">ETA</span>
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl font-bold text-emergency"
                >
                  7 <span className="text-xl font-normal text-emergency/60">min</span>
                </motion.span>
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Phone, label: 'Call All', color: '#10b981' },
                  { icon: MapPin, label: 'Share Location', color: '#3b82f6' },
                  { icon: MessageSquare, label: 'Chat', color: '#06b6d4' },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 glass-card rounded-2xl"
                  >
                    <div className="p-2.5 rounded-xl" style={{ background: `${action.color}20` }}>
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <span className="text-[11px] text-white/60">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
