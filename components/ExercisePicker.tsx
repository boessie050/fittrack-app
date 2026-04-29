"use client";

import { useEffect, useState, useRef } from "react";
import {
  loadExercises,
  searchExercises,
  getCategories,
  getByCategory,
  type ExerciseInfo,
} from "@/lib/exercises";
import {
  addPendingExercise,
  ALL_MUSCLE_GROUPS,
  type MuscleGroup,
} from "@/lib/store";
import { Search, X, ChevronDown, ChevronRight, Loader2, Info, Send } from "lucide-react";

type Props = {
  onSelect: (name: string) => void;
  onClose: () => void;
  usedNames?: string[];
};

export default function ExercisePicker({ onSelect, onClose, usedNames = [] }: Props) {
  const [exercises, setExercises] = useState<ExerciseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExerciseInfo[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestMuscle, setRequestMuscle] = useState<MuscleGroup>("Custom");
  const [requestNote, setRequestNote] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load exercises on mount
  useEffect(() => {
    loadExercises().then((data) => {
      setExercises(data);
      setCategories(getCategories(data));
      setLoading(false);
    });
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Fuzzy search as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setResults(searchExercises(query, exercises, 10));
  }, [query, exercises]);

  function handleSelect(name: string) {
    onSelect(name);
    onClose();
  }

  function openRequestForm() {
    setRequestName(query.trim());
    setRequestMuscle("Custom");
    setRequestNote("");
    setRequestSent(false);
    setShowRequestForm(true);
  }

  function submitRequest() {
    if (!requestName.trim()) return;
    addPendingExercise(requestName.trim(), requestMuscle, requestNote.trim() || undefined);
    setRequestSent(true);
  }

  const showBrowse = !query.trim();

  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-sm font-semibold">Add Exercise</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search input */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            ref={inputRef}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-green-500 placeholder-gray-600"
            placeholder="Search exercises… (e.g. benchpress, squat, curl)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-80 px-2 pb-3">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading exercise database…
          </div>
        )}

        {/* Request entry when no match */}
        {!loading && query.trim() && results.length === 0 && (
          <button
            onClick={openRequestForm}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 text-sm transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-gray-400">Oefening aanvragen: </span>
            <span className="text-white font-medium">{query.trim()}</span>
          </button>
        )}

        {/* Search results */}
        {!loading && results.length > 0 && (
          <div className="space-y-0.5">
            {results.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                used={usedNames.includes(ex.name)}
                onSelect={handleSelect}
              />
            ))}
            {/* Request new exercise at bottom of results */}
            {query.trim() &&
              !results.find(
                (r) => r.name.toLowerCase() === query.trim().toLowerCase()
              ) && (
                <button
                  onClick={openRequestForm}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-yellow-500" />
                  Oefening &ldquo;{query.trim()}&rdquo; aanvragen
                </button>
              )}
          </div>
        )}

        {/* Browse by category */}
        {!loading && showBrowse && (
          <div className="space-y-1 mt-1">
            <p className="text-xs text-gray-600 px-3 pb-1">Browse by category</p>
            {categories.map((cat) => {
              const isOpen = expandedCategory === cat;
              const catExercises = getByCategory(cat, exercises).filter(
                (e) => !usedNames.includes(e.name)
              );
              if (catExercises.length === 0) return null;

              return (
                <div key={cat}>
                  <button
                    onClick={() =>
                      setExpandedCategory(isOpen ? null : cat)
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium text-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryDot cat={cat} />
                      {cat}
                      <span className="text-xs text-gray-600">
                        ({catExercises.length})
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-3 border-l border-gray-800 pl-2 space-y-0.5 mb-1">
                      {catExercises.slice(0, 20).map((ex) => (
                        <ExerciseRow
                          key={ex.id}
                          exercise={ex}
                          used={false}
                          onSelect={handleSelect}
                          compact
                        />
                      ))}
                      {catExercises.length > 20 && (
                        <p className="text-xs text-gray-600 px-3 py-1">
                          +{catExercises.length - 20} more — use search to find them
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request form modal */}
      {showRequestForm && (
        <div className="absolute inset-0 z-20 bg-gray-900/95 rounded-xl flex flex-col p-4 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
              <Send className="w-4 h-4" /> Oefening aanvragen
            </span>
            <button onClick={() => setShowRequestForm(false)} className="p-1 rounded hover:bg-gray-800 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {requestSent ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-green-600/20 border border-green-600/40 flex items-center justify-center">
                <Send className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-gray-200 font-medium">Aanvraag ingediend!</p>
              <p className="text-xs text-gray-500">
                &ldquo;{requestName}&rdquo; is opgeslagen als pending oefening.
              </p>
              <button
                onClick={() => setShowRequestForm(false)}
                className="mt-2 text-xs text-green-400 border border-green-700/40 rounded-lg px-4 py-1.5 hover:border-green-500 transition-colors"
              >
                Sluiten
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Naam oefening</label>
                  <input
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    placeholder="bijv. Dumbbell High Pull"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Spiergroep</label>
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                    value={requestMuscle}
                    onChange={(e) => setRequestMuscle(e.target.value as MuscleGroup)}
                  >
                    {ALL_MUSCLE_GROUPS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Toelichting (optioneel)</label>
                  <input
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="bijv. compound pull oefening"
                  />
                </div>
              </div>
              <button
                onClick={submitRequest}
                disabled={!requestName.trim()}
                className="w-full py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Aanvraag indienen
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function ExerciseRow({
  exercise,
  used,
  onSelect,
  compact = false,
}: {
  exercise: ExerciseInfo;
  used: boolean;
  onSelect: (name: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-lg transition-colors ${
        compact ? "py-1.5" : "py-2.5"
      } ${used ? "opacity-40" : ""}`}
    >
      <button
        disabled={used}
        onClick={() => !used && onSelect(exercise.name)}
        className={`flex-1 text-left px-3 ${
          used ? "cursor-not-allowed" : "hover:bg-gray-800 cursor-pointer"
        } rounded-lg py-1`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`}>
            {exercise.name}
          </span>
          {exercise.muscles && exercise.muscles.length > 0 && !compact && (
            <span className="text-xs text-gray-500 shrink-0">
              {exercise.muscles.slice(0, 2).join(", ")}
            </span>
          )}
          {used && (
            <span className="text-xs text-gray-600 shrink-0">added</span>
          )}
        </div>
      </button>
      {/* Info button → exercise detail page */}
      <a
        href={`/exercises/${slugify(exercise.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        title="View exercise details"
        onClick={(e) => e.stopPropagation()}
      >
        <Info className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function CategoryDot({ cat }: { cat: string }) {
  const colors: Record<string, string> = {
    Chest: "bg-blue-500",
    Back: "bg-green-500",
    Legs: "bg-yellow-500",
    Shoulders: "bg-purple-500",
    Arms: "bg-red-500",
    Core: "bg-orange-500",
  };
  return (
    <span
      className={`w-2 h-2 rounded-full inline-block ${colors[cat] ?? "bg-gray-500"}`}
    />
  );
}
