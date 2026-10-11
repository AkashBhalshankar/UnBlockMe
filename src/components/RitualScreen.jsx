import React, { useState, useRef, useEffect, useMemo } from 'react';
import BrandLogo from './BrandLogo';
import ShackleSlider from './ShackleSlider';
import soundEngine from '../engine/audio';
import { getLetterStructure } from '../engine/grammarMatrix';

export default function RitualScreen({
  letterData,
  onAcceptTruce,
  onCounterOffer,
  onSaveKeepsake
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [blurValue, setBlurValue] = useState(18); // 18px down to 0px
  const [opacityValue, setOpacityValue] = useState(0.35); // 0.35 up to 1
  const [resistancePct, setResistancePct] = useState(100);
  const [soundActive, setSoundActive] = useState(!soundEngine.isMuted());
  const [selectedRitualTab, setSelectedRitualTab] = useState(letterData?.ritual || 'shackle');

  // Canvas Sparks
  const canvasRef = useRef(null);

  const recipient = letterData?.recipient || 'Alex';
  const sender = letterData?.sender || 'Jordan';
  const relationship = letterData?.relationship || 'situationship';
  const gravity = letterData?.gravity || 3;
  const tokens = letterData?.tokens || {
    trigger: 'I ghosted when things got real',
    fault: 'let my defensiveness do the talking',
    remedy: 'dinner at your favorite spot, my bill, no excuses'
  };

  const letterStructure = useMemo(() => {
    return getLetterStructure(relationship, gravity, tokens);
  }, [relationship, gravity, tokens]);

  // Handle slider progress
  const handleProgress = (progressFraction) => {
    if (isUnlocked) return;
    const currentBlur = (18 * (1 - progressFraction)).toFixed(1);
    const currentOpacity = (0.35 + progressFraction * 0.65).toFixed(2);
    setBlurValue(parseFloat(currentBlur));
    setOpacityValue(parseFloat(currentOpacity));
    setResistancePct(Math.max(0, Math.round((1 - progressFraction) * 100)));
  };

  const handleUnlock = () => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setBlurValue(0);
    setOpacityValue(1);
    setResistancePct(0);
    triggerSparks();
  };

  const toggleSound = () => {
    const isMuted = soundEngine.toggleMute();
    setSoundActive(!isMuted);
    if (!isMuted) {
      soundEngine.playTick(580, 0.02);
    }
  };

  // Canvas Sparks Effect
  const triggerSparks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const particles = [];
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.7) * 10,
        size: Math.random() * 4 + 2,
        alpha: 1,
        color: Math.random() > 0.4 ? '#94452c' : '#556348'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.alpha -= 0.022;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const formattedDate = useMemo(() => {
    return new Date(letterData?.timestamp || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [letterData?.timestamp]);

  return (
    <div className="relative w-full overflow-hidden pb-12">
      {/* Ambient Glow Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#ffdbd0]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-12 w-96 h-96 bg-[#d8e8c6]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Notification Header / Status Bar */}
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-6 w-full space-y-4">
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#E8E2D5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#f6f3ed] flex items-center justify-center text-[#94452c] border border-[#e8e2d5] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">
                mark_email_unread
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-ledger text-[11px] text-[#94452c] font-semibold tracking-wider uppercase">
                  Incoming Truce Folio
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#94452c] animate-ping" />
              </div>
              <p className="font-serif-display text-lg text-[#1c1c18] font-medium">
                A peace offering has arrived from {sender}. Gate engaged.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {/* Sound Synthesizer Controller Button */}
            <button
              type="button"
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                soundActive
                  ? 'bg-white text-[#556348] border-[#e8e2d5] shadow-xs'
                  : 'bg-[#f0eee8] text-[#88726c] border-[#e8e2d5]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {soundActive ? 'volume_up' : 'volume_off'}
              </span>
              <span className="font-body-sans">
                {soundActive ? 'Web Synth: Active' : 'Web Synth: Muted'}
              </span>
            </button>

            <div className="px-3 py-1.5 bg-[#f6f3ed] rounded-lg font-mono-ledger text-[11px] text-[#88726c] border border-[#e8e2d5]">
              Truce #UBM-8820
            </div>
          </div>
        </div>

        {/* Alternative Ritual Switcher Tabs & Sensory Telemetry */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#e8e2d5]">
            <button
              type="button"
              onClick={() => setSelectedRitualTab('shackle')}
              className={`px-3 py-1 rounded-md font-body-sans text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedRitualTab === 'shackle'
                  ? 'bg-[#f6f3ed] text-[#1c1c18] shadow-xs'
                  : 'text-[#88726c] hover:text-[#1c1c18]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#94452c]" />
              Shackle Drag {selectedRitualTab === 'shackle' ? '(Active)' : ''}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playWaxCrack();
                setSelectedRitualTab('wax');
              }}
              className={`px-3 py-1 rounded-md font-body-sans text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedRitualTab === 'wax'
                  ? 'bg-[#f6f3ed] text-[#1c1c18] shadow-xs'
                  : 'text-[#88726c] hover:text-[#1c1c18]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              Wax Seal Crack
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTick(580, 0.02);
                setSelectedRitualTab('glass');
              }}
              className={`px-3 py-1 rounded-md font-body-sans text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedRitualTab === 'glass'
                  ? 'bg-[#f6f3ed] text-[#1c1c18] shadow-xs'
                  : 'text-[#88726c] hover:text-[#1c1c18]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">cleaning_services</span>
              Frosted Wipe
            </button>
          </div>

          {/* Live Sensory Telemetry */}
          <div className="flex items-center gap-3 font-mono-ledger text-[11px] text-[#88726c]">
            <span>Resistance: {resistancePct}%</span>
            <span>•</span>
            <span>Atmosphere: {blurValue}px Blur</span>
            <span>•</span>
            <span className="text-[#556348] font-medium">
              Kinetic Canvas: {isUnlocked ? 'Unlocked' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Ritual Stage Canvas Container */}
      <div className="max-w-[780px] mx-auto px-4 sm:px-6 mt-8 relative">
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* Card Container: Stacked Layers */}
        <div className="relative bg-white rounded-xl shadow-xl overflow-hidden p-6 sm:p-10 min-h-[580px] flex flex-col justify-between deckle-border">
          {/* Deckle Folio Watermark Accent */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 opacity-5 pointer-events-none select-none">
            <BrandLogo size={256} variant="display" />
          </div>

          {/* BACKGROUND LAYER: The Apology Letter (Blurred or Revealed) */}
          <div className="relative z-10 transition-all duration-700 ease-out flex-1 flex flex-col justify-between">
            {/* Letter Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D5]">
              <div className="space-y-1">
                <span className="font-mono-ledger text-[10px] text-[#88726c] uppercase tracking-widest">
                  Hand-Crafted Record • Private Seal
                </span>
                <p className="font-serif-display text-2xl text-[#1c1c18] font-medium">
                  To: {recipient}
                </p>
                <p className="font-body-sans text-xs text-[#88726c]">
                  Transmitted via Client Ephemeral Pipeline • {formattedDate}
                </p>
              </div>

              {/* Terracotta Wax Relief Medallion */}
              <div className="flex flex-col items-center">
                <div className="w-13 h-13 rounded-full bg-[#94452c] flex items-center justify-center text-white wax-seal-glow relative group">
                  <span className="material-symbols-outlined text-[26px]">
                    {isUnlocked ? 'lock_open' : 'verified_user'}
                  </span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#556348] rounded-full" />
                </div>
                <span className="font-mono-ledger text-[10px] text-[#88726c] mt-1">
                  VERIFIED INK
                </span>
              </div>
            </div>

            {/* Letter Core Text Section (Dynamic Blur & Opacity) */}
            <div
              className="relative my-6 py-6 px-4 rounded-lg transition-all duration-300 select-none"
              style={{
                filter: `blur(${blurValue}px)`,
                opacity: opacityValue
              }}
            >
              <div className="space-y-4 font-serif-display text-lg sm:text-xl text-[#1c1c18] leading-relaxed">
                <p className="italic text-[#94452c] font-semibold">
                  “Dear {recipient},”
                </p>
                <p>
                  {letterStructure.opener}
                  <span className="font-semibold text-[#94452c]">
                    {tokens.trigger}
                  </span>
                  {letterStructure.p1Suffix}
                </p>
                <p>
                  {letterStructure.p2}
                  <span className="font-semibold text-[#556348]">
                    {tokens.fault}
                  </span>
                  {letterStructure.p2Mid}
                </p>
                <p>
                  {letterStructure.p3Lead}
                  <span className="font-semibold text-[#94452c]">
                    {tokens.remedy}
                  </span>
                  {letterStructure.p3Suffix}
                </p>
                <p className="text-[#55433e] font-body-sans text-sm pt-2">
                  I know apologies don't automatically rebuild ease, but I wanted this folio to prove I'm willing to lower my shields first. Take all the time you need.
                </p>
              </div>

              {/* Signoff */}
              <div className="pt-6 mt-4 flex items-center justify-between border-t border-[#E8E2D5]">
                <div>
                  <p className="font-serif-display text-lg text-[#556348] italic">
                    With sincere accountability,
                  </p>
                  <p className="font-serif-display text-2xl text-[#1c1c18] font-semibold">
                    {sender}
                  </p>
                  <p className="font-mono-ledger text-[10px] text-[#88726c] mt-0.5">
                    Fingerprint Hash: 0x9b4f..d72a (Zero-Knowledge)
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono-ledger text-[10px] px-2.5 py-1 bg-[#f0eee8] rounded text-[#6a5941] border border-[#e8e2d5]">
                    Single Session Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* UNLOCKED ACTION DECK: Appears smoothly upon completion */}
            {isUnlocked && (
              <div className="transition-all duration-700 pt-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-[#f6f3ed] p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#556348] text-[24px]">
                      task_alt
                    </span>
                    <span className="font-body-sans text-sm font-semibold text-[#1c1c18]">
                      Truce Unlocked. You hold the final key.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTick(440, 0.02);
                        if (onCounterOffer) onCounterOffer();
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-white hover:bg-[#f0eee8] text-[#1c1c18] border border-[#e8e2d5] font-body-sans text-xs font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      Counter-Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTick(660, 0.02);
                        if (onAcceptTruce) onAcceptTruce();
                      }}
                      className="flex-1 sm:flex-initial px-5 py-2 rounded-lg bg-[#94452c] hover:bg-[#793019] text-white font-body-sans text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        handshake
                      </span>
                      Accept Truce
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTick(800, 0.02);
                        if (onSaveKeepsake) onSaveKeepsake();
                      }}
                      className="p-2 rounded-lg bg-white hover:bg-[#f0eee8] text-[#88726c] hover:text-[#1c1c18] border border-[#e8e2d5] transition-all shadow-xs cursor-pointer"
                      title="Save Official Keepsake"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download_for_offline
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOREGROUND LAYER: The Central Shackle Drag Gate Apparatus (hidden when unlocked) */}
          {!isUnlocked && (
            <div className="relative z-20 transition-all duration-700 bg-white/95 backdrop-blur-md rounded-xl p-6 sm:p-7 shadow-xl border border-[#E8E2D5] -mt-72 animate-in fade-in">
              {/* Obscurity Warning Tag */}
              <div className="flex items-center justify-center gap-1.5 text-[#94452c] pb-3 animate-pulse">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span className="font-mono-ledger text-[11px] font-semibold uppercase tracking-wider">
                  Content Obscured • Complete ritual to read
                </span>
              </div>

              {/* Apparatus Center: Option 16 Padlock Motif */}
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <BrandLogo size={64} variant="vector" isOpen={isUnlocked} />
                </div>
                <h3 className="font-serif-display text-xl text-[#1c1c18] font-semibold mt-1">
                  The Shackle Release
                </h3>
                <p className="font-body-sans text-xs sm:text-sm text-[#55433e] max-w-sm mt-1 leading-relaxed">
                  Physical drag dampens cortisol and dissolves defensiveness. Slide the weighted brass pin fully to the right to lift the seal.
                </p>
              </div>

              {/* Shackle Slider Gesture Assembly */}
              <div className="mt-4">
                <ShackleSlider
                  isUnlocked={isUnlocked}
                  onProgressUpdate={handleProgress}
                  onUnlock={handleUnlock}
                />
              </div>
            </div>
          )}
        </div>

        {/* Contextual Footnote Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-body-sans text-xs text-[#88726c]">
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#1c1c18] font-semibold mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#94452c]">
                psychology
              </span>
              <span>Polyvagal Calming</span>
            </div>
            <p className="text-[#55433e] text-[12px] leading-relaxed">
              The ritual resistance curve prevents instant reactionary dismissals by redirecting tactile energy.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#1c1c18] font-semibold mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#556348]">
                verified
              </span>
              <span>Zero-Server Encryption</span>
            </div>
            <p className="text-[#55433e] text-[12px] leading-relaxed">
              The apology envelope was compiled directly in {sender}'s local browser and unpacks purely client-side.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#1c1c18] font-semibold mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#6a5941]">
                history_edu
              </span>
              <span>Keepsake Ledger</span>
            </div>
            <p className="text-[#55433e] text-[12px] leading-relaxed">
              Upon acceptance, an immutable, signed receipt is generated into your personal reconciliation archive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
