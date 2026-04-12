"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchExerciseDetail, searchWgerExerciseId, stripHtml, muscleNameToKey, type WgerExerciseInfo } from "@/lib/exerciseDetail";
import { EXERCISE_DETAILS } from "@/lib/exerciseDatabase";
import MuscleMap from "@/components/MuscleMap";
import type { MuscleGroup } from "@/lib/exerciseDatabase";
import { ChevronLeft, Dumbbell, Loader2, ImageOff } from "lucide-react";

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [wgerData, setWgerData] = useState<WgerExerciseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"front" | "back">("front");
  const [activeImg, setActiveImg] = useState(0);

  // Check static database first
  const staticEx = EXERCISE_DETAILS.find((e) => e.id === id);

  // Decode name from slug — e.g. "bicep-curl" → "Bicep Curl"
  const nameFromSlug = id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  useEffect(() => {
    async function load() {
      setLoading(true);
      let wgerId: number | null = null;

      // 1. Try static DB for wger ID
      if (staticEx?.id) {
        // look up from exercises.ts fallback list by name
      }

      // 2. Search wger by name
      wgerId = await searchWgerExerciseId(nameFromSlug);

      if (wgerId) {
        const detail = await fetchExerciseDetail(wgerId);
        setWgerData(detail);
      }
      setLoading(false);
    }
    load();
  }, [id, nameFromSlug]);

  // Combine: wger data takes priority, fall back to static
  const name = (wgerData?.name || staticEx?.name || nameFromSlug);
  const descriptionRaw = wgerData?.description || staticEx?.description || "";
  const description = stripHtml(descriptionRaw);
  const equipment = wgerData?.equipment?.map((e) => e.name).join(", ") || staticEx?.equipment || "—";
  const category = wgerData?.category?.name || staticEx?.category || "—";

  const primaryMuscles = wgerData
    ? wgerData.muscles.map((m) => muscleNameToKey(m.name_en) as MuscleGroup)
    : (staticEx?.primaryMuscles ?? []);

  const secondaryMuscles = wgerData
    ? wgerData.muscles_secondary.map((m) => muscleNameToKey(m.name_en) as MuscleGroup)
    : (staticEx?.secondaryMuscles ?? []);

  const images = wgerData?.images ?? [];
  const steps = staticEx?.steps ?? [];
  const tips = staticEx?.tips ?? [];

  // Muscle names for display
  const primaryNames = wgerData
    ? wgerData.muscles.map((m) => m.name_en)
    : primaryMuscles;
  const secondaryNames = wgerData
    ? wgerData.muscles_secondary.map((m) => m.name_en)
    : secondaryMuscles;

  return (
    <div className="sm:ml-52 space-y-6 pb-10">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Terug
      </button>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-600/15 flex items-center justify-center shrink-0 mt-1">
          <Dumbbell className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {equipment && equipment !== "—" && (
              <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-1 rounded-full">
                {equipment}
              </span>
            )}
            {category && category !== "—" && (
              <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-1 rounded-full">
                {category}
              </span>
            )}
            {staticEx?.difficulty && (
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                staticEx.difficulty === "Beginner" ? "bg-green-600/20 border-green-700/40 text-green-400" :
                staticEx.difficulty === "Intermediate" ? "bg-yellow-600/20 border-yellow-700/40 text-yellow-400" :
                "bg-red-600/20 border-red-700/40 text-red-400"
              }`}>
                {staticEx.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Oefening laden…
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Muscle map + images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Muscle map */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Spiergroepen</h2>
            <div className="flex items-center bg-gray-800 rounded-lg p-0.5 text-xs">
              <button onClick={() => setView("front")}
                className={`px-3 py-1 rounded-md transition-colors ${view === "front" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>
                Voor
              </button>
              <button onClick={() => setView("back")}
                className={`px-3 py-1 rounded-md transition-colors ${view === "back" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>
                Achter
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-28 shrink-0">
              <MuscleMap primary={primaryMuscles} secondary={secondaryMuscles} view={view} />
            </div>
            <div className="space-y-3 flex-1 pt-1">
              {primaryNames.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Primair</p>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryNames.map((m, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-green-600/20 border border-green-700/40 text-green-400">
                        {String(m)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {secondaryNames.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Secundair</p>
                  <div className="flex flex-wrap gap-1.5">
                    {secondaryNames.map((m, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-orange-600/20 border border-orange-700/40 text-orange-400">
                        {String(m)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {primaryNames.length === 0 && secondaryNames.length === 0 && !loading && (
                <p className="text-xs text-gray-600">Geen spierdata beschikbaar</p>
              )}
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" /> Primair
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" /> Secundair
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise images from wger */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold">Uitvoering</h2>
          <div className="rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center min-h-48">
            {loading ? (
              <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
            ) : images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeImg]?.image}
                alt={`${name} uitvoering`}
                className="w-full object-contain rounded-xl max-h-64"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : staticEx?.gifUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={staticEx.gifUrl}
                alt={`${name} uitvoering`}
                className="w-full object-contain rounded-xl max-h-64"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-gray-600">
                <ImageOff className="w-8 h-8" />
                <p className="text-xs">Geen afbeelding beschikbaar</p>
              </div>
            )}
          </div>
          {/* Thumbnail row if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.image}
                  alt={`${name} ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition-colors shrink-0 ${
                    activeImg === i ? "border-green-500" : "border-gray-700 hover:border-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step-by-step */}
      {steps.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold">Stap voor stap</h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-600/20 border border-green-700/40 text-green-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold">💡 Tips</h2>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span className="text-yellow-500 shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
