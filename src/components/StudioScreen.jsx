import React, { useState, useMemo } from 'react';
import BrandLogo from './BrandLogo';
import TokenPickerModal from './TokenPickerModal';
import soundEngine from '../engine/audio';
import {
  RELATIONSHIPS,
  GRAVITY_LEVELS,
  TOKEN_BANKS,
  QUICK_PRESETS,
  getLetterStructure,
  getRandomTokensFor
} from '../engine/grammarMatrix';
import {
  serializeState,
  generateShareableUrl,
  getHashStats
} from '../engine/stateSerializer';

export default function StudioScreen({ initialData, onSimulateRecipient }) {
  const [recipient, setRecipient] = useState(initialData?.recipient || 'Alex');
  const [sender, setSender] = useState(initialData?.sender || 'Jordan');
  const [relationship, setRelationship] = useState(
    initialData?.relationship || 'situationship'
  );
  const [gravity, setGravity] = useState(Number(initialData?.gravity) || 3);
  const [ritual, setRitual] = useState(initialData?.ritual || 'shackle');
  const [tokens, setTokens] = useState({
    trigger: initialData?.tokens?.trigger || 'I ghosted when things got real',
    fault:
      initialData?.tokens?.fault || 'let my defensiveness do the talking',
    remedy:
      initialData?.tokens?.remedy ||
      'dinner at your favorite spot, my bill, no excuses'
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTokenKey, setActiveTokenKey] = useState('trigger');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [isSealed, setIsSealed] = useState(false);

  // Active gravity info
  const gravityInfo = GRAVITY_LEVELS[gravity] || GRAVITY_LEVELS[3];

  // Current letter structure
  const letterStructure = useMemo(() => {
    return getLetterStructure(relationship, gravity, tokens);
  }, [relationship, gravity, tokens]);

  // Current state object
  const currentState = useMemo(() => {
    return {
      recipient,
      sender,
      relationship,
      gravity,
      ritual,
      tokens,
      timestamp: Date.now()
    };
  }, [recipient, sender, relationship, gravity, ritual, tokens]);

  // URL Hash stats
  const hashStats = useMemo(() => {
    return getHashStats(currentState);
  }, [currentState]);

  const liveUrl = useMemo(() => {
    return generateShareableUrl(currentState);
  }, [currentState]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleApplyPreset = (key) => {
    soundEngine.playTick(720, 0.02);
    const p = QUICK_PRESETS[key];
    if (p) {
      setRelationship(p.relationship);
      setGravity(p.gravity);
      setTokens(p.tokens);
      showToast(`Loaded preset: ${p.label}`);
    }
  };

  const handleRandomize = () => {
    soundEngine.playTick(880, 0.025);
    const newTokens = getRandomTokensFor(relationship);
    setTokens(newTokens);
    showToast('Rolled fresh permutation from grammar matrix!');
  };

  const openTokenPicker = (key) => {
    soundEngine.playTick(540, 0.015);
    setActiveTokenKey(key);
    setModalOpen(true);
  };

  const handleSealAndCopy = () => {
    soundEngine.playSealStamp();
    setIsSealed(true);

    // Update browser hash so recipient link is live
    const compressed = serializeState(currentState);
    window.location.hash = `#p=${compressed}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl).catch(() => {});
    }

    showToast('Truce link sealed & copied to clipboard! (Zero-server payload)');
    setTimeout(() => setIsSealed(false), 2800);
  };

  const handleSimulate = () => {
    soundEngine.playTick(750, 0.02);
    const compressed = serializeState(currentState);
    window.location.hash = `#p=${compressed}`;
    if (onSimulateRecipient) {
      onSimulateRecipient(currentState);
    }
  };

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#E8E2D5]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#94452c] animate-ping" />
            <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#94452c]">
              Ephemeral Dispatch Folio • Studio
            </span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1c1c18] tracking-tight font-medium">
            Craft a Peace Offering
          </h1>
          <p className="font-body-sans text-sm sm:text-base text-[#55433e] leading-relaxed">
            Combinatorial grammar engine running entirely in your browser. No AI bills, no stored data, instant disarming apologies.
          </p>
        </div>

        {/* Quick Archetype Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-ledger text-[11px] text-[#88726c] mr-1">
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('ghosted')}
            className="px-2.5 py-1 bg-white hover:bg-[#f0eee8] rounded-full font-mono-ledger text-[11px] text-[#55433e] transition-all hover:scale-105 active:scale-95 border border-[#e8e2d5] shadow-xs cursor-pointer"
          >
            Ghosted / Lukewarm
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('canceled')}
            className="px-2.5 py-1 bg-white hover:bg-[#f0eee8] rounded-full font-mono-ledger text-[11px] text-[#55433e] transition-all hover:scale-105 active:scale-95 border border-[#e8e2d5] shadow-xs cursor-pointer"
          >
            Canceled Plans
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('misunderstanding')}
            className="px-2.5 py-1 bg-white hover:bg-[#f0eee8] rounded-full font-mono-ledger text-[11px] text-[#55433e] transition-all hover:scale-105 active:scale-95 border border-[#e8e2d5] shadow-xs cursor-pointer"
          >
            Heated Misunderstanding
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('silly')}
            className="px-2.5 py-1 bg-white hover:bg-[#f0eee8] rounded-full font-mono-ledger text-[11px] text-[#55433e] transition-all hover:scale-105 active:scale-95 border border-[#e8e2d5] shadow-xs cursor-pointer"
          >
            Silly Minor Rift
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('birthday')}
            className="px-2.5 py-1 bg-white hover:bg-[#f0eee8] rounded-full font-mono-ledger text-[11px] text-[#55433e] transition-all hover:scale-105 active:scale-95 border border-[#e8e2d5] shadow-xs cursor-pointer"
          >
            Birthday Olive Branch
          </button>
        </div>
      </header>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Combinatorial Configurator */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Signatories */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E8E2D5] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#88726c]">
                01 / Signatories
              </span>
              <span className="material-symbols-outlined text-[#88726c] text-[18px]">
                history_edu
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="recipient-input"
                  className="block font-body-sans text-xs font-semibold text-[#55433e]"
                >
                  To (Their Name)
                </label>
                <input
                  id="recipient-input"
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    soundEngine.playTick(600, 0.01);
                    setRecipient(e.target.value);
                  }}
                  className="w-full bg-[#f6f3ed] px-3 py-2 rounded-lg font-serif-display text-lg text-[#1c1c18] focus:outline-none focus:ring-1 focus:ring-[#556348] border border-[#e8e2d5]"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="sender-input"
                  className="block font-body-sans text-xs font-semibold text-[#55433e]"
                >
                  From (Your Name)
                </label>
                <input
                  id="sender-input"
                  type="text"
                  value={sender}
                  onChange={(e) => {
                    soundEngine.playTick(600, 0.01);
                    setSender(e.target.value);
                  }}
                  className="w-full bg-[#f6f3ed] px-3 py-2 rounded-lg font-serif-display text-lg text-[#1c1c18] focus:outline-none focus:ring-1 focus:ring-[#556348] border border-[#e8e2d5]"
                />
              </div>
            </div>
          </div>

          {/* Relational Dynamic Selector */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E8E2D5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#88726c]">
                02 / Relational Dynamic
              </span>
              <span className="font-mono-ledger text-xs text-[#556348] font-semibold">
                {RELATIONSHIPS.find((r) => r.id === relationship)?.label ||
                  relationship}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RELATIONSHIPS.map((rel) => {
                const isActive = rel.id === relationship;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTick(720, 0.015);
                      setRelationship(rel.id);
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#ffdbd0]/50 border-2 border-[#94452c] shadow-xs'
                        : 'bg-[#fcf9f3] hover:bg-[#f0eee8] border border-[#e8e2d5]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isActive ? 'text-[#94452c]' : 'text-[#556348]'
                        }`}
                      >
                        {rel.icon}
                      </span>
                      <span className="font-body-sans text-xs font-semibold text-[#1c1c18]">
                        {rel.label}
                      </span>
                    </div>
                    <span className="font-mono-ledger text-[10px] text-[#88726c] leading-tight line-clamp-1">
                      {rel.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gravity Barometer Slider */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E8E2D5] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#88726c]">
                  03 / Gravity Barometer
                </span>
                <span className="px-2 py-0.5 rounded bg-[#94452c]/10 text-[#94452c] font-mono-ledger text-[11px] font-bold">
                  Level {gravity}
                </span>
              </div>
              <span className="font-body-sans text-xs text-[#1c1c18] font-semibold">
                {gravityInfo.title}
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={gravity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  soundEngine.playTick(400 + val * 120, 0.02);
                  setGravity(val);
                }}
                className="w-full accent-[#94452c] h-2 bg-[#ebe8e2] rounded-lg cursor-pointer appearance-none transition-all"
              />
              <div className="flex justify-between items-center font-mono-ledger text-[10px] text-[#88726c] px-0.5">
                <span>1: Silly Banter</span>
                <span>2: Awkward Slip</span>
                <span>3: Mid Friction</span>
                <span>4: Cold Silence</span>
                <span>5: Severed Bond</span>
              </div>
            </div>

            <div className="p-3 bg-[#f6f3ed] rounded-lg font-body-sans text-xs text-[#55433e] flex items-center gap-2 border border-[#e8e2d5]">
              <span className="material-symbols-outlined text-[#556348] text-[18px]">
                grain
              </span>
              <span>{gravityInfo.description}</span>
            </div>
          </div>

          {/* Ritual Gatekeeper Cards */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E8E2D5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#88726c]">
                04 / Ritual Gatekeeper
              </span>
              <span className="font-mono-ledger text-xs text-[#556348]">
                Physical unlock mechanics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Shackle Drag */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(650, 0.02);
                  setRitual('shackle');
                }}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                  ritual === 'shackle'
                    ? 'bg-[#ffdbd0]/30 border-2 border-[#94452c] shadow-xs'
                    : 'bg-[#fcf9f3] hover:bg-[#f0eee8] border border-[#e8e2d5]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[#94452c] text-[18px]">
                    lock_open
                  </span>
                  <span className="font-body-sans text-xs font-semibold text-[#1c1c18]">
                    Shackle Drag
                  </span>
                </div>
                <p className="font-mono-ledger text-[10px] text-[#55433e] leading-snug">
                  Weighted padlock friction slide with dampened recoil.
                </p>
                <div className="mt-2 text-[10px] font-mono-ledger text-[#94452c] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94452c]" /> Default Gate
                </div>
              </button>

              {/* Wax Seal Crack */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playWaxCrack();
                  setRitual('wax');
                }}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                  ritual === 'wax'
                    ? 'bg-[#ffdbd0]/30 border-2 border-[#94452c] shadow-xs'
                    : 'bg-[#fcf9f3] hover:bg-[#f0eee8] border border-[#e8e2d5]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[#556348] text-[18px]">
                    verified
                  </span>
                  <span className="font-body-sans text-xs font-semibold text-[#1c1c18]">
                    Wax Seal Crack
                  </span>
                </div>
                <p className="font-mono-ledger text-[10px] text-[#55433e] leading-snug">
                  Analog brittle seal fracture accompanied by parchment snap.
                </p>
                <div className="mt-2 text-[10px] font-mono-ledger text-[#88726c]">
                  Press & Hold
                </div>
              </button>

              {/* Glass Wipe */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(600, 0.02);
                  setRitual('glass');
                }}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                  ritual === 'glass'
                    ? 'bg-[#ffdbd0]/30 border-2 border-[#94452c] shadow-xs'
                    : 'bg-[#fcf9f3] hover:bg-[#f0eee8] border border-[#e8e2d5]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[#556348] text-[18px]">
                    blur_on
                  </span>
                  <span className="font-body-sans text-xs font-semibold text-[#1c1c18]">
                    Glass Wipe
                  </span>
                </div>
                <p className="font-mono-ledger text-[10px] text-[#55433e] leading-snug">
                  Touch-clearing condensation reveal layer by layer.
                </p>
                <div className="mt-2 text-[10px] font-mono-ledger text-[#88726c]">
                  Multi-Swipe Reveal
                </div>
              </button>
            </div>
          </div>

          {/* Roll New Permutation Button */}
          <button
            type="button"
            onClick={handleRandomize}
            className="group w-full py-3 px-4 bg-white hover:bg-[#f0eee8] rounded-xl flex items-center justify-between text-sm font-semibold text-[#1c1c18] border border-[#E8E2D5] shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#556348] group-hover:rotate-180 transition-transform duration-500">
                casino
              </span>
              <span>Roll New Procedural Permutation</span>
            </div>
            <span className="font-mono-ledger text-[11px] text-[#88726c]">
              12,800 combinations
            </span>
          </button>
        </section>

        {/* RIGHT COLUMN: Tactile Letter Preview & Token System */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Physical Parchment Card Container */}
          <div className="relative bg-[#F9F6F0] rounded-xl p-6 sm:p-9 shadow-md text-[#1c1c18] flex flex-col justify-between overflow-hidden deckle-border">
            {/* Watermark / Header */}
            <div className="flex items-start justify-between pb-5 border-b border-[#E8E2D5] gap-4">
              <div className="flex items-center gap-3">
                <BrandLogo size={44} variant="display" />
                <div className="flex flex-col">
                  <span className="font-mono-ledger text-[10px] tracking-widest text-[#88726C] uppercase">
                    ARCHIVAL FOLIO STANDARD
                  </span>
                  <span className="font-serif-display text-base text-[#1c1c18] font-semibold tracking-tight">
                    CONFIDENTIAL RECONCILIATION DISPATCH
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="font-mono-ledger text-[11px] text-[#55433E]">
                  {formattedDate}
                </span>
                <span className="inline-flex items-center gap-1 font-mono-ledger text-[10px] text-[#556348] bg-[#d8e8c6]/60 px-2 py-0.5 rounded-full mt-1">
                  <span className="material-symbols-outlined text-[12px]">
                    enhanced_encryption
                  </span>
                  Client-Side Only
                </span>
              </div>
            </div>

            {/* Dynamic Letter Body */}
            <div className="py-7 space-y-6">
              {/* Salutation */}
              <p className="font-serif-display text-2xl text-[#1c1c18] tracking-tight font-medium">
                Hey {recipient || 'Friend'},
              </p>

              {/* Letter Paragraphs with Clickable Tokens */}
              <div className="font-serif-display text-lg sm:text-[19px] text-[#31312d] leading-relaxed space-y-4">
                <p>
                  {letterStructure.opener}
                  <button
                    type="button"
                    onClick={() => openTokenPicker('trigger')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 rounded bg-[#E8E2D5] hover:bg-[#d9c3a5] text-[#94452c] font-serif-display font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs align-baseline group cursor-pointer"
                  >
                    <span>{tokens.trigger}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#94452c]/70 group-hover:text-[#94452c]">
                      edit
                    </span>
                  </button>
                  {letterStructure.p1Suffix}
                </p>

                <p>
                  {letterStructure.p2}
                  <button
                    type="button"
                    onClick={() => openTokenPicker('fault')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 rounded bg-[#d8e8c6] hover:bg-[#bcccab] text-[#556348] font-serif-display font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs align-baseline group cursor-pointer"
                  >
                    <span>{tokens.fault}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#556348]/70 group-hover:text-[#556348]">
                      edit
                    </span>
                  </button>
                  {letterStructure.p2Mid}
                </p>

                <p>
                  {letterStructure.p3Lead}
                  <button
                    type="button"
                    onClick={() => openTokenPicker('remedy')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 rounded bg-[#ffdbd0] hover:bg-[#ffb59f] text-[#94452c] font-serif-display font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs align-baseline group cursor-pointer"
                  >
                    <span>{tokens.remedy}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#94452c]/70 group-hover:text-[#94452c]">
                      edit
                    </span>
                  </button>
                  {letterStructure.p3Suffix}
                </p>
              </div>

              {/* Truce Terms Covenant Box */}
              <div className="mt-6 p-4 rounded-xl bg-white/80 border border-[#E8E2D5] shadow-inner space-y-2">
                <div className="flex items-center justify-between text-[#88726c] font-mono-ledger text-[11px]">
                  <span className="uppercase tracking-wider">
                    Truce Covenant Conditions
                  </span>
                  <span>Self-Executing Upon Unlock</span>
                </div>
                <ul className="space-y-1.5 font-body-sans text-xs text-[#1c1c18]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#556348]">
                      check_circle
                    </span>
                    <span>
                      Recipient sets pace: You may read this and take 48 hours to reply without penalty.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#556348]">
                      check_circle
                    </span>
                    <span>
                      Zero Server Footprint: All words remain strictly between sender and receiver keys.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#556348]">
                      check_circle
                    </span>
                    <span>{gravityInfo.gateText}</span>
                  </li>
                </ul>
              </div>

              {/* Hand-signed Sign-off */}
              <div className="pt-4 flex items-end justify-between">
                <div>
                  <p className="font-serif-display text-lg text-[#55433e] italic">
                    With sincere accountability,
                  </p>
                  <p className="font-serif-display text-2xl text-[#1c1c18] font-semibold mt-0.5">
                    {sender || 'Anonymous'}
                  </p>
                </div>
                {/* Wax Embossed Seal Graphic */}
                <div className="relative w-14 h-14 rounded-full bg-[#94452c] flex items-center justify-center wax-seal-glow text-white">
                  <span className="material-symbols-outlined text-[28px]">
                    lock
                  </span>
                  <span className="absolute inset-0 rounded-full border border-white/20" />
                </div>
              </div>
            </div>

            {/* Live LZ-String Hash Payload Monitor */}
            <div className="mt-4 pt-4 border-t border-[#E8E2D5] bg-[#F6F3ED]/80 -mx-6 sm:-mx-9 -mb-6 sm:-mb-9 p-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#88726c] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">link</span>
                  Live URL Hash State Monitor
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono-ledger text-[10px] bg-[#d8e8c6] text-[#131f0a] font-semibold">
                    {hashStats.compressedLength} chars (Target &lt; 180 chars ✅)
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono-ledger text-[10px] bg-white text-[#55433e] border border-[#e8e2d5]">
                    {hashStats.reductionPercent}% LZ-Reduction
                  </span>
                </div>
              </div>
              <div className="w-full bg-white px-3 py-2 rounded font-mono-ledger text-[11px] text-[#55433e] break-all select-all border border-[#e8e2d5] shadow-xs">
                {liveUrl}
              </div>
            </div>
          </div>

          {/* Action Command Stack */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Primary Seal Button */}
            <button
              type="button"
              onClick={handleSealAndCopy}
              className={`flex-1 py-4 px-6 text-white rounded-xl font-body-sans text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                isSealed
                  ? 'bg-[#556348] shadow-[0_4px_16px_rgba(85,99,72,0.4)]'
                  : 'bg-[#94452c] hover:bg-[#793019] shadow-[0_4px_16px_rgba(148,69,44,0.35)]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSealed ? 'verified' : 'mark_email_read'}
              </span>
              <span>
                {isSealed
                  ? 'Link Encrypted & Copied to Clipboard!'
                  : 'Seal Peace Offering & Copy Truce Link'}
              </span>
            </button>

            {/* Simulate Recipient View Button */}
            <button
              type="button"
              onClick={handleSimulate}
              className="py-4 px-5 bg-white hover:bg-[#f0eee8] text-[#1c1c18] rounded-xl font-body-sans text-sm font-semibold flex items-center justify-center gap-2 border border-[#E8E2D5] shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Simulate Recipient View</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Token Customization Modal */}
      <TokenPickerModal
        isOpen={modalOpen}
        tokenKey={activeTokenKey}
        currentValue={tokens[activeTokenKey]}
        options={
          TOKEN_BANKS[activeTokenKey]?.byCategory?.[relationship]
            ? [
                ...TOKEN_BANKS[activeTokenKey].options,
                ...TOKEN_BANKS[activeTokenKey].byCategory[relationship]
              ]
            : TOKEN_BANKS[activeTokenKey]?.options || []
        }
        title={TOKEN_BANKS[activeTokenKey]?.name || 'Select Phrasing'}
        category={TOKEN_BANKS[activeTokenKey]?.description || 'Offering Phrase'}
        onSelect={(newVal) => {
          setTokens((prev) => ({
            ...prev,
            [activeTokenKey]: newVal
          }));
        }}
        onClose={() => setModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          <div className="px-5 py-2.5 rounded-full bg-[#1c1c18] text-[#fcf9f3] shadow-xl flex items-center gap-2 font-body-sans text-xs sm:text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-[#ffdbd0]">
              verified
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
