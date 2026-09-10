/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Settings, Info, RefreshCw, X, Rocket, Globe } from 'lucide-react';
import { SpaceCanvas } from './components/SpaceCanvas';
import { ZeroSpaceCanvas } from './components/ZeroSpaceCanvas';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'solar' | 'zero'>('solar');
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

  return (
    <main className="w-screen h-screen relative bg-[#010403] select-none">
      <AnimatePresence mode="wait">
        {currentMode === 'solar' ? (
          <motion.div 
            key="solar" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0"
          >
            <SpaceCanvas />
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
          className="bg-emerald-950/20 backdrop-blur-xl border border-emerald-400/30 shadow-[0_8px_32px_0_rgba(16,185,129,0.25)] overflow-hidden flex flex-col"
        >
          <AnimatePresence mode="wait">
            {!isMenuOpen ? (
              <motion.button
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
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 -mr-1 rounded-full hover:bg-emerald-800/50 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {currentMode === 'solar' ? (
                  <button 
                    onClick={() => { setCurrentMode('zero'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-2 py-2 mt-1 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Rocket className="w-4 h-4" /> Zero Space
                  </button>
                ) : (
                  <button 
                    onClick={() => { setCurrentMode('solar'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-2 py-2 mt-1 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Globe className="w-4 h-4" /> Solar System
                  </button>
                )}
                <button className="flex items-center gap-3 px-2 py-2 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <button className="flex items-center gap-3 px-2 py-2 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer">
                  <RefreshCw className="w-4 h-4" /> Reset View
                </button>
                <button className="flex items-center gap-3 px-2 py-2 text-sm text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors text-left cursor-pointer">
                  <Info className="w-4 h-4" /> About
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}


