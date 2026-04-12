"use client";

import { useEffect, useState } from "react";
import { getWorkouts, type Workout } from "@/lib/store";
import {
  TrendingUp,
  Dumbbell,
  Flame,
  Clock,
  Calendar,
  BarChart3,
} from "lucide-react";

function totalVolume(workout: Workout): number {
  return workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );
}

function getWeekLabel(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type WeekData = { week: string; count: number; volume: number };

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  if (workouts.length === 0) {
    return (
      <div className="sm:ml-52 flex flex-col items-center justify-center py-20 gap-4">
        <BarChart3 className="w-10 h-10 text-gray-600" />
        <p className="text-gray-400">Log some workouts to see your stats.</p>
      </div>
    );
  }

  // --- Compute stats ---
  const totalWorkouts = workouts.length;
  const totalVol = workouts.reduce((s, w) => s + totalVolume(w), 0);
  const totalTime = workouts.reduce((s, w) => s + w.duration, 0);
  const avgDuration = Math.round(totalTime / totalWorkouts);

  const now = new Date();
  const thisWeek = workouts.filter((w) => {
    const diff = (now.getTime() - new Date(w.date).getTime()) / 86400000;
    return diff <= 7;
  });
  const thisMonth = workouts.filter((w) => {
    const d = new Date(w.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Weekly volume chart data (last 6 weeks)
  const weekMap: Record<string, WeekData> = {};
  workouts.forEach((w) => {
    const label = getWeekLabel(new Date(w.date));
    if (!weekMap[label])
      weekMap[label] = { week: label, count: 0, volume: 0 };
    weekMap[label].count++;
    weekMap[label].volume += totalVolume(w);
  });
  const weeks: WeekData[] = Object.values(weekMap).slice(-6);
  const maxVolume = Math.max(...weeks.map((w) => w.volume), 1);

  // Top exercises by total volume
  const exerciseMap: Record<string, number> = {};
  workouts.forEach((w) =>
    w.exercises.forEach((ex) => {
      const vol = ex.sets.reduce((s, set) => s + set.reps * set.weight, 0);
      exerciseMap[ex.name] = (exerciseMap[ex.name] ?? 0) + vol;
    })
  );
  const topExercises = Object.entries(exerciseMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxExVol = topExercises[0]?.[1] ?? 1;

  // Streak (consecutive days with workout)
  const sortedDates = workouts
    .map((w) => new Date(w.date).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  for (const ds of sortedDates) {
    const d = new Date(ds);
    const diff = Math.round(
      (checkDate.getTime() - d.getTime()) / 86400000
    );
    if (diff <= 1) {
      streak++;
      checkDate = d;
    } else {
      break;
    }
  }

  return (
    <div className="sm:ml-52 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Your progress overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <BigStat
          icon={<Dumbbell className="w-5 h-5 text-green-400" />}
          value={totalWorkouts.toString()}
          label="Total Workouts"
          bg="bg-green-600/10"
        />
        <BigStat
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          value={`${streak}d`}
          label="Current Streak"
          bg="bg-orange-600/10"
        />
        <BigStat
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
          value={
            totalVol >= 1000
              ? `${(totalVol / 1000).toFixed(1)}t`
              : `${totalVol}kg`
          }
          label="Total Volume"
          bg="bg-blue-600/10"
        />
        <BigStat
          icon={<Clock className="w-5 h-5 text-purple-400" />}
          value={`${avgDuration}m`}
          label="Avg Duration"
          bg="bg-purple-600/10"
        />
      </div>

      {/* This week / month */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">This Week</span>
          </div>
          <div className="text-2xl font-bold">{thisWeek.length}</div>
          <div className="text-xs text-gray-500">sessions</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">This Month</span>
          </div>
          <div className="text-2xl font-bold">{thisMonth.length}</div>
          <div className="text-xs text-gray-500">sessions</div>
        </div>
      </div>

      {/* Weekly volume chart */}
      {weeks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-400" />
            Weekly Volume (kg)
          </h2>
          <div className="flex items-end gap-2 h-28">
            {weeks.map((w) => {
              const pct = Math.max((w.volume / maxVolume) * 100, 4);
              return (
                <div
                  key={w.week}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs text-gray-400 font-medium">
                    {w.volume > 0
                      ? w.volume >= 1000
                        ? `${(w.volume / 1000).toFixed(1)}t`
                        : `${w.volume}`
                      : ""}
                  </span>
                  <div className="w-full flex items-end" style={{ height: "72px" }}>
                    <div
                      className="w-full bg-green-600 hover:bg-green-500 rounded-t-md transition-all"
                      style={{ height: `${pct}%` }}
                      title={`${w.volume}kg`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 text-center leading-tight">
                    {w.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top exercises */}
      {topExercises.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Top Exercises by Volume
          </h2>
          <div className="space-y-3">
            {topExercises.map(([name, vol]) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{name}</span>
                  <span className="text-gray-400">{vol}kg</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(vol / maxExVol) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BigStat({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
}) {
  return (
    <div className={`${bg} border border-gray-800 rounded-xl p-4 space-y-2`}>
      {icon}
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
