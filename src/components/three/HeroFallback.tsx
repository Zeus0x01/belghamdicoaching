"use client";

import { PALETTE_CHIPS } from "@/lib/muscle-palette";

export function HeroFallback() {
  const chipColors = [PALETTE_CHIPS[0], PALETTE_CHIPS[1], PALETTE_CHIPS[2], PALETTE_CHIPS[6]];
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
      <div className="relative opacity-90">
        <svg width="340" height="460" viewBox="0 0 340 460" fill="none" aria-hidden="true">
          <ellipse cx="170" cy="60" rx="26" ry="30" stroke="#77746E" strokeWidth="1.5" />
          <path d="M130 105 h80 l14 90 h-108 z" stroke="#77746E" strokeWidth="1.5" />
          <path d="M112 108 l-24 150 M228 108 l24 150" stroke="#77746E" strokeWidth="1.5" />
          <path d="M116 258 l20 92 h14 l-6 -92 M224 258 l-20 92 h-14 l6 -92" stroke="#77746E" strokeWidth="1.5" />
          <circle cx="140" cy="130" r="5" fill={chipColors[0].color} />
          <circle cx="200" cy="130" r="5" fill={chipColors[1].color} />
          <circle cx="170" cy="170" r="5" fill={chipColors[2].color} />
          <circle cx="196" cy="392" r="4" fill={chipColors[3].color} />
        </svg>
      </div>
    </div>
  );
}
