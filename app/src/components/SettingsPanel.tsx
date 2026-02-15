import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Moon, Sun, Monitor, Zap, ZapOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme, animationsEnabled, setAnimationsEnabled } = useTheme();
  const isLight = resolvedTheme === 'light';

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }

    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen]);

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={panelRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            id="settings-panel"
            className={`absolute bottom-16 right-0 w-72 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden ${
              isLight
                ? 'bg-card/95 border-border/70 shadow-black/10'
                : 'bg-card/90 border-white/10 shadow-black/50'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isLight ? 'border-border/60' : 'border-white/10'}`}>
              <h3 className={`${isLight ? 'text-foreground' : 'text-white'} font-semibold`}>Settings</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 focus-visible:ring-offset-white'
                    : 'text-white/60 hover:text-white focus-visible:ring-offset-charcoal'
                }`}
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme Selection */}
              <div>
                <label className={`text-sm mb-3 block ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 ${
                        theme === option.value
                          ? 'bg-electric/15 border-electric/60 text-electric'
                          : isLight
                            ? 'bg-background border-border/70 text-slate-600 hover:text-slate-950 hover:border-border'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      } ${isLight ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-charcoal'}`}
                    >
                      <option.icon className="h-5 w-5" />
                      <span className="text-xs">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Animations Toggle */}
              <div>
                <label className={`text-sm mb-3 block ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Animations</label>
                <motion.button
                  type="button"
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 ${
                    animationsEnabled
                      ? 'bg-electric/15 border-electric/60 text-electric'
                      : isLight
                        ? 'bg-background border-border/70 text-slate-600'
                        : 'bg-white/5 border-white/10 text-white/60'
                  } ${isLight ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-charcoal'}`}
                >
                  <div className="flex items-center gap-3">
                    {animationsEnabled ? (
                      <Zap className="h-5 w-5" />
                    ) : (
                      <ZapOff className="h-5 w-5" />
                    )}
                    <span className="text-sm">
                      {animationsEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                      animationsEnabled ? 'bg-electric' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                      animate={{ left: animationsEnabled ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>

                  {/* Brand Label */}
              <div className={`pt-4 border-t ${isLight ? 'border-border/60' : 'border-white/10'}`}>
                <p className={`text-xs text-center ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                  Gabriel's Portfolio
                  <br />
                  <span className="text-electric">@gabrielthedatawizard</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-4 rounded-full shadow-lg shadow-electric/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 ${
          isLight
            ? 'bg-electric hover:bg-electric/90 text-white focus-visible:ring-offset-white'
            : 'bg-electric hover:bg-electric/90 text-white focus-visible:ring-offset-charcoal'
        }`}
        aria-label="Open settings"
        aria-controls="settings-panel"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Settings className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default SettingsPanel;
