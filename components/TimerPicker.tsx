"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const ITEM_HEIGHT = 44; // px per item in the wheel
const VISIBLE_ITEMS = 5; // items visible at once (centre = selected)

const MINUTES = Array.from({ length: 181 }, (_, i) => i);      // 0–180 min
const SECONDS = Array.from({ length: 60 }, (_, i) => i);        // 0–59 sec

interface WheelProps {
  items: number[];
  selected: number;
  onSelect: (value: number) => void;
  label: string;
}

function Wheel({ items, selected, onSelect, label }: WheelProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const selectedIndex = items.indexOf(selected);

  // Scroll to selected item
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = selectedIndex * ITEM_HEIGHT;
  }, [selectedIndex]);

  // Snap to nearest item on scroll end
  const snapToNearest = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    el.scrollTop = clamped * ITEM_HEIGHT;
    onSelect(items[clamped]);
  }, [items, onSelect]);

  // Native scroll handler (mouse wheel + trackpad)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(snapToNearest, 120);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => { el.removeEventListener("scroll", handleScroll); clearTimeout(timer); };
  }, [snapToNearest]);

  // Touch drag
  function onTouchStart(e: React.TouchEvent) {
    const el = listRef.current;
    if (!el) return;
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    startScroll.current = el.scrollTop;
  }
  function onTouchMove(e: React.TouchEvent) {
    const el = listRef.current;
    if (!el || !isDragging.current) return;
    const dy = startY.current - e.touches[0].clientY;
    el.scrollTop = startScroll.current + dy;
  }
  function onTouchEnd() {
    isDragging.current = false;
    snapToNearest();
  }

  // Mouse drag
  function onMouseDown(e: React.MouseEvent) {
    const el = listRef.current;
    if (!el) return;
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = el.scrollTop;
    e.preventDefault();
  }
  function onMouseMove(e: React.MouseEvent) {
    const el = listRef.current;
    if (!el || !isDragging.current) return;
    const dy = startY.current - e.clientY;
    el.scrollTop = startScroll.current + dy;
  }
  function onMouseUp() {
    if (!isDragging.current) return;
    isDragging.current = false;
    snapToNearest();
  }

  const wheelHeight = VISIBLE_ITEMS * ITEM_HEIGHT;
  const padding = Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT;

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <div
        className="relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700"
        style={{ width: 72, height: wheelHeight }}
      >
        {/* Selection highlight */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-10 border-y border-blue-500/60 bg-blue-500/10"
          style={{ top: Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT, height: ITEM_HEIGHT }}
        />
        {/* Fade top */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none z-10" />
        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none z-10" />

        <ul
          ref={listRef}
          className="overflow-y-scroll"
          style={{
            height: wheelHeight,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingTop: padding,
            paddingBottom: padding,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {items.map((val) => {
            const isSelected = val === selected;
            return (
              <li
                key={val}
                onClick={() => {
                  onSelect(val);
                  if (listRef.current) listRef.current.scrollTop = items.indexOf(val) * ITEM_HEIGHT;
                }}
                className={`flex items-center justify-center cursor-pointer transition-all ${
                  isSelected
                    ? "text-white font-bold text-xl"
                    : "text-gray-500 text-base"
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                {String(val).padStart(2, "0")}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

interface TimerPickerProps {
  /** Initial value in seconds */
  initialSeconds?: number;
  onChange: (totalSeconds: number) => void;
}

export default function TimerPicker({ initialSeconds = 90, onChange }: TimerPickerProps) {
  const [minutes, setMinutes] = useState(Math.floor(initialSeconds / 60));
  const [seconds, setSeconds] = useState(initialSeconds % 60);

  function handleMinutes(m: number) {
    setMinutes(m);
    onChange(m * 60 + seconds);
  }
  function handleSeconds(s: number) {
    setSeconds(s);
    onChange(minutes * 60 + s);
  }

  return (
    <div className="flex items-center gap-3">
      <Wheel
        items={MINUTES}
        selected={minutes}
        onSelect={handleMinutes}
        label="min"
      />
      <span className="text-2xl font-bold text-gray-400 pb-1">:</span>
      <Wheel
        items={SECONDS}
        selected={seconds}
        onSelect={handleSeconds}
        label="sec"
      />
    </div>
  );
}
