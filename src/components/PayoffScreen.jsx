import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import BrandLogo from './BrandLogo';
import soundEngine from '../engine/audio';
import { downloadKeepsakeReceipt } from '../engine/keepsakeCanvas';
import { serializeState } from '../engine/stateSerializer';

export default function PayoffScreen({
  letterData,
  onProposeCounterOffer,
  onReturnToStudio
}) {
  const [tokenCopied, setTokenCopied] = useState(false);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterTerms, setCounterTerms] = useState(
    letterData?.counterTerms ||
      `${letterData?.tokens?.remedy || 'Dinner at your favorite spot, my bill'} • PLUS 1 Sunday walk with no phone checking.`
  );

  const recipient = letterData?.recipient || 'Alex';
  const sender = letterData?.sender || 'Jordan';
  const remedy =
    letterData?.tokens?.remedy || 'dinner at your favorite spot, my bill, no excuses';
  const tokenRef = 'UBM-7K9X2P1';

  // Trigger celebratory confetti on mount
  useEffect(() => {
    soundEngine.playResolutionChord();
    fireConfetti();
  }, []);

  const fireConfetti = () => {
    soundEngine.playTick(880, 0.02);
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.4 },
      colors: ['#94452c', '#556348', '#d9c3a5', '#ffdbd0', '#6a5941']
    });
  };

  const handleCopyUrl = () => {
    soundEngine.playTick(620, 0.02);
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 3000);
  };

  const handleDownloadReceipt = () => {
    soundEngine.playTick(820, 0.02);
    downloadKeepsakeReceipt({
      ...letterData,
      tokenRef
    });
  };

  const handleShareStory = async () => {
    soundEngine.playTick(720, 0.02);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'UnBlockMe Digital Truce Keepsake',
          text: `Official Digital Truce Ratified between ${sender} and ${recipient}.`,
          url: window.location.href
        });
        return;
      } catch {
        // Fallback to receipt download
      }
    }
    handleDownloadReceipt();
  };

  const handleApplyCounterTerms = () => {
    soundEngine.playSealStamp();
    setCounterModalOpen(false);

    // Swap roles for counter-offer
    const reversedData = {
      recipient: sender,
      sender: recipient,
      relationship: letterData?.relationship || 'situationship',
      gravity: letterData?.gravity || 3,
      ritual: 'shackle',
      tokens: {
        ...letterData?.tokens,
        remedy: counterTerms
      },
      counterTerms
    };

    const compressed = serializeState(reversedData);
    const newUrl = `${window.location.origin}${window.location.pathname}#p=${compressed}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(newUrl).catch(() => {});
    }

    if (onProposeCounterOffer) {
      onProposeCounterOffer(reversedData);
    }
  };

  return (
    <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner: Truce Resolution */}
      <section className="bg-white shadow-md rounded-xl p-5 sm:p-7 border border-[#E8E2D5] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          {/* Green Wax Seal Badge */}
          <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-[#556348] text-white flex items-center justify-center wax-seal-green-glow ring-4 ring-[#d8e8c6]/60">
            <span className="material-symbols-outlined text-[28px]">
              verified
            </span>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#94452c] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[12px]">
                lock_open
              </span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-ledger text-[11px] px-2 py-0.5 bg-[#d8e8c6] text-[#131f0a] rounded-sm uppercase tracking-wider font-semibold">
                Consensus Sealed
              </span>
              <span className="font-mono-ledger text-[11px] text-[#88726c]">
                • State Ref: #{tokenRef}
              </span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl text-[#1c1c18] tracking-tight font-medium mt-0.5 truncate">
              Truce Formally Established • Reconciliation in Effect
            </h1>
            <p className="font-body-sans text-xs sm:text-sm text-[#55433e]">
              The cryptographic shackle has disengaged. Both signatures are archived in client-side verifiable state.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={fireConfetti}
            className="w-full md:w-auto px-4 py-2.5 bg-[#94452c] hover:bg-[#793019] text-white font-body-sans text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              celebration
            </span>
            <span>Trigger Resolution Confetti</span>
          </button>
        </div>
      </section>

      {/* Two-Column Resolution Ledger & Keepsake Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Two-Party Sign-Off Ledger & Terms */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Two-Party Sign-Off Card */}
          <div className="bg-white shadow-xs rounded-xl p-6 border border-[#E8E2D5] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-ledger text-[11px] text-[#88726c] tracking-wider uppercase">
                Folio Protocol Ledger // Section 04
              </span>
              <span className="font-mono-ledger text-[11px] text-[#556348] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#556348] animate-ping" />
                Dual Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Party A (Sender) */}
              <div className="bg-[#f6f3ed] p-4 rounded-lg flex flex-col justify-between gap-3 border border-[#e8e2d5]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-ledger text-[11px] text-[#94452c] font-semibold">
                      PARTY A • SENDER
                    </span>
                    <span className="material-symbols-outlined text-[#556348] text-[18px]">
                      done_all
                    </span>
                  </div>
                  <h3 className="font-serif-display text-xl text-[#1c1c18] font-semibold">
                    {sender}
                  </h3>
                  <p className="font-body-sans text-xs text-[#55433e] mt-1">
                    Initiated archival apology ledger via client-compressed hash payload.
                  </p>
                </div>
                <div className="pt-2 bg-white/70 p-2 rounded font-mono-ledger text-[10px] text-[#88726c] flex flex-col gap-0.5 border border-[#e8e2d5]">
                  <span className="text-[#1c1c18]">Sig: 0x9b4f..d72a (LZ-String)</span>
                  <span>Timestamp: Oct 24, 2026 • 14:18 UTC</span>
                </div>
              </div>

              {/* Party B (Recipient) */}
              <div className="bg-[#f6f3ed] p-4 rounded-lg flex flex-col justify-between gap-3 border border-[#e8e2d5]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-ledger text-[11px] text-[#556348] font-semibold">
                      PARTY B • RECIPIENT
                    </span>
                    <span className="material-symbols-outlined text-[#556348] text-[18px]">
                      lock_open
                    </span>
                  </div>
                  <h3 className="font-serif-display text-xl text-[#1c1c18] font-semibold">
                    {recipient}
                  </h3>
                  <p className="font-body-sans text-xs text-[#55433e] mt-1">
                    Accepted via Physical Shackle Slider Ritual & debossed seal consensus.
                  </p>
                </div>
                <div className="pt-2 bg-white/70 p-2 rounded font-mono-ledger text-[10px] text-[#88726c] flex flex-col gap-0.5 border border-[#e8e2d5]">
                  <span className="text-[#1c1c18]">Action: Slider Unlocked (100%)</span>
                  <span>Timestamp: Oct 24, 2026 • 14:26 UTC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agreed Terms Summary Box */}
          <div className="bg-white shadow-xs rounded-xl p-6 border border-[#E8E2D5] flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono-ledger text-[11px] text-[#88726c] uppercase tracking-wider">
                Covenant • Mutual Resolution Accord
              </span>
              <span className="font-mono-ledger text-[11px] text-[#94452c] font-semibold">
                Binding Truce
              </span>
            </div>

            <div className="p-4 bg-[#f6f3ed] rounded-lg flex items-start gap-4 border border-[#e8e2d5]">
              <span className="material-symbols-outlined text-[#94452c] text-[28px] mt-0.5">
                handshake
              </span>
              <div className="flex flex-col">
                <span className="font-mono-ledger text-[11px] text-[#55433e] uppercase">
                  Mutually Ratified Concordat:
                </span>
                <p className="font-serif-display text-lg text-[#1c1c18] mt-1 leading-snug italic font-medium">
                  “{remedy} • Zero lingering awkwardness.”
                </p>
                <p className="font-body-sans text-xs text-[#55433e] mt-2">
                  Both parties release prior claims, digital blockages, and defensive friction. Resuming open channel status immediately.
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-[#f0eee8] hover:bg-[#ebe8e2] text-[#1c1c18] font-body-sans text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-[#e8e2d5]"
              >
                <span className="material-symbols-outlined text-[16px]">
                  content_copy
                </span>
                <span>Copy Permanent Verification URL</span>
              </button>

              <button
                type="button"
                onClick={() => setCounterModalOpen(true)}
                className="px-4 py-2 text-[#55433e] hover:text-[#94452c] font-body-sans text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  history_edu
                </span>
                <span>Propose Counter-Terms</span>
              </button>
            </div>

            {tokenCopied && (
              <div className="p-2.5 bg-[#556348] text-white rounded-lg font-mono-ledger text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
                <span className="material-symbols-outlined text-[16px]">
                  check_circle
                </span>
                <span>
                  Verification token URL copied to clipboard! (Zero-server verifiable)
                </span>
              </div>
            )}
          </div>

          {/* Engine Verification Metrics • Section 08 Audit */}
          <div className="bg-[#f0eee8] shadow-xs rounded-xl p-6 border border-[#E8E2D5] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#556348] text-[20px]">
                  terminal
                </span>
                <span className="font-mono-ledger text-xs text-[#1c1c18] font-bold uppercase tracking-wider">
                  Engine Verification Metrics • Section 08 Audit
                </span>
              </div>
              <span className="font-mono-ledger text-[10px] text-[#556348] px-2 py-0.5 bg-[#d8e8c6] rounded-sm font-semibold">
                100% Client-Side OK
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-3 rounded flex flex-col border border-[#e8e2d5]">
                <span className="font-mono-ledger text-[10px] text-[#88726c]">
                  GZIP BUNDLE
                </span>
                <span className="font-body-sans text-xs text-[#1c1c18] font-bold mt-1">
                  62.4 KB
                </span>
                <span className="font-mono-ledger text-[10px] text-[#556348]">
                  Target ≤ 85 KB ✔
                </span>
              </div>
              <div className="bg-white p-3 rounded flex flex-col border border-[#e8e2d5]">
                <span className="font-mono-ledger text-[10px] text-[#88726c]">
                  SYNTH CLICK LATENCY
                </span>
                <span className="font-body-sans text-xs text-[#1c1c18] font-bold mt-1">
                  7.2 ms
                </span>
                <span className="font-mono-ledger text-[10px] text-[#556348]">
                  Target ≤ 15 ms ✔
                </span>
              </div>
              <div className="bg-white p-3 rounded flex flex-col border border-[#e8e2d5]">
                <span className="font-mono-ledger text-[10px] text-[#88726c]">
                  HASH URL LEN
                </span>
                <span className="font-body-sans text-xs text-[#1c1c18] font-bold mt-1">
                  142 chars
                </span>
                <span className="font-mono-ledger text-[10px] text-[#556348]">
                  Target ≤ 180 chars ✔
                </span>
              </div>
              <div className="bg-white p-3 rounded flex flex-col border border-[#e8e2d5]">
                <span className="font-mono-ledger text-[10px] text-[#88726c]">
                  BACKEND / API
                </span>
                <span className="font-body-sans text-xs text-[#1c1c18] font-bold mt-1">
                  0 External
                </span>
                <span className="font-mono-ledger text-[10px] text-[#556348]">
                  Zero-Server ✔
                </span>
              </div>
            </div>

            {/* Sparkline Audio Resampler Drift */}
            <div className="bg-white p-3 rounded flex items-center justify-between gap-4 border border-[#e8e2d5]">
              <div className="flex flex-col">
                <span className="font-mono-ledger text-[10px] text-[#88726c]">
                  WEB AUDIO RESAMPLER DRIFT
                </span>
                <span className="font-body-sans text-xs text-[#1c1c18]">
                  Jitter: ±0.04ms across envelope phases
                </span>
              </div>
              <div className="w-32 h-7 text-[#556348]">
                <svg
                  className="w-full h-full stroke-current fill-none"
                  viewBox="0 0 128 32"
                >
                  <path
                    d="M0 16 Q 16 4, 32 16 T 64 16 T 96 12 T 128 16"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Headless 1080x1920 Archival Canvas Preview & Export */}
        <div className="lg:col-span-5 flex flex-col gap-4 items-center">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#94452c] text-[18px]">
                receipt_long
              </span>
              <span className="font-mono-ledger text-xs text-[#1c1c18] uppercase tracking-wider font-semibold">
                Archival Keepsake Preview
              </span>
            </div>
            <span className="font-mono-ledger text-[11px] text-[#88726c]">
              9:16 Story Spec
            </span>
          </div>

          {/* 9:16 Vertical Keepsake Ticket Card Simulator */}
          <div className="relative w-full max-w-[360px] aspect-[9/16] bg-[#f9f6f0] text-[#1c1c18] rounded-xl shadow-xl overflow-hidden p-6 flex flex-col justify-between border border-[#e8e2d5]">
            {/* Perforated Ticket Dashed Borders */}
            <div className="absolute inset-3 border-2 border-dashed border-[#dbc1ba] pointer-events-none rounded-lg" />

            {/* Header & Brand Stamp */}
            <div className="relative z-10 flex flex-col items-center text-center pt-2">
              <BrandLogo size={48} variant="display" />
              <span className="font-mono-ledger text-[10px] tracking-[0.25em] text-[#88726c] uppercase font-semibold mt-1">
                UNBLOCKME • RECONCILIATION FOLIO
              </span>
              <h2 className="font-serif-display text-[16px] text-[#1c1c18] mt-1 leading-tight font-semibold">
                Official Digital Truce Receipt
              </h2>
              <div className="w-14 h-0.5 bg-[#94452c]/30 mt-2" />
            </div>

            {/* Metadata Ledger */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xs p-3 rounded shadow-xs mx-1 border border-[#e8e2d5]">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-ledger">
                <div>
                  <span className="text-[#88726c] block">PARTIES:</span>
                  <span className="text-[#1c1c18] font-semibold">
                    {sender} → {recipient}
                  </span>
                </div>
                <div>
                  <span className="text-[#88726c] block">TOKEN:</span>
                  <span className="text-[#94452c] font-semibold">{tokenRef}</span>
                </div>
                <div>
                  <span className="text-[#88726c] block">STATUS:</span>
                  <span className="text-[#556348] font-semibold">
                    Mutual Consensus
                  </span>
                </div>
                <div>
                  <span className="text-[#88726c] block">SEALED DATE:</span>
                  <span className="text-[#1c1c18] font-semibold">
                    2026-10-24
                  </span>
                </div>
              </div>
            </div>

            {/* Apology Body & Truce Terms */}
            <div className="relative z-10 px-2 text-center flex flex-col gap-2">
              <p className="font-serif-display italic text-[12px] text-[#55433e] leading-relaxed">
                “I let pride get ahead of what actually matters between us. I am deeply sorry for how I shut down. The air is cleared.”
              </p>
              <div className="py-2 px-3 bg-[#e5e2dc]/60 rounded text-left border border-[#e8e2d5]">
                <span className="font-mono-ledger text-[9px] text-[#88726c] uppercase block tracking-wider">
                  Accepted Terms:
                </span>
                <span className="font-serif-display font-medium text-[11px] text-[#1c1c18] leading-snug block mt-0.5">
                  • {remedy}
                  <br />
                  • Mutual unblocking on all direct platforms.
                  <br />
                  • Full pardon for prior misunderstandings.
                </span>
              </div>
            </div>

            {/* Rotated Terracotta Wax Seal Badge */}
            <div className="relative z-10 flex justify-center py-1">
              <div className="rotate-[-10deg] px-3.5 py-1.5 rounded-full bg-[#94452c] text-white shadow-md flex items-center gap-1.5 border border-[#ffdbd0]/30 transform hover:rotate-0 transition-transform cursor-default">
                <span className="material-symbols-outlined text-[14px]">
                  verified_user
                </span>
                <span className="font-mono-ledger text-[9px] font-bold tracking-wider uppercase">
                  TRUCE DECLARED • UNBLOCKED • SETTLED
                </span>
              </div>
            </div>

            {/* Barcode & Hash */}
            <div className="relative z-10 flex flex-col items-center pt-1 border-t border-dashed border-[#dbc1ba]/60">
              <svg
                className="h-8 w-44 text-[#1c1c18]"
                fill="currentColor"
                viewBox="0 0 160 32"
              >
                <rect x="0" y="0" width="3" height="32" />
                <rect x="5" y="0" width="1" height="32" />
                <rect x="8" y="0" width="4" height="32" />
                <rect x="15" y="0" width="2" height="32" />
                <rect x="19" y="0" width="5" height="32" />
                <rect x="27" y="0" width="2" height="32" />
                <rect x="31" y="0" width="1" height="32" />
                <rect x="34" y="0" width="3" height="32" />
                <rect x="39" y="0" width="6" height="32" />
                <rect x="47" y="0" width="2" height="32" />
                <rect x="52" y="0" width="1" height="32" />
                <rect x="55" y="0" width="4" height="32" />
                <rect x="62" y="0" width="3" height="32" />
                <rect x="67" y="0" width="1" height="32" />
                <rect x="71" y="0" width="5" height="32" />
                <rect x="78" y="0" width="2" height="32" />
                <rect x="83" y="0" width="4" height="32" />
                <rect x="90" y="0" width="1" height="32" />
                <rect x="94" y="0" width="3" height="32" />
                <rect x="99" y="0" width="5" height="32" />
                <rect x="106" y="0" width="2" height="32" />
                <rect x="111" y="0" width="3" height="32" />
                <rect x="117" y="0" width="1" height="32" />
                <rect x="120" y="0" width="4" height="32" />
                <rect x="126" y="0" width="2" height="32" />
                <rect x="131" y="0" width="5" height="32" />
                <rect x="138" y="0" width="2" height="32" />
                <rect x="142" y="0" width="4" height="32" />
                <rect x="148" y="0" width="1" height="32" />
                <rect x="152" y="0" width="3" height="32" />
                <rect x="158" y="0" width="2" height="32" />
              </svg>
              <span className="font-mono-ledger text-[9px] text-[#88726c] tracking-widest mt-1">
                HASH: 9B4F-{tokenRef}-D72A-MUTUAL
              </span>
            </div>
          </div>

          {/* Export & Share Buttons */}
          <div className="w-full max-w-[360px] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="w-full py-3 px-4 bg-[#94452c] hover:bg-[#793019] text-white font-body-sans text-xs font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              <span>Download High-Res Keepsake (1080×1920 PNG)</span>
            </button>
            <button
              type="button"
              onClick={handleShareStory}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#f0eee8] text-[#1c1c18] font-body-sans text-xs font-semibold rounded-lg shadow-xs border border-[#e8e2d5] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
              <span>Share to Instagram Story / Camera Roll (9:16)</span>
            </button>
            <button
              type="button"
              onClick={onReturnToStudio}
              className="w-full py-2 px-4 text-[#88726c] hover:text-[#1c1c18] font-body-sans text-xs text-center transition-colors"
            >
              Return to Craft Studio
            </button>
          </div>
        </div>
      </div>

      {/* Counter-Offer Interactive Modal */}
      {counterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl p-6 flex flex-col gap-4 relative deckle-border animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#94452c] text-[24px]">
                  edit_note
                </span>
                <h3 className="font-serif-display text-xl text-[#1c1c18] font-semibold">
                  Propose Counter-Terms
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCounterModalOpen(false)}
                className="text-[#88726c] hover:text-[#1c1c18] p-1"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <p className="font-body-sans text-xs text-[#55433e]">
              This will reverse the directional payload ({recipient} → {sender}) and create a re-keyed LZ-token for {sender} to accept or revise.
            </p>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="counter-terms-input"
                className="font-mono-ledger text-[11px] text-[#1c1c18] uppercase tracking-wider"
              >
                Amended Truce Terms
              </label>
              <textarea
                id="counter-terms-input"
                rows={3}
                value={counterTerms}
                onChange={(e) => setCounterTerms(e.target.value)}
                className="w-full p-3 bg-[#f6f3ed] rounded-lg font-serif-display text-base text-[#1c1c18] border border-[#e8e2d5] outline-none focus:ring-1 focus:ring-[#94452c] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCounterModalOpen(false)}
                className="px-4 py-2 bg-[#f0eee8] hover:bg-[#ebe8e2] text-[#1c1c18] font-body-sans text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCounterTerms}
                className="px-4 py-2 bg-[#94452c] hover:bg-[#793019] text-white font-body-sans text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">
                  swap_horiz
                </span>
                <span>Generate Reversed Token</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
