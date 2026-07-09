import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import EmergencyDetection from './components/EmergencyDetection';
import HowItWorks from './components/HowItWorks';
import EmergencyTimeline from './components/EmergencyTimeline';
import AIDashboard from './components/AIDashboard';
import AIIncidentSummary from './components/AIIncidentSummary';
import LiveMap from './components/LiveMap';
import FamilyCenter from './components/FamilyCenter';
import FutureVision from './components/FutureVision';
import VerificationSection from './components/VerificationScreen';
import ClosingCTA, { Footer } from './components/ClosingCTA';
import { ParticleField, ScrollProgress, MouseGlow, AIScanningOverlay } from './components/BackgroundEffects';
import { VerificationOverlay } from './components/VerificationScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(t);
  }, []);

  const handleEmergency = () => {
    setTriggered(true);
    setScanning(true);
  };

  const handleScanComplete = () => {
    setScanning(false);
    setVerifying(true);
  };

  const handleVerifyTimeout = () => {
    setVerifying(false);
    // Emergency escalates — in a real app this dispatches help
  };

  const handleVerifySafe = () => {
    setVerifying(false);
    setTriggered(false);
  };

  return (
    <>
      <LoadingScreen isVisible={loading} />

      {/* Fixed background layers */}
      <ParticleField />
      <MouseGlow />
      <ScrollProgress />

      {/* Full-screen overlays */}
      <AnimatePresence>
        {scanning && <AIScanningOverlay onComplete={handleScanComplete} />}
      </AnimatePresence>
      <AnimatePresence>
        {verifying && <VerificationOverlay onTimeout={handleVerifyTimeout} onSafe={handleVerifySafe} />}
      </AnimatePresence>

      {/* Main site */}
      <div className="relative z-10">
        <Navigation />

        <main>
          <Hero onEmergency={handleEmergency} triggered={triggered} />
          <EmergencyDetection />
          <HowItWorks />
          <EmergencyTimeline />
          <AIDashboard />
          <AIIncidentSummary />
          <LiveMap />
          <FamilyCenter />
          <FutureVision />
          <VerificationSection />
        </main>

        <ClosingCTA />
        <Footer />
      </div>
    </>
  );
}
