/**
 * Fetches full exercise detail from wger API
 * Uses /api/v2/exerciseinfo/{id}/ — returns everything in one call
 */

export type MuscleDetail = {
  id: number;
  name: string;      // Dutch/default
  name_en: string;   // English
  is_front: boolean;
  image_url_main: string;
  image_url_secondary: string;
};

export type ExerciseImageDetail = {
  id: number;
  image: string;
  is_main: boolean;
};

export type WgerExerciseInfo = {
  id: number;
  name: string;
  description: string;       // HTML description
  category: { id: number; name: string };
  muscles: MuscleDetail[];
  muscles_secondary: MuscleDetail[];
  equipment: { id: number; name: string }[];
  images: ExerciseImageDetail[];
};

const DETAIL_CACHE: Record<number, WgerExerciseInfo> = {};

export async function fetchExerciseDetail(wgerId: number): Promise<WgerExerciseInfo | null> {
  if (DETAIL_CACHE[wgerId]) return DETAIL_CACHE[wgerId];

  try {
    const res = await fetch(
      `https://wger.de/api/v2/exerciseinfo/${wgerId}/?format=json`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`wger ${res.status}`);
    const json = await res.json();

    // Extract English translation
    const translation = (json.translations ?? []).find(
      (t: { language: number; name: string; description: string }) => t.language === 2
    );

    const detail: WgerExerciseInfo = {
      id: json.id,
      name: translation?.name ?? json.name ?? "",
      description: translation?.description ?? "",
      category: json.category ?? { id: 0, name: "" },
      muscles: json.muscles ?? [],
      muscles_secondary: json.muscles_secondary ?? [],
      equipment: json.equipment ?? [],
      images: (json.images ?? []).map((img: { id: number; image: string; is_main: boolean }) => ({
        id: img.id,
        image: img.image,
        is_main: img.is_main,
      })),
    };

    DETAIL_CACHE[wgerId] = detail;
    return detail;
  } catch {
    return null;
  }
}

/** Strip HTML tags from wger description */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim();
}

/** Map wger muscle names to our MuscleGroup SVG keys */
export function muscleNameToKey(name: string): string {
  const map: Record<string, string> = {
    "Biceps brachii": "biceps",
    "Triceps brachii": "triceps",
    "Pectoralis major": "chest",
    "Latissimus dorsi": "back",
    "Trapezius": "back",
    "Deltoid": "shoulders",
    "Rectus abdominis": "core",
    "Quadriceps femoris": "quads",
    "Biceps femoris": "hamstrings",
    "Gluteus maximus": "glutes",
    "Gastrocnemius": "calves",
    "Soleus": "calves",
  };
  return map[name] ?? name.toLowerCase().replace(/\s+/g, "_");
}

/** Find wger exercise ID by name from their search API */
export async function searchWgerExerciseId(name: string): Promise<number | null> {
  try {
    const encoded = encodeURIComponent(name);
    const res = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encoded}&language=english&format=json`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const suggestions = json.suggestions ?? [];
    if (suggestions.length === 0) return null;
    return suggestions[0]?.data?.base_id ?? null;
  } catch {
    return null;
  }
}
