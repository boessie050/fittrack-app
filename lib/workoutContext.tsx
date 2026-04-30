"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ─── Types (mirrored from workout/page.tsx) ───────────────────────────────────

export type LocalSet = {
  id: string;
  key: string;
  type: "reps" | "duration";
  reps: number;
  weight: number;
  duration: number;
  done: boolean;
};

export type LocalExercise = {
  kind: "exercise";
  id: string;
  name: string;
  sets: LocalSet[];
  collapsed: boolean;
  setType: "reps" | "duration";
  restSeconds: number;
};

export type SupersetExercise = {
  id: string;
  name: string;
  setType: "reps" | "duration";
};

export type SupersetRound = {
  key: string;
  sets: Record<string, LocalSet>;
};

export type LocalSuperset = {
  kind: "superset";
  id: string;
  exercises: SupersetExercise[];
  rounds: SupersetRound[];
  restBetweenExercises: number;
  restBetweenRounds: number;
  collapsed: boolean;
};

export type WorkoutItem = LocalExercise | LocalSuperset;

export type ActiveWorkout = {
  name: string;
  startTime: number;
  items: WorkoutItem[];
};

// ─── Context ──────────────────────────────────────────────────────────────────

type WorkoutContextType = {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (name: string) => void;
  updateWorkout: (updater: (prev: ActiveWorkout) => ActiveWorkout) => void;
  clearWorkout: () => void;
};

const WorkoutContext = createContext<WorkoutContextType>({
  activeWorkout: null,
  startWorkout: () => {},
  updateWorkout: () => {},
  clearWorkout: () => {},
});

const SESSION_KEY = "fittrack_active_workout";

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setActiveWorkout(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist to sessionStorage on every change
  useEffect(() => {
    try {
      if (activeWorkout) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(activeWorkout));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {}
  }, [activeWorkout]);

  const startWorkout = useCallback((name: string) => {
    setActiveWorkout({ name, startTime: Date.now(), items: [] });
  }, []);

  const updateWorkout = useCallback((updater: (prev: ActiveWorkout) => ActiveWorkout) => {
    setActiveWorkout((prev) => (prev ? updater(prev) : prev));
  }, []);

  const clearWorkout = useCallback(() => {
    setActiveWorkout(null);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  return (
    <WorkoutContext.Provider value={{ activeWorkout, startWorkout, updateWorkout, clearWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}
