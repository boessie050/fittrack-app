"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  loadExercises,
  fetchExerciseImages,
  type ExerciseInfo,
  type ExerciseImage,
} from "@/lib/exercises";
import { ArrowLeft, Dumbbell, Target } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Chest: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Back: "bg-green-500/20 text-green-300 border-green-500/30",
  Legs: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Shoulders: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Arms: "bg-red-500/20 text-red-300 border-red-500/30",
  Core: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = decodeURIComponent(params.id as string);

  const [exercise, setExercise] = useState<ExerciseInfo | null>(null);
  const [images, setImages] = useState<ExerciseImage[]>([]);
  const [loadingExercise, setLoadingExercise] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Load exercise from library
  useEffect(() => {
    loadExercises().then((all) => {
      // Match by id or by name (slug)
      const found =
        all.find((e) => e.id === exerciseId) ??
        all.find(
          (e) => slugify(e.name) === exerciseId
        );
      setExercise(found ?? null);
      setLoadingExercise(false);
    });
  }, [exerciseId]);

  // Load images once exercise is found
  useEffect(() => {
    if (!exercise?.wgerId) return;
    setLoadingImages(true);
    fetchExerciseImages(exercise.wgerId).then((imgs) => {
      setImages(imgs);
      setLoadingImages(false);
    });
  }, [exercise]);

  if (loadingExercise) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Exercise not found.</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-green-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const categoryColor =
    CATEGORY_COLORS[exercise.category ?? ""] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30";
  const mainImage = images.find((i) => i.isMain) ?? images[0];
  const galleryImages = images.length > 0 ? images : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      {/* Back button */}
      <div className="max-w-xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Hero: GIF / Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-6 aspect-video flex items-center justify-center">
          {loadingImages && (
            <div className="text-gray-600 text-sm">Loading animation…</div>
          )}
          {!loadingImages && galleryImages && galleryImages.length > 0 ? (
            <img
              src={galleryImages[activeImage].image}
              alt={exercise.name}
              className="w-full h-full object-contain"
            />
          ) : (
            !loadingImages && (
              <div className="flex flex-col items-center gap-3 text-gray-700">
                <Dumbbell className="w-12 h-12" />
                <span className="text-sm">No animation available</span>
              </div>
            )
          )}
        </div>

        {/* Image thumbnails (if multiple) */}
        {galleryImages && galleryImages.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {galleryImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage === i
                    ? "border-green-500"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <img
                  src={img.image}
                  alt={`View ${i + 1}`}
                  className="w-full h-full object-contain bg-gray-800"
                />
              </button>
            ))}
          </div>
        )}

        {/* Title + category */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">{exercise.name}</h1>
          {exercise.category && (
            <span
              className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full border ${categoryColor}`}
            >
              {exercise.category}
            </span>
          )}
        </div>

        {/* Muscles */}
        {exercise.muscles && exercise.muscles.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
              <Target className="w-4 h-4 text-green-400" />
              Primary muscles
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.muscles.map((m) => (
                <span
                  key={m}
                  className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
            <Dumbbell className="w-4 h-4 text-green-400" />
            Form tips
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            {getTips(exercise.name).map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function getTips(name: string): string[] {
  const lower = name.toLowerCase();
  if (lower.includes("bicep curl")) {
    return [
      "Keep your elbows tucked close to your torso throughout the movement.",
      "Fully extend your arms at the bottom — don't cut the range of motion short.",
      "Control the lowering phase (eccentric) for maximum muscle activation.",
      "Avoid swinging your back or using momentum.",
    ];
  }
  if (lower.includes("squat")) {
    return [
      "Keep your chest up and core tight.",
      "Drive your knees out in line with your toes.",
      "Break parallel for full range of motion.",
    ];
  }
  if (lower.includes("bench press")) {
    return [
      "Retract your shoulder blades and keep them pinched together.",
      "Lower the bar to your lower chest — not your neck.",
      "Drive your feet into the floor for stability.",
    ];
  }
  if (lower.includes("deadlift")) {
    return [
      "Keep the bar close to your body throughout the lift.",
      "Hinge at the hips, not the lower back.",
      "Engage your lats before you pull.",
    ];
  }
  // Generic fallback
  return [
    "Focus on controlled movement — avoid using momentum.",
    "Breathe out on the exertion phase.",
    "Maintain proper posture and core engagement.",
  ];
}
