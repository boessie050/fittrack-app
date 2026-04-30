"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  generateId, type Exercise, type Set,
  getWorkoutTemplates, saveWorkoutTemplate, deleteWorkoutTemplate,
  type WorkoutTemplate,
} from "@/lib/store";
import { addWorkoutToDB, getPreviousExerciseDataFromDB } from "@/lib/supabase-store";
import { useWorkout } from "@/lib/workoutContext";
import ExercisePicker from "@/components/ExercisePicker";
import TimerPicker from "@/components/TimerPicker";
import {
  Plus, Trash2, CheckCircle, X,
  ChevronDown, ChevronUp, Dumbbell,
  Timer, Hash, SkipForward, Settings2, Layers, BookmarkPlus, BookOpen, Trash, History,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalSet = {
  id: string;
  key: string;
  type: "reps" | "duration";
  reps: number;
  weight: number;
  duration: number;
  done: boolean;
};

type LocalExercise = {
  id: string;
  name: string;
  sets: LocalSet[];
  collapsed: boolean;
  setType: "reps" | "duration";
  restSeconds: number;
};

type SupersetExercise = {
  id: string;
  name: string;
  setType: "reps" | "duration";
};

// A "round" in a superset = one set per exercise
type SupersetRound = {
  key: string;
  // sets indexed by exercise id
  sets: Record<string, LocalSet>;
};

type LocalSuperset = {
  id: string;
  kind: "superset";
  exercises: SupersetExercise[];
  rounds: SupersetRound[];
  restBetweenExercises: number; // rest between A→B within a round
  restBetweenRounds: number;    // rest after completing a full round
  collapsed: boolean;
};

// A workout item is either a regular exercise or a superset
type WorkoutItem =
  | (LocalExercise & { kind: "exercise" })
  | LocalSuperset;

// ─── Audio pling ──────────────────────────────────────────────────────────────

function playTimerDone() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    // Two-tone pling: high then slightly lower
    [[880, 0, 0.15], [660, 0.18, 0.25]].forEach(([freq, start, end]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + end);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + end);
    });
  } catch {
    // Audio not supported — silent fail
  }
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown() {
  const [state, setState] = useState<{ remaining: number; total: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start(seconds: number) {
    if (seconds <= 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState({ remaining: seconds, total: seconds });
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev || prev.remaining <= 1) {
          clearInterval(intervalRef.current!);
          playTimerDone();
          return null;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  }

  function skip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState(null);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  return { state, start, skip };
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <p className="text-sm text-gray-200 text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 text-sm transition-colors">
            Annuleren
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors">
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DurationInput ────────────────────────────────────────────────────────────
// Shows the same iPhone-style scroll wheel as the rest timer

function DurationInput({
  value,
  onChange,
}: {
  value: number; // total seconds
  onChange: (seconds: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  const label = mins > 0
    ? `${mins}m${secs > 0 ? ` ${secs}s` : ""}`
    : secs > 0 ? `${secs}s` : "—";

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-200 hover:border-blue-500 transition-colors"
      >
        <Timer className="w-3.5 h-3.5 text-blue-400" />
        {label}
      </button>
      {open && (
        <div className="flex flex-col items-center gap-2 bg-gray-800/80 rounded-xl p-3 border border-gray-700 w-full">
          <TimerPicker initialSeconds={value} onChange={onChange} />
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-green-400 hover:text-green-300 border border-green-700/40 rounded-lg px-4 py-1 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function RestCountdown({ remaining, total, onSkip }: { remaining: number; total: number; onSkip: () => void }) {
  const progress = remaining / total;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-6 h-6 shrink-0">
        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#1e3a5f" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 15}`}
            strokeDashoffset={`${2 * Math.PI * 15 * (1 - progress)}`}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: "7px", fontWeight: 700, color: "#93c5fd" }}>{remaining}</span>
      </div>
      <span className="text-xs text-blue-300 font-semibold">
        {mins > 0 ? `${mins}m${secs > 0 ? ` ${secs}s` : ""}` : `${secs}s`} rest
      </span>
      <button onClick={onSkip} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-200 border border-blue-700/40 rounded-lg px-2 py-0.5 transition-colors">
        <SkipForward className="w-3 h-3" /> Skip
      </button>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60); const sec = s % 60;
  if (m === 0) return `${sec}s`;
  if (sec === 0) return `${m}m`;
  return `${m}m${sec}s`;
}

function TimerConfig({ label, seconds, onChange }: { label: string; seconds: number; onChange: (s: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors">
        <Settings2 className="w-3 h-3" /> {label}: {formatTime(seconds)}
      </button>
      {open && (
        <div className="mt-2 flex flex-col items-center gap-2 bg-gray-800/60 rounded-xl p-3">
          <p className="text-xs text-gray-400">{label}</p>
          <TimerPicker initialSeconds={seconds} onChange={onChange} />
          <button onClick={() => setOpen(false)}
            className="text-xs text-green-400 hover:text-green-300 border border-green-700/40 rounded-lg px-4 py-1 transition-colors">
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ExerciseCard ─────────────────────────────────────────────────────────────

function ExerciseCard({
  ex, exIdx, onToggleCollapse, onRemove, onToggleType,
  onRestChange, onAddSet, onRemoveSet, onUpdateSet,
}: {
  ex: LocalExercise & { kind: "exercise" };
  exIdx: number;
  onToggleCollapse: () => void;
  onRemove: () => void;
  onToggleType: () => void;
  onRestChange: (s: number) => void;
  onAddSet: () => void;
  onRemoveSet: (key: string) => void;
  onUpdateSet: (key: string, field: "reps" | "weight" | "duration" | "done", val: string | boolean) => void;
}) {
  const { state: restState, start: startRest, skip: skipRest } = useCountdown();
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmRemoveSet, setConfirmRemoveSet] = useState<string | null>(null);
  const [showPrevWeights, setShowPrevWeights] = useState(false);
  const [prevData, setPrevData] = useState<Awaited<ReturnType<typeof getPreviousExerciseDataFromDB>>>(null);
  const doneSets = ex.sets.filter((s) => s.done).length;

  async function handleShowPrevWeights() {
    const data = await getPreviousExerciseDataFromDB(ex.name);
    setPrevData(data);
    setShowPrevWeights(true);
  }

  function handleCheckSet(setKey: string, currentDone: boolean) {
    const newDone = !currentDone;
    onUpdateSet(setKey, "done", newDone);
    if (newDone) {
      if (ex.restSeconds > 0) startRest(ex.restSeconds);
    } else {
      skipRest();
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-mono w-5 text-center">{exIdx + 1}</span>
            <Dumbbell className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-sm">{ex.name}</span>
            {doneSets > 0 && (
              <span className="text-xs text-green-400 bg-green-600/15 px-2 py-0.5 rounded-full">
                {doneSets}/{ex.sets.length} done
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleShowPrevWeights} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-blue-400" title="Vorige gewichten">
              <History className="w-4 h-4" />
            </button>
            <button onClick={onToggleCollapse} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400">
              {ex.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button onClick={() => {
              ex.sets.some((s) => s.done || s.weight > 0) ? setConfirmRemove(true) : onRemove();
            }} className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-500 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onToggleType}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
              ex.setType === "duration"
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
            }`}>
            {ex.setType === "duration" ? <><Hash className="w-3 h-3" /> Switch to reps</> : <><Timer className="w-3 h-3" /> Switch to time</>}
          </button>
          <div className="w-px h-3 bg-gray-700" />
          {restState ? (
            <RestCountdown remaining={restState.remaining} total={restState.total} onSkip={skipRest} />
          ) : (
            <button onClick={() => setShowTimerPicker((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors">
              <Settings2 className="w-3 h-3" /> Rest: {formatTime(ex.restSeconds)}
            </button>
          )}
        </div>
        {showTimerPicker && !restState && (
          <div className="pt-1 pb-2 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400">Set rest duration</p>
            <TimerPicker initialSeconds={ex.restSeconds} onChange={onRestChange} />
            <button onClick={() => setShowTimerPicker(false)}
              className="text-xs text-green-400 hover:text-green-300 border border-green-700/40 rounded-lg px-4 py-1.5 transition-colors">Done</button>
          </div>
        )}
      </div>

      {!ex.collapsed && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-12 text-xs text-gray-500 font-medium px-1">
            <span className="col-span-1">Set</span>
            <span className="col-span-3 text-center">{ex.setType === "duration" ? "Time" : "Reps"}</span>
            <span className="col-span-4 text-center">Weight (kg)</span>
            <span className="col-span-2 text-center">Done</span>
            <span className="col-span-2" />
          </div>
          {ex.sets.map((set, setIdx) => (
            <div key={set.key} className={`grid grid-cols-12 items-center gap-1.5 transition-opacity ${set.done ? "opacity-50" : ""}`}>
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-mono">{setIdx + 1}</span>
              </div>
              <div className="col-span-3">
                {ex.setType === "duration" ? (
                  <DurationInput
                    value={set.duration}
                    onChange={(s) => onUpdateSet(set.key, "duration", String(s))}
                  />
                ) : (
                  <input type="number" min={0}
                    value={set.reps || ""}
                    onChange={(e) => onUpdateSet(set.key, "reps", e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-center text-sm focus:outline-none focus:border-green-500"
                    placeholder="0" />
                )}
              </div>
              <div className="col-span-4">
                <input type="number" min={0} step={0.5} value={set.weight || ""}
                  onChange={(e) => onUpdateSet(set.key, "weight", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-center text-sm focus:outline-none focus:border-green-500"
                  placeholder="0" />
              </div>
              <div className="col-span-2 flex justify-center">
                <button onClick={() => handleCheckSet(set.key, set.done)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    set.done ? "bg-green-600 border-green-600 text-white scale-110" : "border-gray-600 hover:border-green-500 text-transparent hover:text-green-500"
                  }`}><CheckCircle className="w-4 h-4" /></button>
              </div>
              <div className="col-span-2 flex justify-center">
                <button onClick={() => {
                  (set.done || set.weight > 0) ? setConfirmRemoveSet(set.key) : onRemoveSet(set.key);
                }}
                  className="p-1 rounded hover:bg-red-900/30 text-gray-600 hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button onClick={onAddSet}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-green-400 hover:text-green-300 border border-dashed border-green-700/50 hover:border-green-600 rounded-lg py-2 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Set
          </button>
        </div>
      )}

      {confirmRemove && (
        <ConfirmDialog
          message={`Wil je "${ex.name}" verwijderen?`}
          onConfirm={() => { setConfirmRemove(false); onRemove(); }}
          onCancel={() => setConfirmRemove(false)}
        />
      )}
      {confirmRemoveSet && (
        <ConfirmDialog
          message="Wil je deze set verwijderen?"
          onConfirm={() => { onRemoveSet(confirmRemoveSet); setConfirmRemoveSet(null); }}
          onCancel={() => setConfirmRemoveSet(null)}
        />
      )}
      {showPrevWeights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowPrevWeights(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-xs shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" /> Vorige sessie
              </span>
              <button onClick={() => setShowPrevWeights(false)} className="p-1 rounded hover:bg-gray-800 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2 font-medium">{ex.name}</p>
            {prevData ? (
              <>
                <p className="text-xs text-gray-600 mb-3">
                  {new Date(prevData.date).toLocaleDateString("nl-NL")} · {prevData.workoutName}
                </p>
                <div className="space-y-1.5">
                  {prevData.sets.map((s: { reps: number; weight: number }, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-400">Set {i + 1}</span>
                      <span className="text-sm font-semibold text-white">
                        {s.reps > 0 ? `${s.reps} reps` : "—"}
                        {s.weight > 0 && <span className="text-gray-400 font-normal ml-1.5">@ {s.weight} kg</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Geen eerdere data gevonden voor deze oefening.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SupersetCard ─────────────────────────────────────────────────────────────

function SupersetCard({
  ss, itemIdx, onRemove, onUpdate,
}: {
  ss: LocalSuperset;
  itemIdx: number;
  onRemove: () => void;
  onUpdate: (updated: LocalSuperset) => void;
}) {
  const { state: restState, start: startRest, skip: skipRest } = useCountdown();
  const [showExPicker, setShowExPicker] = useState(false);
  const [confirmRemoveSS, setConfirmRemoveSS] = useState(false);
  const [confirmRemoveEx, setConfirmRemoveEx] = useState<string | null>(null);
  // tracks which exercise in a round was just completed, to trigger between-exercise rest
  const lastDoneRef = useRef<{ roundKey: string; exId: string } | null>(null);

  function newSetForEx(): LocalSet {
    return { id: generateId(), key: generateId(), type: "reps", reps: 8, weight: 0, duration: 1, done: false };
  }

  function addExercise(name: string) {
    const newEx: SupersetExercise = { id: generateId(), name, setType: "reps" };
    // Add a set slot for this exercise in every existing round
    const updatedRounds = ss.rounds.map((r) => ({
      ...r,
      sets: { ...r.sets, [newEx.id]: newSetForEx() },
    }));
    onUpdate({ ...ss, exercises: [...ss.exercises, newEx], rounds: updatedRounds });
    setShowExPicker(false);
  }

  function removeExercise(exId: string) {
    const exercises = ss.exercises.filter((e) => e.id !== exId);
    const rounds = ss.rounds.map((r) => {
      const sets = { ...r.sets };
      delete sets[exId];
      return { ...r, sets };
    });
    onUpdate({ ...ss, exercises, rounds });
  }

  function addRound() {
    const sets: Record<string, LocalSet> = {};
    const lastRound = ss.rounds[ss.rounds.length - 1];
    ss.exercises.forEach((e) => {
      const prev = lastRound?.sets[e.id];
      sets[e.id] = {
        ...newSetForEx(),
        reps: prev?.reps ?? 8,
        weight: prev?.weight ?? 0,
        duration: prev?.duration ?? 1,
      };
    });
    onUpdate({ ...ss, rounds: [...ss.rounds, { key: generateId(), sets }] });
  }

  function removeRound(key: string) {
    if (ss.rounds.length <= 1) return;
    onUpdate({ ...ss, rounds: ss.rounds.filter((r) => r.key !== key) });
  }

  function updateSetInRound(roundKey: string, exId: string, field: "reps" | "weight" | "duration" | "done", val: string | boolean) {
    const rounds = ss.rounds.map((r) => {
      if (r.key !== roundKey) return r;
      const set = r.sets[exId];
      let updated: LocalSet;
      if (field === "done") updated = { ...set, done: val as boolean };
      else updated = { ...set, [field]: parseFloat(val as string) || 0 };
      return { ...r, sets: { ...r.sets, [exId]: updated } };
    });

    // Trigger rest logic
    if (field === "done" && val === true) {
      const round = ss.rounds.find((r) => r.key === roundKey)!;
      const exIdx = ss.exercises.findIndex((e) => e.id === exId);
      const isLastEx = exIdx === ss.exercises.length - 1;
      const isLastRound = ss.rounds.indexOf(round) === ss.rounds.length - 1;

      if (!isLastEx && ss.restBetweenExercises > 0) {
        // Rest between exercises in this round
        startRest(ss.restBetweenExercises);
      } else if (isLastEx && !isLastRound && ss.restBetweenRounds > 0) {
        // Rest after completing the full round (not after last round)
        startRest(ss.restBetweenRounds);
      }
    } else if (field === "done" && val === false) {
      skipRest();
    }

    onUpdate({ ...ss, rounds });
  }

  const usedNames = ss.exercises.map((e) => e.name);
  const totalSets = ss.rounds.length * ss.exercises.length;
  const doneSets = ss.rounds.reduce((sum, r) =>
    sum + Object.values(r.sets).filter((s) => s.done).length, 0);

  return (
    <div className="bg-gray-900 border border-purple-800/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-mono w-5 text-center">{itemIdx + 1}</span>
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-sm">Superset</span>
            <span className="text-xs text-purple-300 bg-purple-600/15 px-2 py-0.5 rounded-full">
              {ss.exercises.length} exercises · {ss.rounds.length} rounds
            </span>
            {doneSets > 0 && (
              <span className="text-xs text-green-400 bg-green-600/15 px-2 py-0.5 rounded-full">
                {doneSets}/{totalSets} done
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onUpdate({ ...ss, collapsed: !ss.collapsed })}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400">
              {ss.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button onClick={() => {
              const hasDone = ss.rounds.some((r) => Object.values(r.sets).some((s) => s.done || s.weight > 0));
              hasDone ? setConfirmRemoveSS(true) : onRemove();
            }} className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-500 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rest settings + countdown */}
        <div className="flex items-center gap-2 flex-wrap">
          {restState ? (
            <RestCountdown remaining={restState.remaining} total={restState.total} onSkip={skipRest} />
          ) : (
            <>
              <TimerConfig label="Rest between exercises" seconds={ss.restBetweenExercises}
                onChange={(s) => onUpdate({ ...ss, restBetweenExercises: s })} />
              <TimerConfig label="Rest between rounds" seconds={ss.restBetweenRounds}
                onChange={(s) => onUpdate({ ...ss, restBetweenRounds: s })} />
            </>
          )}
        </div>
      </div>

      {!ss.collapsed && (
        <div className="p-4 space-y-4">
          {/* Exercise name row headers */}
          {ss.exercises.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {ss.exercises.map((ex, i) => (
                  <div key={ex.id} className="flex items-center gap-1 bg-purple-900/20 border border-purple-700/30 rounded-lg px-2.5 py-1">
                    <span className="text-xs text-purple-300 font-medium">{String.fromCharCode(65 + i)}. {ex.name}</span>
                    <button onClick={() => {
                      const hasDone = ss.rounds.some((r) => { const s = r.sets[ex.id]; return s && (s.done || s.weight > 0); });
                      hasDone ? setConfirmRemoveEx(ex.id) : removeExercise(ex.id);
                    }} className="text-purple-500 hover:text-red-400 transition-colors ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {ss.exercises.map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      const t = ex.setType === "reps" ? "duration" : "reps";
                      const exercises = ss.exercises.map((e) => e.id === ex.id ? { ...e, setType: t } : e);
                      onUpdate({ ...ss, exercises } as LocalSuperset);
                    }}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      ex.setType === "duration"
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}>
                    {ex.setType === "duration"
                      ? <><Hash className="w-3 h-3" /> {String.fromCharCode(65 + i)}: Switch to reps</>
                      : <><Timer className="w-3 h-3" /> {String.fromCharCode(65 + i)}: Switch to time</>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowExPicker(true)}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 border border-dashed border-purple-700/40 rounded-lg px-2.5 py-1 transition-colors">
                  <Plus className="w-3 h-3" /> Add exercise
                </button>
              </div>
            </div>
          )}

          {showExPicker && (
            <ExercisePicker
              onSelect={addExercise}
              onClose={() => setShowExPicker(false)}
              usedNames={usedNames}
            />
          )}

          {/* Rounds */}
          {ss.exercises.length > 0 && ss.rounds.map((round, roundIdx) => (
            <div key={round.key} className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50">
                <span className="text-xs font-semibold text-gray-300">Round {roundIdx + 1}</span>
                <button onClick={() => removeRound(round.key)}
                  className="p-1 rounded hover:bg-red-900/30 text-gray-600 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 space-y-2">
                {/* Column headers */}
                <div className="grid grid-cols-12 text-xs text-gray-500 font-medium px-1">
                  <span className="col-span-1">Ex</span>
                  <span className="col-span-3 text-center">Reps/Time</span>
                  <span className="col-span-4 text-center">Weight (kg)</span>
                  <span className="col-span-2 text-center">Done</span>
                  <span className="col-span-2" />
                </div>

                {ss.exercises.map((ex, exIdx) => {
                  const set = round.sets[ex.id];
                  if (!set) return null;
                  return (
                    <div key={ex.id}
                      className={`grid grid-cols-12 items-center gap-1.5 transition-opacity ${set.done ? "opacity-50" : ""}`}>
                      <div className="col-span-1 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-400">{String.fromCharCode(65 + exIdx)}</span>
                      </div>
                      <div className="col-span-3">
                        {ex.setType === "duration" ? (
                          <DurationInput
                            value={set.duration}
                            onChange={(s) => updateSetInRound(round.key, ex.id, "duration", String(s))}
                          />
                        ) : (
                          <input type="number" min={0}
                            value={set.reps || ""}
                            onChange={(e) => updateSetInRound(round.key, ex.id, "reps", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-center text-sm focus:outline-none focus:border-purple-500"
                            placeholder="0" />
                        )}
                      </div>
                      <div className="col-span-4">
                        <input type="number" min={0} step={0.5}
                          value={set.weight || ""}
                          onChange={(e) => updateSetInRound(round.key, ex.id, "weight", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-center text-sm focus:outline-none focus:border-purple-500"
                          placeholder="0" />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => updateSetInRound(round.key, ex.id, "done", !set.done)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            set.done
                              ? "bg-green-600 border-green-600 text-white scale-110"
                              : "border-gray-600 hover:border-purple-500 text-transparent hover:text-purple-400"
                          }`}>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <span className="text-xs text-gray-600 truncate max-w-[40px]">{ex.name.split(" ")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {ss.exercises.length > 0 && (
            <button onClick={addRound}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-dashed border-purple-700/40 hover:border-purple-600 rounded-lg py-2 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Round
            </button>
          )}

          {ss.exercises.length === 0 && (
            <button onClick={() => setShowExPicker(true)}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-purple-700/40 hover:border-purple-600 text-purple-500 hover:text-purple-300 rounded-xl py-4 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add first exercise to superset
            </button>
          )}
        </div>
      )}

      {confirmRemoveSS && (
        <ConfirmDialog
          message="Wil je deze superset verwijderen?"
          onConfirm={() => { setConfirmRemoveSS(false); onRemove(); }}
          onCancel={() => setConfirmRemoveSS(false)}
        />
      )}
      {confirmRemoveEx && (
        <ConfirmDialog
          message={`Wil je "${ss.exercises.find((e) => e.id === confirmRemoveEx)?.name}" uit de superset verwijderen?`}
          onConfirm={() => { removeExercise(confirmRemoveEx); setConfirmRemoveEx(null); }}
          onCancel={() => setConfirmRemoveEx(null)}
        />
      )}
    </div>
  );
}

// ─── SaveWorkoutDialog ────────────────────────────────────────────────────────

function generateWorkoutName(items: WorkoutItem[]): string {
  const names = items.flatMap((item) => {
    if (item.kind === "exercise") return [item.name];
    return item.exercises.map((e) => e.name);
  });
  if (names.length === 0) return "Mijn Training";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names[0]}, ${names[1]} & meer`;
}

function SaveWorkoutDialog({ items, onConfirm, onCancel }: {
  items: WorkoutItem[];
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const suggestion = generateWorkoutName(items);
  const [name, setName] = useState(suggestion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-green-600/20 border border-green-600/40 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-base font-semibold text-white">Training opslaan</p>
          <p className="text-xs text-gray-500 mt-1">Geef je training een naam</p>
        </div>
        <div>
          <input
            autoFocus
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition-colors text-center font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 text-sm transition-colors">
            Annuleren
          </button>
          <button
            onClick={() => name.trim() && onConfirm(name.trim())}
            disabled={!name.trim()}
            className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-semibold text-sm transition-colors">
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeWorkout, startWorkout, updateWorkout, clearWorkout } = useWorkout();

  // Local UI state (not persisted)
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showSupersetPicker, setShowSupersetPicker] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [templateSaved, setTemplateSaved] = useState(false);

  // Start a new workout if none is active
  useEffect(() => {
    if (!activeWorkout) {
      startWorkout("My Workout");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Open save dialog if ?save=1 in URL
  useEffect(() => {
    if (searchParams.get("save") === "1" && activeWorkout && items.length > 0) {
      setShowSaveDialog(true);
      router.replace("/workout");
    }
  }, [searchParams, activeWorkout]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive from context
  const items: WorkoutItem[] = activeWorkout?.items ?? [];
  const workoutName: string = activeWorkout?.name ?? "My Workout";
  const startTime: number = activeWorkout?.startTime ?? Date.now();

  function setItems(updater: WorkoutItem[] | ((prev: WorkoutItem[]) => WorkoutItem[])) {
    updateWorkout((prev) => ({
      ...prev,
      items: typeof updater === "function" ? updater(prev.items) : updater,
    }));
  }

  function setWorkoutName(name: string) {
    updateWorkout((prev) => ({ ...prev, name }));
  }

  function newSet(type: "reps" | "duration"): LocalSet {
    return { id: generateId(), key: generateId(), type, reps: 8, weight: 0, duration: 1, done: false };
  }

  function addExercise(name: string) {
    const ex: LocalExercise & { kind: "exercise" } = {
      kind: "exercise", id: generateId(), name,
      collapsed: false, setType: "reps", restSeconds: 90,
      sets: [newSet("reps")],
    };
    setItems((prev) => [...prev, ex]);
    setShowPicker(false);
  }

  function addSuperset() {
    const ss: LocalSuperset = {
      kind: "superset", id: generateId(),
      exercises: [], rounds: [{ key: generateId(), sets: {} }],
      restBetweenExercises: 0, restBetweenRounds: 90,
      collapsed: false,
    };
    setItems((prev) => [...prev, ss]);
    setShowSupersetPicker(false);
  }

  function updateItem(id: string, updater: (item: WorkoutItem) => WorkoutItem) {
    setItems((prev) => prev.map((item) => item.id === id ? updater(item) : item) as WorkoutItem[]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSaveTemplate() {
    if (items.length === 0) return;
    const template: WorkoutTemplate = {
      id: generateId(),
      name: workoutName,
      createdAt: new Date().toISOString(),
      exercises: items.flatMap((item) => {
        if (item.kind === "exercise") {
          const last = item.sets[item.sets.length - 1];
          return [{
            name: item.name,
            setType: item.setType,
            setCount: item.sets.length,
            defaultReps: last?.reps ?? 8,
            defaultWeight: last?.weight ?? 0,
          }];
        }
        return item.exercises.map((ex) => {
          const lastRound = item.rounds[item.rounds.length - 1];
          const lastSet = lastRound?.sets[ex.id];
          return {
            name: ex.name,
            setType: ex.setType,
            setCount: item.rounds.length,
            defaultReps: lastSet?.reps ?? 8,
            defaultWeight: lastSet?.weight ?? 0,
          };
        });
      }),
    };
    saveWorkoutTemplate(template);
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2500);
  }

  function handleLoadTemplate(template: WorkoutTemplate) {
    const newItems: WorkoutItem[] = template.exercises.map((ex) => ({
      kind: "exercise" as const,
      id: generateId(),
      name: ex.name,
      collapsed: false,
      setType: ex.setType,
      restSeconds: 90,
      sets: Array.from({ length: ex.setCount }, () => ({
        id: generateId(),
        key: generateId(),
        type: ex.setType,
        reps: ex.defaultReps,
        weight: ex.defaultWeight,
        duration: 1,
        done: false,
      })),
    }));
    setItems(newItems);
    setWorkoutName(template.name);
    setShowTemplates(false);
  }

  function handleFinish() {
    if (items.length === 0) { alert("Voeg eerst een oefening toe."); return; }
    setShowSaveDialog(true);
  }

  async function confirmSave(name: string) {
    setSaving(true);
    setShowSaveDialog(false);
    const duration = Math.round((Date.now() - startTime) / 60000);
    const exercises: Exercise[] = [];
    items.forEach((item) => {
      if (item.kind === "exercise") {
        exercises.push({
          id: item.id, name: item.name,
          sets: item.sets.map((s) => ({ id: s.id, type: s.type, reps: s.reps, weight: s.weight, duration: s.duration })),
        });
      } else {
        item.exercises.forEach((ex) => {
          exercises.push({
            id: ex.id, name: `${item.exercises.findIndex((e) => e.id === ex.id) === 0 ? "🔗 " : "↳ "}${ex.name}`,
            sets: item.rounds.map((r) => {
              const s = r.sets[ex.id];
              return { id: s?.id ?? generateId(), type: "reps" as const, reps: s?.reps ?? 0, weight: s?.weight ?? 0, duration: 0 };
            }),
          });
        });
      }
    });
    const result = await addWorkoutToDB({ id: generateId(), name, date: new Date().toISOString(), duration: duration < 1 ? 1 : duration, exercises });
    setSaving(false);
    if (result.error) {
      alert(`Opslaan mislukt: ${result.error}`);
      return;
    }
    clearWorkout();
    window.location.href = "/history";
  }

  const elapsed = Math.round((Date.now() - startTime) / 60000);
  const usedNames = items.filter((i) => i.kind === "exercise").map((i) => i.name);

  return (
    <div className="sm:ml-52 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <input className="bg-transparent text-xl font-bold outline-none border-b border-transparent focus:border-green-500 transition-colors pb-0.5 w-56"
            value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">
            {elapsed}m elapsed · {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setTemplates(getWorkoutTemplates()); setShowTemplates(true); }}
            className="flex items-center gap-1.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 px-3 py-2 rounded-xl text-sm transition-colors"
            title="Templates laden"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          {items.length > 0 && (
            <button
              onClick={handleSaveTemplate}
              className={`flex items-center gap-1.5 border px-3 py-2 rounded-xl text-sm transition-colors ${
                templateSaved
                  ? "border-green-600 text-green-400 bg-green-600/10"
                  : "border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200"
              }`}
              title="Opslaan als template"
            >
              <BookmarkPlus className="w-4 h-4" />
              {templateSaved && <span className="text-xs">Opgeslagen!</span>}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) =>
          item.kind === "exercise" ? (
            <ExerciseCard
              key={item.id} ex={item} exIdx={idx}
              onToggleCollapse={() => updateItem(item.id, (e) => ({ ...e, collapsed: !(e as LocalExercise).collapsed }))}
              onRemove={() => removeItem(item.id)}
              onToggleType={() => updateItem(item.id, (e) => {
                const ex = e as LocalExercise & { kind: "exercise" };
                const t = ex.setType === "reps" ? "duration" : "reps";
                return { ...ex, setType: t, sets: ex.sets.map((s) => ({ ...s, type: t })) } as WorkoutItem;
              })}
              onRestChange={(s) => updateItem(item.id, (e) => ({ ...e, restSeconds: s } as WorkoutItem))}
              onAddSet={() => updateItem(item.id, (e) => {
                const ex = e as LocalExercise & { kind: "exercise" };
                const last = ex.sets[ex.sets.length - 1];
                return { ...ex, sets: [...ex.sets, { ...newSet(ex.setType), reps: last?.reps ?? 8, weight: last?.weight ?? 0, duration: last?.duration ?? 1 }] } as WorkoutItem;
              })}
              onRemoveSet={(key) => updateItem(item.id, (e) => {
                const ex = e as LocalExercise & { kind: "exercise" };
                if (ex.sets.length <= 1) return ex as WorkoutItem;
                return { ...ex, sets: ex.sets.filter((s) => s.key !== key) } as WorkoutItem;
              })}
              onUpdateSet={(key, field, val) => updateItem(item.id, (e) => {
                const ex = e as LocalExercise & { kind: "exercise" };
                return {
                  ...ex, sets: ex.sets.map((s) => {
                    if (s.key !== key) return s;
                    if (field === "done") return { ...s, done: val as boolean };
                    return { ...s, [field]: parseFloat(val as string) || 0 };
                  }),
                } as WorkoutItem;
              })}
            />
          ) : (
            <SupersetCard
              key={item.id} ss={item} itemIdx={idx}
              onRemove={() => removeItem(item.id)}
              onUpdate={(updated) => updateItem(item.id, () => updated)}
            />
          )
        )}
      </div>

      {/* Add buttons */}
      {showPicker ? (
        <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} usedNames={usedNames} />
      ) : showSupersetPicker ? null : (
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-700 hover:border-green-600 text-gray-400 hover:text-green-400 rounded-xl py-3.5 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
          <button onClick={addSuperset}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-purple-800/50 hover:border-purple-600 text-purple-500 hover:text-purple-300 rounded-xl py-3.5 text-sm font-medium transition-colors">
            <Layers className="w-4 h-4" /> Add Superset
          </button>
        </div>
      )}

      {showSaveDialog && (
        <SaveWorkoutDialog
          items={items}
          onConfirm={confirmSave}
          onCancel={() => setShowSaveDialog(false)}
        />
      )}

      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" /> Mijn templates
              </span>
              <button onClick={() => setShowTemplates(false)} className="p-1 rounded hover:bg-gray-800 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            {templates.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nog geen templates opgeslagen.<br />Sla een training op als template via <BookmarkPlus className="w-3.5 h-3.5 inline" />.</p>
            ) : (
              <div className="space-y-2">
                {templates.map((t) => (
                  <div key={t.id} className="bg-gray-800 rounded-xl p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t.exercises.length} oefening{t.exercises.length !== 1 ? "en" : ""} · {new Date(t.createdAt).toLocaleDateString("nl-NL")}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">
                        {t.exercises.map((e) => e.name).join(", ")}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleLoadTemplate(t)}
                        className="text-xs text-blue-400 hover:text-blue-300 border border-blue-700/40 rounded-lg px-2.5 py-1 transition-colors">
                        Laden
                      </button>
                      <button
                        onClick={() => { deleteWorkoutTemplate(t.id); setTemplates(getWorkoutTemplates()); }}
                        className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-600 hover:text-red-400 transition-colors">
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
