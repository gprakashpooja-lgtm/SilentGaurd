import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Smartphone, Waves } from 'lucide-react';

type Palette = {
  name: string;
  glow: string;
  accent: string;
  ring: string;
};

const PALETTES: Record<string, Palette> = {
  cyan: { name: 'Cyan', glow: '0, 229, 255', accent: '94, 234, 212', ring: '34, 211, 238' },
  amber: { name: 'Amber', glow: '251, 191, 36', accent: '253, 230, 138', ring: '245, 158, 11' },
  emerald: { name: 'Emerald', glow: '52, 211, 153', accent: '167, 243, 208', ring: '16, 185, 129' },
  magenta: { name: 'Magenta', glow: '236, 72, 153', accent: '244, 114, 182', ring: '219, 39, 119' },
};

type Wave = { x: number; y: number; r: number; maxR: number; life: number; speed: number; wobble: number };
type Particle = {
  x: number; y: number; vx: number; vy: number; life: number; decay: number; size: number; hue: string;
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawPhone(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, w: number, h: number, t: number, palette: Palette
) {
  ctx.save();
  ctx.translate(cx, cy);

  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 1.8);
  halo.addColorStop(0, `rgba(${palette.glow}, 0.35)`);
  halo.addColorStop(0.5, `rgba(${palette.glow}, 0.08)`);
  halo.addColorStop(1, `rgba(${palette.glow}, 0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(-w * 2, -h * 2, w * 4, h * 4);

  const r = 28;
  ctx.beginPath();
  roundRect(ctx, -w / 2, -h / 2, w, h, r);
  const body = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  body.addColorStop(0, '#1b2030');
  body.addColorStop(1, '#0a0d16');
  ctx.fillStyle = body;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(${palette.glow}, 0.55)`;
  ctx.stroke();

  const sw = w - 16;
  const sh = h - 16;
  ctx.beginPath();
  roundRect(ctx, -sw / 2, -sh / 2, sw, sh, r - 6);
  const screen = ctx.createLinearGradient(0, -sh / 2, 0, sh / 2);
  screen.addColorStop(0, `rgba(${palette.glow}, 0.22)`);
  screen.addColorStop(0.5, `rgba(${palette.accent}, 0.10)`);
  screen.addColorStop(1, `rgba(${palette.glow}, 0.18)`);
  ctx.fillStyle = screen;
  ctx.fill();

  ctx.beginPath();
  roundRect(ctx, -w * 0.18, -h / 2 + 6, w * 0.36, 10, 5);
  ctx.fillStyle = '#05070d';
  ctx.fill();

  const bars = 5;
  const bw = 6;
  const gap = 6;
  const totalW = bars * bw + (bars - 1) * gap;
  for (let i = 0; i < bars; i++) {
    const phase = (t * 0.004 + i * 0.5) % (Math.PI * 2);
    const amp = 0.5 + 0.5 * Math.sin(phase);
    const bh = 14 + amp * 30;
    const x = -totalW / 2 + i * (bw + gap);
    ctx.beginPath();
    roundRect(ctx, x, bh / 2 - 4, bw, bh, 3);
    ctx.fillStyle = `rgba(${palette.accent}, ${0.4 + amp * 0.6})`;
    ctx.fill();
  }

  const pulse = 0.5 + 0.5 * Math.sin(t * 0.006);
  ctx.beginPath();
  ctx.arc(0, -h / 2 - 2, 4 + pulse * 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${palette.glow}, ${0.6 + pulse * 0.4})`;
  ctx.shadowColor = `rgba(${palette.glow}, 0.9)`;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

export default function ElectronicWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ waves: Wave[]; particles: Particle[]; lastEmit: number; t: number }>({
    waves: [], particles: [], lastEmit: 0, t: 0,
  });
  const [paletteKey, setPaletteKey] = useState('cyan');
  const [intensity, setIntensity] = useState(1);
  const [paused, setPaused] = useState(false);

  const cfgRef = useRef({ paletteKey, intensity, paused });
  cfgRef.current = { paletteKey, intensity, paused };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = () => {
      const { paletteKey: pk, intensity: it, paused: pa } = cfgRef.current;
      const palette = PALETTES[pk];
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const state = stateRef.current;

      if (!pa) state.t += 16;

      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, '#0a0f1c');
      bg.addColorStop(1, '#05070d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = `rgba(${palette.glow}, 0.04)`;
      ctx.lineWidth = 1;
      const grid = 48;
      for (let x = 0; x < W; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const cx = W / 2;
      const cy = H / 2;
      const phoneW = Math.min(150, W * 0.22);
      const phoneH = phoneW * 2.05;

      if (!pa) {
        const interval = 520 / Math.max(0.2, it);
        if (state.t - state.lastEmit > interval) {
          state.waves.push({
            x: cx, y: cy, r: 0, maxR: Math.max(W, H) * 0.9, life: 1,
            speed: 1.6 + Math.random() * 0.8, wobble: Math.random() * Math.PI * 2,
          });
          if (state.waves.length > 40) state.waves.shift();
          state.lastEmit = state.t;
        }
        const pCount = Math.round(it * 2);
        for (let i = 0; i < pCount; i++) {
          if (Math.random() < 0.6) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.6 + Math.random() * 1.8;
            state.particles.push({
              x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              life: 1, decay: 0.004 + Math.random() * 0.006, size: 1 + Math.random() * 2.5,
              hue: Math.random() > 0.5 ? palette.glow : palette.accent,
            });
            if (state.particles.length > 300) state.particles.shift();
          }
        }
      }

      for (let i = state.waves.length - 1; i >= 0; i--) {
        const w = state.waves[i];
        if (!pa) { w.r += w.speed * it; w.life = 1 - w.r / w.maxR; }
        if (w.life <= 0) { state.waves.splice(i, 1); continue; }
        const alpha = w.life * 0.7;
        ctx.beginPath();
        const segs = 120;
        for (let s = 0; s <= segs; s++) {
          const a = (s / segs) * Math.PI * 2;
          const wob = Math.sin(a * 6 + w.wobble + state.t * 0.003) * 4;
          const rr = w.r + wob;
          const px = w.x + Math.cos(a) * rr;
          const py = w.y + Math.sin(a) * rr;
          if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.lineWidth = 2 + w.life * 2;
        ctx.strokeStyle = `rgba(${palette.ring}, ${alpha})`;
        ctx.shadowColor = `rgba(${palette.glow}, ${alpha * 0.8})`;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        if (!pa) { p.x += p.vx; p.y += p.vy; p.life -= p.decay; }
        if (p.life <= 0) { state.particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue}, ${p.life * 0.9})`;
        ctx.shadowColor = `rgba(${p.hue}, ${p.life})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      drawPhone(ctx, cx, cy, phoneW, phoneH, state.t, palette);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section id="electronic-waves" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5">
            <Radio className="w-3.5 h-3.5 text-electric" />
            <span className="text-xs font-medium text-white/70 tracking-wide">Signal Visualization</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Electronic Waves
            <span className="block text-gradient bg-gradient-to-r from-electric via-cyan to-electric bg-clip-text text-transparent">
              Around Your Phone
            </span>
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Every phone constantly emits electromagnetic radiation. Watch the invisible signal field
            come to life as concentric waves radiate outward in real time.
          </p>
        </motion.div>

        {/* Canvas + controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ background: '#05070d' }}
        >
          <canvas
            ref={canvasRef}
            className="block w-full"
            style={{ height: 'min(70vh, 560px)' }}
          />

          {/* Floating info badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
              <Smartphone className="w-3.5 h-3.5 text-cyan" />
              <span className="text-xs text-white/70 font-medium">Emitter Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
              <Waves className="w-3.5 h-3.5 text-electric" />
              <span className="text-xs text-white/70 font-medium">2.4 GHz · 5 GHz</span>
            </div>
          </div>

          {/* Controls bar */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3.5 items-center px-5 py-3.5 rounded-2xl flex-wrap justify-center"
            style={{
              background: 'rgba(13,18,30,0.78)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxWidth: 'calc(100% - 32px)',
            }}
          >
            <div className="flex gap-2">
              {Object.entries(PALETTES).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setPaletteKey(key)}
                  title={p.name}
                  className="transition-transform duration-150"
                  style={{
                    width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
                    border: paletteKey === key ? '2px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                    background: `linear-gradient(135deg, rgb(${p.glow}), rgb(${p.accent}))`,
                    transform: paletteKey === key ? 'scale(1.12)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            <div className="w-px h-7 bg-white/10" />

            <label className="flex items-center gap-2.5 text-white/70 text-xs">
              Intensity
              <input
                type="range" min={0.2} max={2.5} step={0.1} value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                style={{ width: 110, accentColor: `rgb(${PALETTES[paletteKey].glow})` }}
              />
              <span className="w-8 text-right text-white/40">{intensity.toFixed(1)}x</span>
            </label>

            <div className="w-px h-7 bg-white/10" />

            <button
              onClick={() => setPaused((p) => !p)}
              className="px-4 py-2 rounded-lg text-xs text-white/80 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Wave Rings', value: '40', unit: 'max' },
            { label: 'Particles', value: '300', unit: 'max' },
            { label: 'Refresh', value: '60', unit: 'fps' },
            { label: 'Palettes', value: '4', unit: 'themes' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label} · {stat.unit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
