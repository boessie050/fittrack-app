"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWorkouts, type Workout } from "@/lib/store";
import {
  Dumbbell,
  Flame,
  TrendingUp,
  ChevronRight,
  Plus,
  Calendar,
} from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function totalVolume(workout: Workout): number {
  return workout.exercises.reduce(
    (sum, ex) =>
      sum + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );
}

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  const recentWorkouts = workouts.slice(0, 3);
  const totalWorkouts = workouts.length;
  const weekWorkouts = workouts.filter((w) => {
    const d = new Date(w.date);
    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;
  const totalVol = workouts.reduce((s, w) => s + totalVolume(w), 0);

  return (
    <div className="sm:ml-52 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600/30 to-gray-900 border border-green-700/30 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back 👋</h1>
        <p className="text-gray-400 text-sm mb-5">
          {totalWorkouts === 0
            ? "Start your first workout today."
            : `You've logged ${totalWorkouts} workout${totalWorkouts !== 1 ? "s" : ""} so far. Keep it up!`}
        </p>
        <Link
          href="/workout"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 transition-colors text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" />
          Start New Workout
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Dumbbell className="w-5 h-5 text-green-400" />}
          label="Total"
          value={`${totalWorkouts}`}
          sub="workouts"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          label="This week"
          value={`${weekWorkouts}`}
          sub="sessions"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
          label="Volume"
          value={
            totalVol >= 1000
              ? `${(totalVol / 1000).toFixed(1)}t`
              : `${totalVol}kg`
          }
          sub="total"
        />
      </div>

      {/* Recent workouts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-200">
            Recent Workouts
          </h2>
          <Link
            href="/history"
            className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
      {icon}
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">
          {label} · {sub}
        </div>
      </div>
    </div>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  const vol = totalVolume(workout);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-green-600/20 rounded-lg p-2">
          <Dumbbell className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <div className="font-semibold text-sm">{workout.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3" />
            {formatDate(workout.date)} · {workout.duration}min ·{" "}
            {workout.exercises.length} exercises
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-green-400">{vol}kg</div>
        <div className="text-xs text-gray-500">volume</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center">
      <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">No workouts yet.</p>
      <p className="text-gray-600 text-xs mt-1">
        Hit &ldquo;Start New Workout&rdquo; to log your first session.
      </p>
    </div>
  );
}
