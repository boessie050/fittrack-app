"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { getWorkoutsFromDB, deleteWorkoutFromDB, type Workout } from "@/lib/supabase-store";
import {
  Dumbbell, Trash2, Calendar, Clock, ChevronDown, ChevronUp, TrendingUp, Loader2,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    weekday: "long", year: "numeric", month: "short", day: "numeric",
  });
}

function totalVolume(workout: Workout): number {
  return workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0), 0
  );
}

function totalSets(workout: Workout): number {
  return workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
}

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkoutsFromDB().then((data) => {
      setWorkouts(data);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Workout verwijderen?")) return;
    await deleteWorkoutFromDB(id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (loading) {
    return (
      <div className="sm:ml-52 flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="sm:ml-52 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Workout History</h1>
        <p className="text-gray-400 text-sm mt-1">
          {workouts.length} workout{workouts.length !== 1 ? "s" : ""} gelogd
        </p>
      </div>

      {workouts.length === 0 ? (
        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-10 text-center">
          <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nog geen trainingen gelogd.</p>
          <p className="text-gray-600 text-xs mt-1">Klik op "+ Training" om te beginnen.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => {
            const expanded = expandedId === w.id;
            const vol = totalVolume(w);
            const sets = totalSets(w);

            return (
              <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleExpand(w.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600/20 rounded-lg p-2 shrink-0">
                      <Dumbbell className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{w.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(w.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {w.duration}min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-green-400">
                        {vol > 0 ? `${vol}kg` : "—"}
                      </div>
                      <div className="text-xs text-gray-500">{sets} sets</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(w.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-gray-800 px-4 pb-4 pt-3 space-y-4">
                    <div className="flex gap-4 sm:hidden text-sm">
                      <span className="text-green-400 font-semibold">{vol > 0 ? `${vol}kg` : "—"}</span>
                      <span className="text-gray-500">{sets} sets totaal</span>
                    </div>
                    {w.exercises.map((ex) => (
                      <div key={ex.id}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-sm font-semibold">{ex.name}</span>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-500 border-b border-gray-700">
                                <th className="text-left py-2 px-3 font-medium">Set</th>
                                <th className="text-center py-2 px-3 font-medium">Reps</th>
                                <th className="text-center py-2 px-3 font-medium">Gewicht</th>
                                <th className="text-right py-2 px-3 font-medium">Volume</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ex.sets.map((set, i) => (
                                <tr key={set.id} className="border-b border-gray-700/50 last:border-0">
                                  <td className="py-2 px-3 text-gray-500">{i + 1}</td>
                                  <td className="py-2 px-3 text-center">{set.reps}</td>
                                  <td className="py-2 px-3 text-center">{set.weight}kg</td>
                                  <td className="py-2 px-3 text-right text-green-400">{set.reps * set.weight}kg</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
