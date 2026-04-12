"use client";

import type { MuscleGroup } from "@/lib/exerciseDatabase";

const PRIMARY_COLOR = "#22c55e";   // green-500
const SECONDARY_COLOR = "#fb923c"; // orange-400
const INACTIVE_COLOR = "#1f2937";  // gray-800
const OUTLINE_COLOR = "#374151";   // gray-700

type Props = {
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
  view: "front" | "back";
};

export default function MuscleMap({ primary, secondary, view }: Props) {
  function fill(muscle: MuscleGroup) {
    if (primary.includes(muscle)) return PRIMARY_COLOR;
    if (secondary.includes(muscle)) return SECONDARY_COLOR;
    return INACTIVE_COLOR;
  }

  return (
    <svg
      viewBox="0 0 200 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* ── Body outline ── */}
      {/* Head */}
      <ellipse cx="100" cy="30" rx="22" ry="26" fill="#111827" stroke={OUTLINE_COLOR} strokeWidth="1.5" />
      {/* Neck */}
      <rect x="91" y="52" width="18" height="14" rx="4" fill="#111827" stroke={OUTLINE_COLOR} strokeWidth="1.5" />
      {/* Torso */}
      <path d="M65 66 Q60 80 58 120 Q56 145 60 165 L140 165 Q144 145 142 120 Q140 80 135 66 Z"
        fill="#111827" stroke={OUTLINE_COLOR} strokeWidth="1.5" />

      {view === "front" ? (
        <>
          {/* ── FRONT MUSCLES ── */}

          {/* Chest (pectorals) — two lobes */}
          <ellipse cx="85" cy="92" rx="18" ry="14" fill={fill("chest")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <ellipse cx="115" cy="92" rx="18" ry="14" fill={fill("chest")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Shoulders (front deltoids) */}
          <ellipse cx="60" cy="80" rx="13" ry="10" fill={fill("shoulders")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <ellipse cx="140" cy="80" rx="13" ry="10" fill={fill("shoulders")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Biceps — upper arm front */}
          <rect x="42" y="92" width="14" height="40" rx="7" fill={fill("biceps")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="144" y="92" width="14" height="40" rx="7" fill={fill("biceps")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Forearms */}
          <rect x="40" y="136" width="12" height="36" rx="6" fill={INACTIVE_COLOR} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="148" y="136" width="12" height="36" rx="6" fill={INACTIVE_COLOR} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Core (abs) */}
          <rect x="82" y="108" width="14" height="10" rx="3" fill={fill("core")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="104" y="108" width="14" height="10" rx="3" fill={fill("core")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="82" y="121" width="14" height="10" rx="3" fill={fill("core")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="104" y="121" width="14" height="10" rx="3" fill={fill("core")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="82" y="134" width="14" height="10" rx="3" fill={fill("core")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="104" y="134" width="14" height="10" rx="3" fill={fill("core")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Hips / pelvis */}
          <path d="M60 165 Q80 175 100 175 Q120 175 140 165 L140 185 Q120 195 100 195 Q80 195 60 185 Z"
            fill="#111827" stroke={OUTLINE_COLOR} strokeWidth="1.5" />

          {/* Quads */}
          <path d="M62 185 Q58 210 60 240 Q70 250 82 245 Q88 220 86 190 Z"
            fill={fill("quads")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <path d="M138 185 Q142 210 140 240 Q130 250 118 245 Q112 220 114 190 Z"
            fill={fill("quads")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Calves front */}
          <path d="M62 255 Q58 280 60 310 Q68 318 76 312 Q80 285 78 252 Z"
            fill={fill("calves")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <path d="M138 255 Q142 280 140 310 Q132 318 124 312 Q120 285 122 252 Z"
            fill={fill("calves")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
        </>
      ) : (
        <>
          {/* ── BACK MUSCLES ── */}

          {/* Traps */}
          <path d="M80 66 Q100 60 120 66 Q110 85 100 88 Q90 85 80 66 Z"
            fill={fill("shoulders")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Rear Deltoids */}
          <ellipse cx="60" cy="80" rx="13" ry="10" fill={fill("shoulders")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <ellipse cx="140" cy="80" rx="13" ry="10" fill={fill("shoulders")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Lats (back) */}
          <path d="M65 88 Q58 110 60 140 Q70 148 85 140 Q88 115 86 88 Z"
            fill={fill("back")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <path d="M135 88 Q142 110 140 140 Q130 148 115 140 Q112 115 114 88 Z"
            fill={fill("back")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Lower back */}
          <rect x="82" y="138" width="36" height="22" rx="4" fill={fill("back")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Triceps — upper arm back */}
          <rect x="42" y="92" width="14" height="40" rx="7" fill={fill("triceps")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="144" y="92" width="14" height="40" rx="7" fill={fill("triceps")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Forearms */}
          <rect x="40" y="136" width="12" height="36" rx="6" fill={INACTIVE_COLOR} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <rect x="148" y="136" width="12" height="36" rx="6" fill={INACTIVE_COLOR} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Glutes */}
          <ellipse cx="82" cy="180" rx="22" ry="18" fill={fill("glutes")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <ellipse cx="118" cy="180" rx="22" ry="18" fill={fill("glutes")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Hamstrings */}
          <path d="M62 192 Q58 218 60 248 Q70 256 82 250 Q86 222 84 192 Z"
            fill={fill("hamstrings")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <path d="M138 192 Q142 218 140 248 Q130 256 118 250 Q114 222 116 192 Z"
            fill={fill("hamstrings")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />

          {/* Calves back */}
          <path d="M62 258 Q58 282 60 312 Q68 320 76 314 Q80 286 78 256 Z"
            fill={fill("calves")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
          <path d="M138 258 Q142 282 140 312 Q132 320 124 314 Q120 286 122 256 Z"
            fill={fill("calves")} stroke={OUTLINE_COLOR} strokeWidth="1" opacity="0.9" />
        </>
      )}

      {/* Feet */}
      <ellipse cx="70" cy="320" rx="14" ry="8" fill="#111827" stroke={OUTLINE_COLOR} strokeWidth="1.5" />
      <ellipse cx="130" cy="320" rx="14" ry="8" fill="#111827" stroke={OUTLINE_COLOR} strokeWidth="1.5" />
    </svg>
  );
}
