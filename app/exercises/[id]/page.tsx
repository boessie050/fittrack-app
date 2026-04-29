"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchExerciseDetail, searchWgerExerciseId, stripHtml, muscleNameToKey, type WgerExerciseInfo } from "@/lib/exerciseDetail";
import { getExerciseDetail } from "@/lib/exerciseDatabase";
import { useLanguage } from "@/lib/useLanguage";
import MuscleMap from "@/components/MuscleMap";
import type { MuscleGroup } from "@/lib/exerciseDatabase";
import {
  ChevronLeft, Dumbbell, Loader2, ImageOff,
  FlaskConical, ListChecks, Lightbulb, AlertTriangle,
  Shuffle, BarChart2, Play, Youtube,
} from "lucide-react";

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DifficultyBadge({ level, lang }: { level: string; lang: string }) {
  const labels: Record<string, { nl: string; en: string }> = {
    Beginner: { nl: "Beginner", en: "Beginner" },
    Intermediate: { nl: "Gevorderd", en: "Intermediate" },
    Advanced: { nl: "Expert", en: "Advanced" },
  };
  const colors: Record<string, string> = {
    Beginner: "bg-green-600/20 border-green-700/40 text-green-400",
    Intermediate: "bg-yellow-600/20 border-yellow-700/40 text-yellow-400",
    Advanced: "bg-red-600/20 border-red-700/40 text-red-400",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${colors[level] ?? "bg-gray-700 border-gray-600 text-gray-300"}`}>
      {labels[level]?.[lang as "nl" | "en"] ?? level}
    </span>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
      <h2 className="text-sm font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── YouTube embed ────────────────────────────────────────────────────────────
function YouTubeEmbed({ videoId, creator, lang }: { videoId: string; creator: string; lang: string }) {
  const [show, setShow] = useState(false);
  const label = lang === "nl" ? "Bekijk techniek video" : "Watch technique video";
  const by = lang === "nl" ? "door" : "by";

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full rounded-xl overflow-hidden relative group cursor-pointer"
        style={{ paddingBottom: "56.25%", position: "relative" }}
      >
        {/* Thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt="YouTube thumbnail"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </div>
          <p className="text-white text-sm font-semibold drop-shadow">{label}</p>
          <p className="text-white/70 text-xs drop-shadow flex items-center gap-1">
            <Youtube className="w-3.5 h-3.5" /> {by} {creator}
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Exercise technique video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang } = useLanguage();

  const [wgerData, setWgerData] = useState<WgerExerciseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"front" | "back">("front");
  const [activeImg, setActiveImg] = useState(0);

  const staticEx = getExerciseDetail(id);
  const nameFromSlug = id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const wgerId = await searchWgerExerciseId(nameFromSlug);
      if (wgerId) {
        const detail = await fetchExerciseDetail(wgerId);
        setWgerData(detail);
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Data resolution ──────────────────────────────────────────────────────
  const name = wgerData?.name || staticEx?.name || nameFromSlug;
  const equipment = wgerData?.equipment?.map((e) => e.name).join(", ") || staticEx?.equipment || "—";
  const category = wgerData?.category?.name || staticEx?.category || "—";

  const primaryMuscles: MuscleGroup[] = wgerData
    ? wgerData.muscles.map((m) => muscleNameToKey(m.name_en) as MuscleGroup)
    : (staticEx?.primaryMuscles ?? []);

  const secondaryMuscles: MuscleGroup[] = wgerData
    ? wgerData.muscles_secondary.map((m) => muscleNameToKey(m.name_en) as MuscleGroup)
    : (staticEx?.secondaryMuscles ?? []);

  const primaryNames = wgerData ? wgerData.muscles.map((m) => m.name_en) : primaryMuscles.map(String);
  const secondaryNames = wgerData ? wgerData.muscles_secondary.map((m) => m.name_en) : secondaryMuscles.map(String);

  // GIF priority: wger images → static fallbackGifUrl
  const wgerImages = wgerData?.images ?? [];
  const fallbackGifUrl = staticEx?.fallbackGifUrl;

  // Bilingual helpers
  const desc = staticEx?.description
    ? staticEx.description[lang]
    : wgerData?.description
      ? stripHtml(wgerData.description)
      : "";

  const ui = {
    back: lang === "nl" ? "Terug" : "Back",
    muscles: lang === "nl" ? "Spiergroepen" : "Muscle Groups",
    front: lang === "nl" ? "Voor" : "Front",
    backView: lang === "nl" ? "Achter" : "Back",
    primary: lang === "nl" ? "Primair" : "Primary",
    secondary: lang === "nl" ? "Secundair" : "Secondary",
    visual: lang === "nl" ? "Uitvoering" : "Execution",
    science: lang === "nl" ? "Waarom werkt dit?" : "Why does this work?",
    steps: lang === "nl" ? "Stap voor stap" : "Step by step",
    tips: lang === "nl" ? "Tips" : "Tips",
    mistakes: lang === "nl" ? "Veelgemaakte fouten" : "Common mistakes",
    variants: lang === "nl" ? "Varianten" : "Variants",
    repRanges: lang === "nl" ? "Aanbevolen rep-ranges" : "Recommended rep ranges",
    technique: lang === "nl" ? "Techniek video" : "Technique video",
    noImage: lang === "nl" ? "Geen afbeelding beschikbaar" : "No image available",
    noMuscle: lang === "nl" ? "Geen spierdata beschikbaar" : "No muscle data available",
  };

  return (
    <div className="sm:ml-52 space-y-5 pb-16">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors">
        <ChevronLeft className="w-4 h-4" /> {ui.back}
      </button>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-600/15 flex items-center justify-center shrink-0 mt-1">
          <Dumbbell className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1 min-w-0">
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
              <DifficultyBadge level={staticEx.difficulty} lang={lang} />
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          {lang === "nl" ? "Oefening laden…" : "Loading exercise…"}
        </div>
      )}

      {/* Description */}
      {desc && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
        </div>
      )}

      {/* Muscle map + GIF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Muscle map */}
        <SectionCard icon={<span className="text-base">💪</span>} title={ui.muscles}>
          <div className="flex items-center bg-gray-800 rounded-lg p-0.5 text-xs w-fit">
            <button onClick={() => setView("front")}
              className={`px-3 py-1 rounded-md transition-colors ${view === "front" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>
              {ui.front}
            </button>
            <button onClick={() => setView("back")}
              className={`px-3 py-1 rounded-md transition-colors ${view === "back" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>
              {ui.backView}
            </button>
          </div>
          <div className="flex gap-4">
            <div className="w-28 shrink-0">
              <MuscleMap primary={primaryMuscles} secondary={secondaryMuscles} view={view} />
            </div>
            <div className="space-y-3 flex-1 pt-1">
              {primaryNames.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">{ui.primary}</p>
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
                  <p className="text-xs text-gray-500 mb-1.5">{ui.secondary}</p>
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
                <p className="text-xs text-gray-600">{ui.noMuscle}</p>
              )}
              <div className="space-y-1 pt-1 border-t border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" /> {ui.primary}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" /> {ui.secondary}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* GIF / image — only shown when there is actual media */}
        {!loading && (wgerImages.length > 0 || fallbackGifUrl) && (
          <SectionCard icon={<span className="text-base">🎬</span>} title={ui.visual}>
            <div className="rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center min-h-48">
              {wgerImages.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={wgerImages[activeImg]?.image}
                  alt={`${name} uitvoering`}
                  className="w-full object-contain rounded-xl max-h-64"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fallbackGifUrl}
                  alt={`${name} uitvoering`}
                  className="w-full object-contain rounded-xl max-h-64"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
            {wgerImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {wgerImages.map((img, i) => (
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
          </SectionCard>
        )}
      </div>

      {/* YouTube video */}
      {staticEx?.youtubeId && (
        <SectionCard icon={<Youtube className="w-4 h-4 text-red-500" />} title={ui.technique}>
          <YouTubeEmbed videoId={staticEx.youtubeId} creator={staticEx.youtubeCreator} lang={lang} />
        </SectionCard>
      )}

      {/* Science note */}
      {staticEx?.scienceNote && (
        <SectionCard icon={<FlaskConical className="w-4 h-4 text-blue-400" />} title={ui.science}>
          <p className="text-sm text-blue-200/80 leading-relaxed bg-blue-900/10 border border-blue-700/20 rounded-xl p-3">
            {staticEx.scienceNote[lang]}
          </p>
        </SectionCard>
      )}

      {/* Steps */}
      {staticEx?.steps && staticEx.steps.length > 0 && (
        <SectionCard icon={<ListChecks className="w-4 h-4 text-green-400" />} title={ui.steps}>
          <ol className="space-y-3">
            {staticEx.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-600/20 border border-green-700/40 text-green-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-300 leading-relaxed">{step[lang]}</p>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* Tips */}
      {staticEx?.tips && staticEx.tips.length > 0 && (
        <SectionCard icon={<Lightbulb className="w-4 h-4 text-yellow-400" />} title={ui.tips}>
          <ul className="space-y-2">
            {staticEx.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300 bg-yellow-900/10 border border-yellow-700/20 rounded-lg px-3 py-2">
                <span className="text-yellow-500 shrink-0 mt-0.5">→</span>
                {tip[lang]}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Common mistakes */}
      {staticEx?.commonMistakes && staticEx.commonMistakes.length > 0 && (
        <SectionCard icon={<AlertTriangle className="w-4 h-4 text-red-400" />} title={ui.mistakes}>
          <ul className="space-y-2">
            {staticEx.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300 bg-red-900/10 border border-red-700/20 rounded-lg px-3 py-2">
                <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                {m[lang]}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Variants */}
      {staticEx?.variants && staticEx.variants.length > 0 && (
        <SectionCard icon={<Shuffle className="w-4 h-4 text-purple-400" />} title={ui.variants}>
          <div className="space-y-2">
            {staticEx.variants.map((v, i) => (
              <div key={i} className="flex items-start gap-3 bg-purple-900/10 border border-purple-700/20 rounded-lg px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-purple-300">{v.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{v.difference[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Rep ranges */}
      {staticEx?.repRanges && staticEx.repRanges.length > 0 && (
        <SectionCard icon={<BarChart2 className="w-4 h-4 text-cyan-400" />} title={ui.repRanges}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {staticEx.repRanges.map((r, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3 space-y-1.5 text-center">
                <p className="text-xs font-semibold text-cyan-300">{r.goal[lang]}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{lang === "nl" ? "Sets" : "Sets"}</span>
                    <span className="text-white font-medium">{r.sets}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{lang === "nl" ? "Reps" : "Reps"}</span>
                    <span className="text-white font-medium">{r.reps}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{lang === "nl" ? "Rust" : "Rest"}</span>
                    <span className="text-white font-medium">{r.rest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
