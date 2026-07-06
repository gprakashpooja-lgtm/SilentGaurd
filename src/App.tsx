import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import AIDashboard from './components/AIDashboard';
import EmergencyDetection from './components/EmergencyDetection';
import VerificationSection, { VerificationOverlay } from './components/VerificationScreen';
import EmergencyTimeline from './components/EmergencyTimeline';
import LiveMap from './components/LiveMap';
import AIIncidentSummary from './components/AIIncidentSummary';
import FamilyCenter from './components/FamilyCenter';
import FutureVision from './components/FutureVision';
import ClosingCTA, { Footer } from './components/ClosingCTA';
import {
  ParticleField,
  ScrollProgress,
  MouseGlow,
  AIScanningOverlay,
} from './components/BackgroundEffects';

type Stage = 'idle' | 'scanning' | 'verifying' | 'response' | 'safe';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<Stage>('idle');
  const loadRef = useRef(false);

  const handleEmergency = useCallback(() => setStage('scanning'), []);
  const handleScanComplete = useCallback(() => setStage('verifying'), []);
  const handleTimeout = useCallback(() => setStage('response'), []);
  const handleSafe = useCallback(() => {
    setStage('safe');
    setTimeout(() => setStage('idle'), 2500);
  }, []);

  return (
    <div className="min-h-screen bg-[#060610] relative overflow-x-hidden">
      <ParticleField />
      <MouseGlow />
      <ScrollProgress />

      <LoadingScreen isVisible={loading} />
      {loading && (
        <span
          style={{ display: 'none' }}
          ref={(el) => {
            if (el && !loadRef.current) {
              loadRef.current = true;
              setTimeout(() => setLoading(false), 2800);
            }
          }}
        />
      )}

      {/* Emergency overlays */}
      <AnimatePresence mode="wait">
        {stage === 'scanning' && (
          <AIScanningOverlay key="scanning" onComplete={handleScanComplete} />
        )}
        {stage === 'verifying' && (
          <VerificationOverlay key="verifying" onTimeout={handleTimeout} onSafe={handleSafe} />
        )}
      </AnimatePresence>

      {/* Safe flash */}
      <AnimatePresence>
        {stage === 'safe' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="glass-card rounded-3xl px-12 py-8 border border-safe/30 shadow-glow-green text-center">
              <p className="text-4xl font-bold text-safe">You're Safe</p>
              <p className="text-white/40 mt-2 text-sm">Alert cancelled successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response mode message */}
      <AnimatePresence>
        {stage === 'response' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full bg-emergency/90 backdrop-blur-xl border border-emergency/50 text-white text-sm font-medium shadow-glow-red flex items-center gap-2"
            onClick={() => setStage('idle')}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Emergency response triggered — Click to reset demo
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />

      <main>
        {/* Hero + How it works compressed into same visual flow */}
        <Hero onEmergency={handleEmergency} triggered={stage !== 'idle'} />
        <HowItWorks />
        <AIDashboard />
        <EmergencyDetection />
        <VerificationSection />
        <EmergencyTimeline />
        <LiveMap />
        <AIIncidentSummary />
        <FamilyCenter />
        <FutureVision />
        <ClosingCTA />
      </main>

      <Footer />
    </div>
  );
}
