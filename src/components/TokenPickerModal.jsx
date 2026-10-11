import React, { useState, useEffect } from 'react';
import soundEngine from '../engine/audio';

export default function TokenPickerModal({
  isOpen,
  tokenKey,
  currentValue,
  options = [],
  title = 'Choose Alternative Phrasing',
  category = 'Offering Phrase',
  onSelect,
  onClose
}) {
  const [customText, setCustomText] = useState(currentValue || '');

  useEffect(() => {
    if (isOpen) {
      setCustomText(currentValue || '');
    }
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const handleSelectOption = (opt) => {
    soundEngine.playTick(680, 0.02);
    onSelect(opt);
    onClose();
  };

  const handleApplyCustom = (e) => {
    e?.preventDefault();
    if (customText.trim()) {
      soundEngine.playTick(720, 0.02);
      onSelect(customText.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#ffffff] w-full max-w-lg rounded-xl shadow-2xl p-6 sm:p-7 space-y-5 transform transition-all deckle-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
          <div>
            <span className="font-mono-ledger text-[11px] uppercase tracking-wider text-[#88726c]">
              Token // {category}
            </span>
            <h3 className="font-serif-display text-xl text-[#1c1c18] font-semibold mt-0.5">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTick(420, 0.015);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#f0eee8] hover:bg-[#ebe8e2] flex items-center justify-center text-[#55433e] transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Preset Bank Options */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          <p className="font-mono-ledger text-[11px] text-[#88726c] uppercase tracking-wider">
            Curated Expressions:
          </p>
          {options.map((opt, idx) => {
            const isSelected = opt === currentValue;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-3 rounded-lg font-serif-display text-[15px] sm:text-[16px] flex items-center justify-between transition-all group ${
                  isSelected
                    ? 'bg-[#ffdbd0]/60 text-[#94452c] font-semibold ring-1 ring-[#94452c]'
                    : 'bg-[#f6f3ed] hover:bg-[#ebe8e2] text-[#1c1c18]'
                }`}
              >
                <span className="pr-2 leading-snug">“{opt}”</span>
                <span className="material-symbols-outlined text-[16px] text-[#88726c] group-hover:text-[#94452c] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                  arrow_circle_right
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleApplyCustom} className="space-y-2 pt-2 border-t border-[#E8E2D5]">
          <label
            htmlFor="custom-token-input"
            className="block font-mono-ledger text-[11px] text-[#88726c] uppercase tracking-wider"
          >
            Or compose your bespoke phrasing:
          </label>
          <div className="flex gap-2">
            <input
              id="custom-token-input"
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type your own phrase..."
              className="flex-1 px-3.5 py-2.5 bg-[#f6f3ed] rounded-lg font-body-sans text-sm text-[#1c1c18] focus:outline-none focus:ring-1 focus:ring-[#94452c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] border border-[#e5e2dc]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#556348] text-white rounded-lg font-body-sans text-sm font-semibold hover:bg-[#434e38] transition-all flex items-center gap-1 active:scale-95"
            >
              <span>Apply</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#88726c] hover:text-[#1c1c18] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
