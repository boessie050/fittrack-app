"use client";

import { usePathname, useRouter } from "next/navigation";
import { useWorkout } from "@/lib/workoutContext";
import { Dumbbell, ChevronRight, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActiveWorkoutBanner() {
  const { activeWorkout } = useWorkout();
  const pathname = usePathname();
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeWorkout) return;
    const update = () => setElapsed(Math.floor((Date.now() - activeWorkout.startTime) / 60000));
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [activeWorkout]);

  // Only show on pages OTHER than /workout
  if (!activeWorkout || pathname === "/workout") return null;

  const totalSets = activeWorkout.items.reduce((sum, item) => {
    if (item.kind === "exercise") return sum + item.sets.length;
    return sum + item.rounds.length * item.exercises.length;
  }, 0);

  const doneSets = activeWorkout.items.reduce((sum, item) => {
    if (item.kind === "exercise") return sum + item.sets.filter((s) => s.done).length;
    return sum + item.rounds.reduce((r, round) =>
      r + Object.values(round.sets).filter((s) => s.done).length, 0);
  }, 0);

  return (
    <button
      onClick={() => router.push("/workout")}
      className="w-full bg-green-700 hover:bg-green-600 transition-colors px-4 py-2.5 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-green-500/30 flex items-center justify-center shrink-0">
          <Dumbbell className="w-4 h-4 text-green-200" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white leading-tight">{activeWorkout.name}</p>
          <p className="text-xs text-green-200">
            {doneSets}/{totalSets} sets · {elapsed}m
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-green-200 text-xs font-medium shrink-0">
        <Timer className="w-3.5 h-3.5" />
        Ga terug
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}
