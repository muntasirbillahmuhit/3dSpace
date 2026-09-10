/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Settings, Info, RefreshCw, X, Rocket, Globe, Sliders, Check } from 'lucide-react';
import { SpaceCanvas } from './components/SpaceCanvas';
import { ZeroSpaceCanvas } from './components/ZeroSpaceCanvas';
import { CelestialDossier } from './components/CelestialDossier';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'solar' | 'zero'>('zero');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Celestial navigation and detail focus state
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);

  // Simulation controls state
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAsteroids, setShowAsteroids] = useState(true);
  const [showKuiperBelt, setShowKuiperBelt] = useState(true);
  const [showComet, setShowComet] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [rotationSpeed, setRotationSpeed] = useState(2);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetView = () => {
    setSelectedBodyId(null);
    window.dispatchEvent(new CustomEvent('reset-space-view'));
    setIsMenuOpen(false);
  };

  return (
    <main className="w-screen h-screen relative bg-[#010403] select-none overflow-hidden">
      <AnimatePresence mode="wait">
        {currentMode === 'solar' ? (
          <motion.div 
            key="solar" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0"
          >
            <SpaceCanvas 
              showOrbits={showOrbits} 
              showAsteroids={showAsteroids} 
              showKuiperBelt={showKuiperBelt}
              showComet={showComet}
              showLabels={showLabels}
              simSpeed={simSpeed} 
              rotationSpeed={rotationSpeed}
              selectedBodyId={selectedBodyId}
              onSelectBody={(id) => setSelectedBodyId(id)}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="zero" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0"
          >
            <ZeroSpaceCanvas />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Astronomical Dossier Drawer on the Right */}
      <CelestialDossier
        selectedId={selectedBodyId}
        onClose={() => setSelectedBodyId(null)}
        onSelect={(id) => setSelectedBodyId(id)}
      />
      
      {/* Upper right action menu with framer-motion expansion */}
      <div className="absolute top-5 right-5 z-20 flex flex-col items-end" ref={menuRef}>
        <motion.div
          layout
          initial={{ borderRadius: 9999 }}
          animate={{
            width: isMenuOpen ? 200 : 44,
            height: isMenuOpen ? 196 : 44,
            borderRadius: isMenuOpen ? 16 : 9999,
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className="bg-emerald-950/40 backdrop-blur-xl border border-emerald-400/30 shadow-[0_8px_32px_0_rgba(16,185,129,0.25)] overflow-hidden flex flex-col"
        >
          <AnimatePresence mode="wait">
            {!isMenuOpen ? (
              <motion.button
                id="menu-toggle-button"
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsMenuOpen(true)}
                className="w-11 h-11 min-h-[44px] flex items-center justify-center text-emerald-200/90 hover:text-white hover:bg-emerald-900/30 active:bg-emerald-800/40 transition-colors focus:outline-none cursor-pointer"
                aria-label="Options"
              >
                <MoreVertical className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(16,185,129,0.5)]" />
              </motion.button>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex flex-col w-full h-full p-2"
              >
                <div className="flex justify-between items-center px-2 py-1.5 mb-1 border-b border-emerald-400/20">
                  <span className="text-emerald-100 text-sm font-medium tracking-wide">Options</span>
                  <button 
                    id="menu-close-button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 -mr-1 rounded-full hover:bg-emerald-800/50 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {currentMode === 'solar' ? (
                  <button 
                    id="switch-mode-button"
                    onClick={() => { setCurrentMode('zero'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-2 py-2 mt-1 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Rocket className="w-4 h-4" /> Zero Space
                  </button>
                ) : (
                  <button 
                    id="switch-mode-button"
                    onClick={() => { setCurrentMode('solar'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-2 py-2 mt-1 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Globe className="w-4 h-4" /> Solar System
                  </button>
                )}
                <button 
                  id="menu-settings-button"
                  onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 px-2 py-2 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <button 
                  id="menu-reset-button"
                  onClick={handleResetView}
                  className="flex items-center gap-3 px-2 py-2 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset View
                </button>
                <button 
                  id="menu-about-button"
                  onClick={() => { setIsAboutOpen(true); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 px-2 py-2 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <Info className="w-4 h-4" /> About
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              id="settings-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-neutral-900/90 border border-emerald-500/30 rounded-2xl shadow-2xl p-5 text-emerald-100 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-base text-white">Simulation Settings</h3>
                </div>
                <button
                  id="close-settings-button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Orbit Lines Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-200">Orbit Lines</span>
                  <button
                    id="toggle-orbits-button"
                    onClick={() => setShowOrbits(!showOrbits)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      showOrbits ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showOrbits ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Asteroid Belt Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-200">Asteroid Belt</span>
                  <button
                    id="toggle-asteroids-button"
                    onClick={() => setShowAsteroids(!showAsteroids)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      showAsteroids ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showAsteroids ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Kuiper Belt Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-200">Kuiper Belt</span>
                  <button
                    id="toggle-kuiper-button"
                    onClick={() => setShowKuiperBelt(!showKuiperBelt)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      showKuiperBelt ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showKuiperBelt ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Halley's Comet Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-200">Halley&apos;s Comet (1P)</span>
                  <button
                    id="toggle-comet-button"
                    onClick={() => setShowComet(!showComet)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      showComet ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showComet ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 3D Planet Labels Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-200">3D Body Labels</span>
                  <button
                    id="toggle-labels-button"
                    onClick={() => setShowLabels(!showLabels)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      showLabels ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showLabels ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Simulation Speed */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-200">Orbital Speed</span>
                    <span className="text-xs font-mono text-emerald-400">{simSpeed}x</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1, 2, 4].map((speed) => (
                      <button
                        key={speed}
                        id={`speed-btn-${speed}`}
                        onClick={() => setSimSpeed(speed)}
                        className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                          simSpeed === speed
                            ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Axial Rotation Speed */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-200">Rotation Speed</span>
                    <span className="text-xs font-mono text-emerald-400">{rotationSpeed}x</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 5].map((speed) => (
                      <button
                        key={speed}
                        id={`rot-speed-btn-${speed}`}
                        onClick={() => setRotationSpeed(speed)}
                        className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                          rotationSpeed === speed
                            ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-emerald-500/20 flex justify-end">
                <button
                  id="done-settings-button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              id="about-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-neutral-900/90 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 text-neutral-200 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-base text-white">Solar System & Zero Space</h3>
                </div>
                <button
                  id="close-about-button"
                  onClick={() => setIsAboutOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
                <p>
                  An interactive 3D Solar System simulation featuring the Sun, all 8 major planets, and dwarf planet Pluto with its moon Charon, procedural surface textures, orbits, planetary rings, and asteroid belt, complemented by a Zero Space sandbox.
                </p>

                <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2">
                  <div className="font-semibold text-emerald-300 text-xs uppercase tracking-wider">Navigation Controls</div>
                  <ul className="space-y-1 text-neutral-400">
                    <li>• <span className="text-neutral-200 font-medium">Orbit / Rotate:</span> Left click and drag</li>
                    <li>• <span className="text-neutral-200 font-medium">Pan:</span> Right click and drag</li>
                    <li>• <span className="text-neutral-200 font-medium">Zoom:</span> Scroll mouse wheel</li>
                    <li>• <span className="text-neutral-200 font-medium">Zero Space Glide:</span> Click anywhere on the ground plane</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-emerald-500/20 flex justify-end">
                <button
                  id="dismiss-about-button"
                  onClick={() => setIsAboutOpen(false)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}


