import { useEffect, useRef, useState } from "react";

type Palette = {
  name: string;
  glow: string;
  accent: string;
  ring: string;
};

const PALETTES: Record<string, Palette> = {
  cyan: { name: "Cyan", glow: "0, 229, 255", accent: "94, 234, 212", ring: "34, 211, 238" },
  amber: { name: "Amber", glow: "251, 191, 36", accent: "253, 230, 138", ring: "245, 158, 11" },
  emerald: { name: "Emerald", glow: "52, 211, 153", accent: "167, 243, 208", ring: "16, 185, 129" },
  magenta: { name: "Magenta", glow: "236, 72, 153", accent: "244, 114, 182", ring: "219, 39, 119" },
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
  body.addColorStop(0, "#1b2030");
  body.addColorStop(1, "#0a0d16");
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
  ctx.fillStyle = "#05070d";
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

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ waves: Wave[]; particles: Particle[]; lastEmit: number; t: number }>({
    waves: [], particles: [], lastEmit: 0, t: 0,
  });
  const [paletteKey, setPaletteKey] = useState("cyan");
  const [intensity, setIntensity] = useState(1);
  const [paused, setPaused] = useState(false);

  const cfgRef = useRef({ paletteKey, intensity, paused });
  cfgRef.current = { paletteKey, intensity, paused };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = () => {
      const { paletteKey: pk, intensity: it, paused: pa } = cfgRef.current;
      const palette = PALETTES[pk];
      const W = window.innerWidth;
      const H = window.innerHeight;
      const state = stateRef.current;

      if (!pa) state.t += 16;

      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#0a0f1c");
      bg.addColorStop(1, "#05070d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = `rgba(${palette.glow}, 0.04)`;
      ctx.lineWidth = 1;
      const grid = 48;
      for (let x = 0; x < W; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const cx = W / 2;
      const cy = H / 2;
      const phoneW = Math.min(180, W * 0.22);
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

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      <div style={{ position: "absolute", top: 28, left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
        <h1 style={{ color: "#e6edf6", fontSize: 22, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
          Electronic Waves
        </h1>
        <p style={{ color: "rgba(230,237,246,0.5)", fontSize: 13, marginTop: 6, letterSpacing: 1 }}>
          Signal radiation around a phone
        </p>
      </div>

      <div
        style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 14, alignItems: "center", padding: "14px 20px",
          background: "rgba(13,18,30,0.72)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", flexWrap: "wrap",
          justifyContent: "center", maxWidth: "calc(100vw - 32px)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(PALETTES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPaletteKey(key)}
              title={p.name}
              style={{
                width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                border: paletteKey === key ? "2px solid #fff" : "2px solid rgba(255,255,255,0.15)",
                background: `linear-gradient(135deg, rgb(${p.glow}), rgb(${p.accent}))`,
                transition: "transform 0.15s ease",
                transform: paletteKey === key ? "scale(1.12)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.12)" }} />

        <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#c9d3e2", fontSize: 13 }}>
          Intensity
          <input
            type="range" min={0.2} max={2.5} step={0.1} value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            style={{ width: 120, accentColor: `rgb(${PALETTES[paletteKey].glow})` }}
          />
          <span style={{ width: 32, textAlign: "right", color: "#8a96a8", fontSize: 12 }}>
            {intensity.toFixed(1)}x
          </span>
        </label>

        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.12)" }} />

        <button
          onClick={() => setPaused((p) => !p)}
          style={{
            padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)", color: "#e6edf6", fontSize: 13, cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
