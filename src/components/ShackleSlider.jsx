import React, { useRef, useState, useEffect, useCallback } from 'react';
import soundEngine from '../engine/audio';

export default function ShackleSlider({
  onUnlock,
  onProgressUpdate,
  isUnlocked = false
}) {
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // Track which notch audio ticks have fired
  const notchRef = useRef({ n25: false, n50: false, n75: false });

  const getTrackMetrics = useCallback(() => {
    if (!trackRef.current || !handleRef.current) return { maxDist: 200 };
    const trackWidth = trackRef.current.clientWidth;
    const handleWidth = handleRef.current.clientWidth;
    const padding = 8; // margins
    return { maxDist: Math.max(10, trackWidth - handleWidth - padding) };
  }, []);

  const updateVisualProgress = useCallback(
    (fraction) => {
      const clamped = Math.min(1, Math.max(0, fraction));
      setDragProgress(clamped);
      if (onProgressUpdate) {
        onProgressUpdate(clamped);
      }

      // Audio notch thresholds
      if (clamped >= 0.25 && !notchRef.current.n25) {
        soundEngine.playDragNotch(1);
        notchRef.current.n25 = true;
      } else if (clamped < 0.25) {
        notchRef.current.n25 = false;
      }

      if (clamped >= 0.5 && !notchRef.current.n50) {
        soundEngine.playDragNotch(2);
        notchRef.current.n50 = true;
      } else if (clamped < 0.5) {
        notchRef.current.n50 = false;
      }

      if (clamped >= 0.75 && !notchRef.current.n75) {
        soundEngine.playDragNotch(3);
        notchRef.current.n75 = true;
      } else if (clamped < 0.75) {
        notchRef.current.n75 = false;
      }
    },
    [onProgressUpdate]
  );

  const handlePointerDown = (e) => {
    if (isUnlocked) return;
    setIsDragging(true);
    setStartX(e.clientX);
    soundEngine.playTick(440, 0.015);
    if (handleRef.current && e.target) {
      handleRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isUnlocked) return;
    const delta = e.clientX - startX;
    const { maxDist } = getTrackMetrics();
    const clamped = Math.max(0, Math.min(delta, maxDist));
    setCurrentX(clamped);
    updateVisualProgress(clamped / maxDist);
  };

  const triggerUnlockExecution = useCallback(() => {
    const { maxDist } = getTrackMetrics();
    setCurrentX(maxDist);
    updateVisualProgress(1);

    soundEngine.playUnlockPop();
    setTimeout(() => {
      soundEngine.playResolutionChord();
    }, 100);

    if (onUnlock) {
      onUnlock();
    }
  }, [getTrackMetrics, updateVisualProgress, onUnlock]);

  const handlePointerUp = (e) => {
    if (!isDragging || isUnlocked) return;
    setIsDragging(false);
    if (handleRef.current) {
      try {
        handleRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    const { maxDist } = getTrackMetrics();
    // 75% threshold
    if (currentX >= maxDist * 0.75) {
      triggerUnlockExecution();
    } else {
      // Spring Rebound to 0
      soundEngine.playThud();
      setCurrentX(0);
      updateVisualProgress(0);
    }
  };

  // Sandbox simulation helpers
  const simulateTick = (pct) => {
    if (isUnlocked) return;
    const { maxDist } = getTrackMetrics();
    const target = maxDist * pct;
    setCurrentX(target);
    updateVisualProgress(pct);

    setTimeout(() => {
      if (!isUnlocked) {
        soundEngine.playThud();
        setCurrentX(0);
        updateVisualProgress(0);
      }
    }, 600);
  };

  const pct = Math.round(dragProgress * 100);

  return (
    <div className="w-full select-none">
      {/* Milestone Notch Labels */}
      <div className="flex justify-between font-mono-ledger text-[11px] text-[#88726c] mb-2 px-1">
        <span>0% Locked</span>
        <span>25% Soften</span>
        <span>50% Listen</span>
        <span>75% Pivot</span>
        <span className="text-[#94452c] font-semibold">100% Release</span>
      </div>

      {/* Tactile Track */}
      <div
        ref={trackRef}
        className="relative w-full h-16 bg-[#ebe8e2] rounded-full overflow-hidden p-1 shadow-[inset_0_2px_4px_rgba(36,32,30,0.1)] flex items-center cursor-pointer touch-none"
      >
        {/* Progress Fill Wash */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#ffdbd0]/70 rounded-full transition-all duration-75 pointer-events-none"
          style={{ width: `${pct}%` }}
        />

        {/* Milestone Vertical Notches */}
        <div className="absolute left-[25%] top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-[#dbc1ba] pointer-events-none flex items-center justify-center">
          <span className="w-0.5 h-3 bg-white" />
        </div>
        <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-[#dbc1ba] pointer-events-none flex items-center justify-center">
          <span className="w-0.5 h-3 bg-white" />
        </div>
        <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-[#94452c]/40 pointer-events-none flex items-center justify-center">
          <span className="w-0.5 h-3 bg-[#94452c]" />
        </div>

        {/* Sliding Brass & Charcoal Handle */}
        <div
          ref={handleRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute left-1 top-1 bottom-1 w-28 sm:w-32 bg-[#24201E] rounded-full shadow-lg flex items-center justify-center gap-1.5 text-[#f6dfc0] cursor-grab active:cursor-grabbing select-none z-10 transition-transform ${
            isDragging ? 'duration-0' : 'duration-300 ease-out'
          }`}
          style={{
            transform: `translateX(${currentX}px)`
          }}
        >
          <span className="material-symbols-outlined text-[18px] text-[#f6dfc0] animate-pulse">
            drag_indicator
          </span>
          <span className="font-body-sans text-[12px] font-semibold text-[#f6dfc0] tracking-tight whitespace-nowrap">
            {pct >= 75 ? 'Release!' : 'Slide Right'}
          </span>
          <span className="material-symbols-outlined text-[16px] text-[#f6dfc0]">
            chevron_right
          </span>
        </div>
      </div>

      {/* Dynamic Physical Hint & Percentage */}
      <div className="flex items-center justify-between text-[#88726c] font-mono-ledger text-[11px] mt-2.5 px-1">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">tune</span>
          Spring Resistance: Calibrated 1.4kg
        </span>
        <span className="text-[#94452c] font-semibold">
          {pct}% Drawn
        </span>
      </div>

      {/* Sandbox Testing Mode Controls */}
      <div className="mt-4 pt-3 bg-white/70 rounded-lg p-2.5 flex items-center justify-between flex-wrap gap-2 border border-[#e8e2d5]">
        <span className="font-mono-ledger text-[11px] text-[#55433e]">
          Sandbox Testing:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => simulateTick(0.25)}
            className="px-2.5 py-1 rounded bg-[#f0eee8] text-[#1c1c18] font-mono-ledger text-[10px] hover:bg-[#ebe8e2] transition-colors"
          >
            25% Tick
          </button>
          <button
            type="button"
            onClick={() => simulateTick(0.5)}
            className="px-2.5 py-1 rounded bg-[#f0eee8] text-[#1c1c18] font-mono-ledger text-[10px] hover:bg-[#ebe8e2] transition-colors"
          >
            50% Tick
          </button>
          <button
            type="button"
            onClick={triggerUnlockExecution}
            className="px-3 py-1 rounded bg-[#94452c] text-white font-mono-ledger text-[10px] font-semibold shadow-xs hover:bg-[#793019] transition-all flex items-center gap-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
            Simulate Full Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
