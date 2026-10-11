import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';

import BrandLogo from './components/BrandLogo';
import StudioScreen from './components/StudioScreen';
import RitualScreen from './components/RitualScreen';
import PayoffScreen from './components/PayoffScreen';

import soundEngine from './engine/audio';
import { deserializeHash, serializeState } from './engine/stateSerializer';

const DEFAULT_LETTER_STATE = {
  recipient: 'Alex',
  sender: 'Jordan',
  relationship: 'situationship',
  gravity: 3,
  ritual: 'shackle',
  tokens: {
    trigger: 'I ghosted when things got real',
    fault: 'let my defensiveness do the talking',
    remedy: 'dinner at your favorite spot, my bill, no excuses'
  },
  timestamp: Date.now(),
  counterTerms: ''
};

export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'ritual' | 'payoff'
  const [letterData, setLetterData] = useState(DEFAULT_LETTER_STATE);
  const [soundActive, setSoundActive] = useState(!soundEngine.isMuted());

  // Listen to hash fragment changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('p=') || hash.length > 5)) {
        const parsed = deserializeHash(hash);
        if (parsed) {
          setLetterData(parsed);
          setActiveTab('ritual');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab) => {
    soundEngine.playTick(600, 0.015);
    setActiveTab(tab);
  };

  const handleSoundToggle = () => {
    const muted = soundEngine.toggleMute();
    setSoundActive(!muted);
    if (!muted) {
      soundEngine.playTick(720, 0.02);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#1c1c18] font-body-sans antialiased selection:bg-[#ffdbd0] selection:text-[#3a0a00]">
      {/* Fixed Sticky Header Bar */}
      <header className="sticky top-0 z-40 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
        <div className="h-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleTabChange('studio')}
          >
            <BrandLogo size={36} variant="display" />
            <div className="flex flex-col">
              <span className="font-serif-display text-xl text-[#1c1c18] font-semibold tracking-tight leading-tight">
                UnBlockMe
              </span>
              <span className="font-mono-ledger text-[11px] text-[#88726c] leading-tight">
                Zero-Server Reconciliation Engine
              </span>
            </div>
          </div>

          {/* 3-Step Process Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#ebe8e2]/70 rounded-xl border border-[#e8e2d5]">
            <button
              type="button"
              onClick={() => handleTabChange('studio')}
              className={`font-body-sans text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#94452c] text-white font-semibold shadow-xs'
                  : 'text-[#55433e] hover:text-[#1c1c18]'
              }`}
            >
              1. The Studio (Craft)
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('ritual')}
              className={`font-body-sans text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'ritual'
                  ? 'bg-[#94452c] text-white font-semibold shadow-xs'
                  : 'text-[#55433e] hover:text-[#1c1c18]'
              }`}
            >
              2. Ritual Stage (Interactive Gate)
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('payoff')}
              className={`font-body-sans text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'payoff'
                  ? 'bg-[#94452c] text-white font-semibold shadow-xs'
                  : 'text-[#55433e] hover:text-[#1c1c18]'
              }`}
            >
              3. Keepsake &amp; Truce Receipt (Archival)
            </button>
          </nav>

          {/* Sound Synthesizer & Telemetry Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#E8E2D5] shadow-inner">
              <button
                type="button"
                onClick={handleSoundToggle}
                className="flex items-center gap-1 text-[#556348] hover:text-[#1c1c18] transition-colors cursor-pointer"
                title={soundActive ? 'Audio Synthesizer Active' : 'Audio Synthesizer Muted'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {soundActive ? 'graphic_eq' : 'volume_off'}
                </span>
                {soundActive && (
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-[#556348] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[#556348] animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-[#556348] animate-pulse" />
                  </span>
                )}
              </button>
              <div className="h-3 w-px bg-[#E8E2D5]" />
              <span className="font-mono-ledger text-[11px] text-[#556348] font-semibold">
                8ms
              </span>
              <div className="h-3 w-px bg-[#E8E2D5]" />
              <span className="font-mono-ledger text-[11px] text-[#55433e]">
                Zero Server • Client-Side
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#94452c] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'studio' && (
          <StudioScreen
            initialData={letterData}
            onSimulateRecipient={(newData) => {
              setLetterData(newData);
              setActiveTab('ritual');
            }}
          />
        )}

        {activeTab === 'ritual' && (
          <RitualScreen
            letterData={letterData}
            onAcceptTruce={() => {
              setActiveTab('payoff');
            }}
            onCounterOffer={() => {
              setActiveTab('payoff');
            }}
            onSaveKeepsake={() => {
              setActiveTab('payoff');
            }}
          />
        )}

        {activeTab === 'payoff' && (
          <PayoffScreen
            letterData={letterData}
            onProposeCounterOffer={(counterData) => {
              setLetterData(counterData);
              setActiveTab('studio');
            }}
            onReturnToStudio={() => {
              setActiveTab('studio');
            }}
          />
        )}
      </main>

      {/* Archival Folio Footer */}
      <footer className="w-full bg-[#f0eee8] border-t border-[#E8E2D5] py-4 mt-auto">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2 font-mono-ledger text-[11px] text-[#88726c]">
          <div>
            Footprint: &lt; 85KB • Web Audio Synthesizer Active • LZ-String State Compression
          </div>
          <div className="text-right">
            Archival Folio Standard • Self-Contained Ephemeral Proof
          </div>
        </div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
