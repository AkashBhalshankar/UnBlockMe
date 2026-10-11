import React, { useState } from 'react';

/**
 * BrandLogo: Option 16 - Open Shackle Motif
 * Features interlocking chat bubbles forming the padlock body with an open arch.
 * Supports:
 * - 'display': Rich high-res display with brush-ink detail
 * - 'micro': Crisp 16px/24px/32px clean vector
 * - 'animated': Dynamic shackle arch that responds to lock/unlock states
 */

export const BRAND_ASSET_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1VjVMcL7nGX7cb9H5jbPYaJGK-2ZJbaQ2NTWIfQd5h4GesyXvjzbr8fAAkgIM32xOkf95Ky424v4_sg0fIsw0yOrGMupdC-qiGuOc2hXGKhJMcGG-_q28zs7R7kzc-a-sz3xl8HHkF_CPgfy_hCB8Akd-p_WUD-_sAzgDji5Gzx9vK9zbaFa1-K5VR3tY5xztOqctKsJaIlh6LeTlv6REoJlFfKTMAAWqj-R114Az7YbAL_O7pVNCoDlw';

export default function BrandLogo({
  variant = 'display',
  size = 32,
  className = '',
  isOpen = false,
  useRaster = true
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (variant === 'micro') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${className}`}
        aria-label="UnBlockMe Open Shackle Icon"
      >
        {/* Shackle Arch */}
        <path
          d={isOpen ? 'M10 14V8a6 6 0 0 1 12 0v2' : 'M10 14V8a6 6 0 0 1 12 0v6'}
          stroke="#94452c"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        {/* Chat bubble padlock body */}
        <path
          d="M7 14h18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H11l-4 3v-3a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"
          fill="#556348"
        />
        {/* Inner keyhole */}
        <circle cx="16" cy="20.5" r="1.75" fill="#fcf9f3" />
        <path d="M15.2 21.5h1.6l.4 3h-2.4l.4-3z" fill="#fcf9f3" />
      </svg>
    );
  }

  if (useRaster && !imgFailed && (variant === 'display' || variant === 'header')) {
    return (
      <img
        src={BRAND_ASSET_URL}
        alt="UnBlockMe Option 16 Logo"
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className={`object-contain mix-blend-multiply ${className}`}
        style={{ width: `${size}px`, height: 'auto', maxHeight: `${size}px` }}
      />
    );
  }

  // Pure Vector Fallback / Display
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      aria-label="UnBlockMe Logo"
    >
      {/* Dynamic Open Shackle Arch */}
      <path
        d={
          isOpen
            ? 'M20 28V16a12 12 0 0 1 24 0v4'
            : 'M20 28V16a12 12 0 0 1 24 0v12'
        }
        stroke="#94452c"
        strokeWidth="5"
        strokeLinecap="round"
        className="transition-all duration-500 origin-bottom"
        style={{
          transform: isOpen ? 'translateY(-4px)' : 'none'
        }}
      />
      {/* Primary chat bubble / padlock body */}
      <rect x="12" y="27" width="40" height="30" rx="8" fill="#f0eee8" />
      <rect
        x="13"
        y="28"
        width="38"
        height="28"
        rx="7"
        fill="#ffffff"
        stroke="#e5e2dc"
        strokeWidth="1.5"
      />

      {/* Interlocking Secondary Bubble Accent */}
      <circle cx="32" cy="41" r="13" fill="#94452c" fillOpacity="0.1" />

      {/* Keyhole */}
      <circle cx="32" cy="38" r="3.5" fill="#556348" />
      <path
        d="M30.5 40h3l1 6.5h-5l1-6.5z"
        fill="#556348"
      />
    </svg>
  );
}
