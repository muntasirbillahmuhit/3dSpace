import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Orbit, 
  Thermometer, 
  Clock, 
  Compass, 
  Wind, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Sparkles,
  Layers,
  RotateCw
} from 'lucide-react';
import { SOLAR_SYSTEM_PLANETS, SUN_DATA, COMET_DATA, PlanetData, CelestialInfo } from './solarSystemData';

interface CelestialDossierProps {
  selectedId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const CelestialDossier: React.FC<CelestialDossierProps> = ({
  selectedId,
  onClose,
  onSelect,
}) => {
  if (!selectedId) return null;

  // Retrieve current celestial body data
  const allBodies = [SUN_DATA, ...SOLAR_SYSTEM_PLANETS, COMET_DATA];
  const currentIndex = allBodies.findIndex((b) => b.id === selectedId);
  const currentBody = allBodies[currentIndex] || SOLAR_SYSTEM_PLANETS[0];
  const info: CelestialInfo = currentBody.info;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allBodies.length) % allBodies.length;
    onSelect(allBodies[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allBodies.length;
    onSelect(allBodies[nextIdx].id);
  };

  return (
    <AnimatePresence>
      <motion.aside
        id="celestial-dossier-panel"
        initial={{ opacity: 0, x: -30, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -30, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed top-5 left-5 z-30 w-[340px] sm:w-[380px] max-h-[calc(100vh-40px)] flex flex-col bg-neutral-950/85 backdrop-blur-2xl border border-emerald-500/25 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] text-neutral-200 overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="relative p-5 pb-4 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/60 to-transparent">
          {/* Subtle colored glow bar representing the body's hue */}
          <div 
            className="absolute top-0 left-0 right-0 h-1" 
            style={{ backgroundColor: currentBody.color }}
          />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20" 
                  style={{ backgroundColor: currentBody.color }}
                />
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  {info.type}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {currentBody.name}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 italic">
                "{info.tagline}"
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="dossier-prev-btn"
                onClick={handlePrev}
                title="Previous celestial body"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="dossier-next-btn"
                onClick={handleNext}
                title="Next celestial body"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                id="dossier-close-btn"
                onClick={onClose}
                title="Close dossier"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="overflow-y-auto p-5 space-y-4 text-xs scrollbar-thin scrollbar-thumb-neutral-800">
          {/* Summary Paragraph */}
          <p className="text-neutral-300 leading-relaxed bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/60">
            {info.summary}
          </p>

          {/* Key Physics Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Diameter</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {info.diameterKm}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Orbit className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Distance</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {info.distanceFromSun}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Orbit Period</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {info.orbitalPeriod}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Day Length</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {info.dayLength}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Temperature</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {info.temperature}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Gravity</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {info.gravity}
              </div>
            </div>
          </div>

          {/* Atmosphere Info */}
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-300">
                Atmosphere & Envelope
              </span>
            </div>
            <p className="text-neutral-300 text-xs leading-relaxed">
              {info.atmosphere}
            </p>
          </div>

          {/* Notable Surface & Planetary Landmarks */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] uppercase font-mono tracking-wider text-emerald-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Notable Landmarks & Phenomena</span>
            </div>
            <ul className="space-y-1.5">
              {info.notableFeatures.map((feat, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-2 text-xs text-neutral-300 bg-neutral-900/40 px-2.5 py-1.5 rounded-lg border border-neutral-800/40"
                >
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Moons System Count (if applicable) */}
          {'moons' in currentBody && Array.isArray((currentBody as PlanetData).moons) && (currentBody as PlanetData).moons!.length > 0 && (
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-300">
                  Visible Satellite Moons
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {(currentBody as PlanetData).moons!.length} tracked
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(currentBody as PlanetData).moons!.map((m, mIdx) => (
                  <span 
                    key={mIdx}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-800/90 text-neutral-200 text-[11px]"
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: m.color }}
                    />
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Tracking Status */}
        <div className="p-3 bg-neutral-900/80 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Locked Camera Orbit
          </span>
          <button
            id="dossier-overview-btn"
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Full Overview
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
