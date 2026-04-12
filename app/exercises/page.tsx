"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadExercises, searchExercises, type ExerciseInfo } from "@/lib/exercises";
import { Search, X, ChevronRight, Loader2, Dumbbell } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Chest: "bg-blue-500",
  Back: "bg-green-500",
  Legs: "bg-yellow-500",
  Shoulders: "bg-purple-500",
  Arms: "bg-red-500",
  Core: "bg-orange-500",
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadExercises().then((data) => {
      setExercises(data);
      setLoading(false);
    });
  }, []);

  // Get unique categories
  const categories = Array.from(
    new Set(exercises.map((e) => e.category).filter(Boolean) as string[])
  ).sort();

  // Filter — use smart search (with synonym map) when query is present
  const searchResults = query.trim() ? searchExercises(query, exercises, 200) : exercises;
  const filtered = searchResults.filter((ex) => {
    const matchCat = !activeCategory || ex.category === activeCategory;
    return matchCat;
  });

  // Group by category
  const grouped = filtered.reduce<Record<string, ExerciseInfo[]>>((acc, ex) => {
    const cat = ex.category ?? "Overig";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ex);
    return acc;
  }, {});

  return (
    <div className="sm:ml-52 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Oefeningen</h1>
        <p className="text-sm text-gray-400 mt-1">
          {loading ? "Laden…" : `${exercises.length} oefeningen`}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-green-500 placeholder-gray-600 transition-colors"
          placeholder="Zoek oefening…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter pills */}
      {!loading && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !activeCategory
                ? "bg-green-600/20 border-green-700/40 text-green-400"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
            }`}>
            Alles
          </button>
          {categories.map((cat) => (
            <button key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-green-600/20 border-green-700/40 text-green-400"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}>
              <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-gray-500"}`} />
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" /> Oefeningen laden…
        </div>
      )}

      {/* Results */}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-12">Geen oefeningen gevonden.</p>
      )}

      {!loading && Object.entries(grouped).map(([cat, exs]) => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-gray-500"}`} />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{cat}</h2>
            <span className="text-xs text-gray-700">({exs.length})</span>
          </div>
          <div className="space-y-1.5">
            {exs.map((ex) => (
              <Link key={ex.id} href={`/exercises/${slugify(ex.name)}`}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-500 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{ex.name}</p>
                    {ex.muscles && ex.muscles.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ex.muscles.slice(0, 2).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
