"use client";

import { useState } from "react";
import { useTerminalTheme, type TerminalThemeType } from "./theme-provider";
import { Settings, Sliders, Volume2, VolumeX, Eye, EyeOff, Monitor } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function RetroSettings() {
  const [open, setOpen] = useState(false);
  const {
    theme,
    setTheme,
    scanlines,
    setScanlines,
    flicker,
    setFlicker,
    sound,
    setSound,
    matrix,
    setMatrix,
    playClick
  } = useTerminalTheme();

  const handleToggle = (setter: (v: boolean) => void, val: boolean) => {
    playClick();
    setter(!val);
  };

  const themesList: { id: TerminalThemeType; name: string; color: string }[] = [
    { id: "green", name: "PHOSPHOR", color: "#22c55e" },
    { id: "amber", name: "AMBER", color: "#f59e0b" },
    { id: "cyan", name: "CYAN", color: "#06b6d4" },
    { id: "red", name: "V-BOY", color: "#ef4444" },
    { id: "purple", name: "SYNTH", color: "#a855f7" }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono">
      {/* Settings toggle button */}
      <button
        onClick={() => {
          playClick();
          setOpen(!open);
        }}
        className="flex items-center justify-center h-9 w-9 border border-primary bg-card/90 text-primary shadow-[0_0_10px_var(--primary-glow-weak)] hover:shadow-[0_0_15px_var(--primary-glow)] transition-all hover:bg-primary/10 rounded-none cursor-pointer"
        title="Open Bios Settings"
      >
        <Settings className={`h-4.5 w-4.5 ${open ? 'animate-spin' : ''}`} />
      </button>

      {/* Floating Card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-12 right-0 w-80 border border-primary bg-card/95 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_20px_var(--primary-glow-weak)]"
          >
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-primary px-3 py-1.5 bg-primary/10 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  [bios_setup.cfg]
                </span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setOpen(false);
                }}
                className="text-[10px] text-primary hover:text-foreground hover:bg-primary/20 px-1 border border-transparent hover:border-primary/30"
              >
                [X]
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 text-xs text-foreground">
              {/* Theme selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
                  $ select --color
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {themesList.map((t) => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center justify-between p-1.5 border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/10 text-muted-foreground/40 hover:border-border/80 hover:text-foreground"
                        }`}
                      >
                        <span className="text-[10px] tracking-wide font-bold">{t.name}</span>
                        <span
                          className="h-2 w-2 border"
                          style={{
                            backgroundColor: t.color,
                            borderColor: isSelected ? "var(--primary)" : "transparent"
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 border-t border-border/50 pt-3">
                <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block mb-1">
                  $ configure --screen-effects
                </label>

                {/* Scanlines toggle */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground/60">
                    <Monitor className="h-3.5 w-3.5" />
                    CRT Scanlines
                  </span>
                  <button
                    onClick={() => handleToggle(setScanlines, scanlines)}
                    className={`px-2 py-0.5 border text-[10px] font-bold uppercase transition-all ${
                      scanlines
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground/30 hover:border-border/80"
                    }`}
                  >
                    {scanlines ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                {/* Flicker toggle */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground/60">
                    <Sliders className="h-3.5 w-3.5" />
                    Monitor Flicker
                  </span>
                  <button
                    onClick={() => handleToggle(setFlicker, flicker)}
                    className={`px-2 py-0.5 border text-[10px] font-bold uppercase transition-all ${
                      flicker
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground/30 hover:border-border/80"
                    }`}
                  >
                    {flicker ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                {/* Sound FX toggle */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground/60">
                    {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    Retro Sounds
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      setSound(!sound);
                    }}
                    className={`px-2 py-0.5 border text-[10px] font-bold uppercase transition-all ${
                      sound
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground/30 hover:border-border/80"
                    }`}
                  >
                    {sound ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                {/* Matrix Rain toggle */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground/60">
                    {matrix ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    Falling Code
                  </span>
                  <button
                    onClick={() => handleToggle(setMatrix, matrix)}
                    className={`px-2 py-0.5 border text-[10px] font-bold uppercase transition-all ${
                      matrix
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground/30 hover:border-border/80"
                    }`}
                  >
                    {matrix ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-3 py-1.5 bg-muted/15 flex justify-between text-[9px] text-muted-foreground/30 select-none">
              <span>SYSTEM: OK</span>
              <span>VER: 1.0.8</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
