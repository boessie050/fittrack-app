"use client";

import { useEffect, useState, useMemo } from "react";
import { getWorkoutsFromDB, type Workout } from "@/lib/supabase-store";
import { useLanguage } from "@/lib/useLanguage";
import {
  TrendingUp, Dumbbell, Clock, Calendar,
  BarChart3, Trophy, ChevronDown, Activity, Loader2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMaxWeight(workout: Workout, exerciseName: string): number {
  const ex = workout.exercises.find((e) => e.name.toLowerCase() === exerciseName.toLowerCase());
  if (!ex) return 0;
  return Math.max(...ex.sets.map((s) => s.weight ?? 0), 0);
}

function getAllExerciseNames(workouts: Workout[]): string[] {
  const names = new Set<string>();
  workouts.forEach((w) => w.exercises.forEach((e) => names.add(e.name)));
  return Array.from(names).sort();
}

function getProgressData(workouts: Workout[], exerciseName: string) {
  return workouts
    .map((w) => ({ date: w.date, weight: getMaxWeight(w, exerciseName) }))
    .filter((d) => d.weight > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getPRs(workouts: Workout[]): { name: string; weight: number; date: string }[] {
  const map: Record<string, { weight: number; date: string }> = {};
  workouts.forEach((w) => {
    w.exercises.forEach((ex) => {
      const max = Math.max(...ex.sets.map((s) => s.weight ?? 0), 0);
      if (!map[ex.name] || max > map[ex.name].weight) {
        map[ex.name] = { weight: max, date: w.date };
      }
    });
  });
  return Object.entries(map)
    .map(([name, { weight, date }]) => ({ name, weight, date }))
    .filter((p) => p.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);
}

function getWeeklyFrequency(workouts: Workout[]): { label: string; count: number }[] {
  const weeks: { label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - i * 7 - now.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const count = workouts.filter((w) => {
      const d = new Date(w.date);
      return d >= start && d < end;
    }).length;
    weeks.push({ label: start.toLocaleDateString("nl-NL", { day: "numeric", month: "short" }), count });
  }
  return weeks;
}

function getMuscleDistribution(workouts: Workout[]): { muscle: string; count: number }[] {
  const MUSCLE_MAP: Record<string, string> = {
    bench: "Chest", press: "Chest", fly: "Chest", dip: "Chest",
    row: "Back", pulldown: "Back", "pull-up": "Back", pullup: "Back", deadlift: "Back",
    squat: "Legs", lunge: "Legs", "leg press": "Legs", "leg curl": "Legs", calf: "Calves",
    curl: "Biceps", hammer: "Biceps",
    tricep: "Triceps", skull: "Triceps", pushdown: "Triceps",
    shoulder: "Shoulders", lateral: "Shoulders", overhead: "Shoulders",
    crunch: "Core", plank: "Core", ab: "Core",
  };
  const map: Record<string, number> = {};
  workouts.forEach((w) => {
    w.exercises.forEach((ex) => {
      const lower = ex.name.toLowerCase();
      let matched = false;
      for (const [key, muscle] of Object.entries(MUSCLE_MAP)) {
        if (lower.includes(key)) { map[muscle] = (map[muscle] ?? 0) + 1; matched = true; break; }
      }
      if (!matched) map["Other"] = (map["Other"] ?? 0) + 1;
    });
  });
  return Object.entries(map).map(([muscle, count]) => ({ muscle, count })).sort((a, b) => b.count - a.count);
}

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "bg-blue-500", Back: "bg-green-500", Legs: "bg-yellow-500",
  Shoulders: "bg-purple-500", Biceps: "bg-red-500", Triceps: "bg-orange-500",
  Core: "bg-pink-500", Calves: "bg-cyan-500", Other: "bg-gray-500",
};

function LineChart({ data, nl }: { data: { date: string; weight: number }[]; nl: boolean }) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
        {nl ? "Minimaal 2 sessies nodig voor een grafiek." : "At least 2 sessions needed for a chart."}
      </div>
    );
  }
  const W = 600; const H = 160; const PAD = { t: 16, r: 16, b: 32, l: 48 };
  const innerW = W - PAD.l - PAD.r; const innerH = H - PAD.t - PAD.b;
  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights); const maxWt = Math.max(...weights);
  const range = maxWt - minW || 1;
  const toX = (i: number) => PAD.l + (i / (data.length - 1)) * innerW;
  const toY = (w: number) => PAD.t + innerH - ((w - minW) / range) * innerH;
  const points = data.map((d, i) => `${toX(i)},${toY(d.weight)}`).join(" ");
  const area = `M${toX(0)},${toY(data[0].weight)} ` + data.map((d, i) => `L${toX(i)},${toY(d.weight)}`).join(" ") + ` L${toX(data.length - 1)},${PAD.t + innerH} L${PAD.l},${PAD.t + innerH} Z`;
  const yLabels = [minW, minW + range * 0.5, maxWt].map((v) => Math.round(v));
  const xLabels = [0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => ({
    i, label: new Date(data[i].date).toLocaleDateString(nl ? "nl-NL" : "en-US", { day: "numeric", month: "short" }),
  }));
  const prIdx = weights.indexOf(maxWt);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      {yLabels.map((v) => (
        <line key={v} x1={PAD.l} x2={W - PAD.r} y1={toY(v)} y2={toY(v)} stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />
      ))}
      {yLabels.map((v) => (
        <text key={v} x={PAD.l - 6} y={toY(v) + 4} textAnchor="end" className="fill-gray-500" style={{ fontSize: 11 }}>{v}kg</text>
      ))}
      {xLabels.map(({ i, label }) => (
        <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" className="fill-gray-600" style={{ fontSize: 10 }}>{label}</text>
      ))}
      <path d={area} fill="url(#lineGrad)" opacity="0.3" />
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.weight)} r={i === prIdx ? 5 : 3} fill={i === prIdx ? "#facc15" : "#22c55e"} stroke="#111827" strokeWidth="2" />
      ))}
    </svg>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { lang } = useLanguage();
  const nl = lang === "nl";
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    getWorkoutsFromDB().then((data) => { setWorkouts(data); setLoading(false); });
  }, []);

  const exerciseNames = useMemo(() => getAllExerciseNames(workouts), [workouts]);
  const progressData = useMemo(() => selectedExercise ? getProgressData(workouts, selectedExercise) : [], [workouts, selectedExercise]);
  const prs = useMemo(() => getPRs(workouts), [workouts]);
  const weeklyFreq = useMemo(() => getWeeklyFrequency(workouts), [workouts]);
  const muscleDistribution = useMemo(() => getMuscleDistribution(workouts), [workouts]);

  useEffect(() => {
    if (exerciseNames.length > 0 && !selectedExercise) {
      const counts: Record<string, number> = {};
      workouts.forEach((w) => w.exercises.forEach((e) => { counts[e.name] = (counts[e.name] ?? 0) + 1; }));
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (best) setSelectedExercise(best);
    }
  }, [exerciseNames, workouts, selectedExercise]);

  const totalWorkouts = workouts.length;
  const avgDuration = totalWorkouts > 0 ? Math.round(workouts.reduce((s, w) => s + w.duration, 0) / totalWorkouts) : 0;
  const thisWeekCount = workouts.filter((w) => (Date.now() - new Date(w.date).getTime()) / 86400000 <= 7).length;
  const maxFreq = Math.max(...weeklyFreq.map((w) => w.count), 1);
  const totalMuscleSets = muscleDistribution.reduce((s, m) => s + m.count, 0) || 1;

  if (loading) {
    return (
      <div className="sm:ml-52 flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="sm:ml-52 flex flex-col items-center justify-center py-20 gap-4">
        <BarChart3 className="w-10 h-10 text-gray-600" />
        <p className="text-gray-400 text-sm">{nl ? "Log trainingen om statistieken te zien." : "Log workouts to see your stats."}</p>
      </div>
    );
  }

  return (
    <div className="sm:ml-52 space-y-5 pb-16">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-500" />
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">{nl ? "Jouw voortgang in één overzicht" : "Your progress at a glance"}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2"><Dumbbell className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-500">{nl ? "Trainingen" : "Workouts"}</span></div>
          <p className="text-2xl font-bold">{totalWorkouts}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /><span className="text-xs text-gray-500">{nl ? "Gem. duur" : "Avg duration"}</span></div>
          <p className="text-2xl font-bold">{avgDuration}<span className="text-sm font-normal text-gray-500 ml-1">min</span></p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /><span className="text-xs text-gray-500">{nl ? "Deze week" : "This week"}</span></div>
          <p className="text-2xl font-bold">{thisWeekCount}<span className="text-sm font-normal text-gray-500 ml-1">x</span></p>
        </div>
      </div>

      {/* Progress chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            {nl ? "Voortgang per oefening" : "Progress per exercise"}
          </h2>
          <div className="relative">
            <button onClick={() => setShowExercisePicker(!showExercisePicker)}
              className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors max-w-[180px]">
              <span className="truncate">{selectedExercise || (nl ? "Kies oefening…" : "Choose exercise…")}</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            </button>
            {showExercisePicker && (
              <div className="absolute right-0 top-full mt-1 z-30 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden w-56 max-h-64 overflow-y-auto">
                {exerciseNames.map((name) => (
                  <button key={name} onClick={() => { setSelectedExercise(name); setShowExercisePicker(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors border-b border-gray-700/50 last:border-0 ${name === selectedExercise ? "bg-green-600/20 text-green-400" : "text-gray-300 hover:bg-gray-700"}`}>
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedExercise && progressData.length > 0 ? (
          <div>
            <LineChart data={progressData} nl={nl} />
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>{progressData.length} {nl ? "sessies" : "sessions"}</span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                PR: <span className="font-semibold text-white ml-1">{Math.max(...progressData.map((d) => d.weight))}kg</span>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 py-8 text-center">{nl ? "Nog geen data voor deze oefening." : "No data yet for this exercise."}</p>
        )}
      </div>

      {/* PRs */}
      {prs.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" />{nl ? "PR's" : "Personal Records"}</h2>
          <div className="space-y-2">
            {prs.map((pr, i) => (
              <div key={pr.name} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : i === 1 ? "bg-gray-400/20 text-gray-300" : i === 2 ? "bg-orange-700/20 text-orange-400" : "bg-gray-800 text-gray-500"}`}>{i + 1}</span>
                <span className="flex-1 text-sm font-medium truncate">{pr.name}</span>
                <span className="text-sm font-bold text-green-400">{pr.weight}kg</span>
                <span className="text-xs text-gray-600 shrink-0">{new Date(pr.date).toLocaleDateString(nl ? "nl-NL" : "en-US", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly frequency */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400" />{nl ? "Trainingsfrequentie" : "Training frequency"}</h2>
        <div className="flex items-end gap-1.5 h-24">
          {weeklyFreq.map((w, i) => {
            const pct = maxFreq > 0 ? Math.max((w.count / maxFreq) * 100, w.count > 0 ? 8 : 0) : 0;
            const isCurrentWeek = i === weeklyFreq.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {w.count > 0 && <span className="text-xs text-gray-400 font-medium">{w.count}</span>}
                <div className="w-full flex items-end" style={{ height: "64px" }}>
                  <div className={`w-full rounded-t-md transition-all ${isCurrentWeek ? "bg-blue-500" : w.count > 0 ? "bg-blue-700" : "bg-gray-800"}`} style={{ height: w.count > 0 ? `${pct}%` : "4px" }} />
                </div>
                <span className="text-xs text-gray-700 text-center leading-tight" style={{ fontSize: 9 }}>{w.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Muscle balance */}
      {muscleDistribution.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2"><Dumbbell className="w-4 h-4 text-purple-400" />{nl ? "Spiergroep-balans" : "Muscle group balance"}</h2>
          <div className="space-y-2">
            {muscleDistribution.slice(0, 6).map(({ muscle, count }) => {
              const pct = Math.round((count / totalMuscleSets) * 100);
              return (
                <div key={muscle}>
                  <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${MUSCLE_COLORS[muscle] ?? "bg-gray-500"}`} />
                      <span className="font-medium">{muscle}</span>
                    </div>
                    <span className="text-gray-500">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${MUSCLE_COLORS[muscle] ?? "bg-gray-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent workouts */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{nl ? "Recente trainingen" : "Recent workouts"}</h2>
        <div className="space-y-2">
          {[...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((w) => (
            <div key={w.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
              <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{w.name}</p>
                <p className="text-xs text-gray-500">{w.exercises.length} {nl ? "oefeningen" : "exercises"} · {w.duration} min</p>
              </div>
              <span className="text-xs text-gray-600 shrink-0">{new Date(w.date).toLocaleDateString(nl ? "nl-NL" : "en-US", { day: "numeric", month: "short" })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
