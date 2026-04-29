/**
 * Exercise service
 * - Fetches exercises from the wger REST API (https://wger.de/api/v2/)
 * - Caches results in localStorage (24h TTL)
 * - Falls back to a built-in list when offline or API is unavailable
 * - Fuzzy search powered by Fuse.js
 */

import Fuse from "fuse.js";

export type ExerciseInfo = {
  id: string;
  name: string;
  category?: string; // e.g. "Chest", "Back", "Legs"
  muscles?: string[]; // primary muscles
  aliases?: string[]; // alternative search terms
  wgerId?: number;   // numeric ID from wger (for image lookup)
};

// ─── Exercise image fetcher ──────────────────────────────────────────────────
export type ExerciseImage = {
  id: number;
  image: string; // URL to the image (can be animated GIF)
  isMain: boolean;
};

const IMAGE_CACHE: Record<string, ExerciseImage[]> = {};

export async function fetchExerciseImages(
  wgerId: number
): Promise<ExerciseImage[]> {
  const key = String(wgerId);
  if (IMAGE_CACHE[key]) return IMAGE_CACHE[key];

  try {
    const res = await fetch(
      `https://wger.de/api/v2/exerciseimage/?format=json&exercise_base=${wgerId}&limit=10`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`wger image API ${res.status}`);
    const json = await res.json();
    const images: ExerciseImage[] = (json.results ?? []).map(
      (img: { id: number; image: string; is_main: boolean }) => ({
        id: img.id,
        image: img.image,
        isMain: img.is_main,
      })
    );
    IMAGE_CACHE[key] = images;
    return images;
  } catch {
    return [];
  }
}

// ─── Built-in fallback list ──────────────────────────────────────────────────
const FALLBACK_EXERCISES: ExerciseInfo[] = [
  // ── BICEPS ──────────────────────────────────────────────────────────────────
  { id: "b-1",  name: "Straight Bar Curl",           category: "Arms", muscles: ["Biceps"] },
  { id: "b-2",  name: "EZ-Bar Curl",                 category: "Arms", muscles: ["Biceps"] },
  { id: "b-3",  name: "Barbell Preacher Curl",        category: "Arms", muscles: ["Biceps"] },
  { id: "b-4",  name: "Barbell Reverse Curl",         category: "Arms", muscles: ["Biceps", "Brachialis"] },
  { id: "b-5",  name: "Standard Dumbbell Curl",       category: "Arms", muscles: ["Biceps"] },
  { id: "b-6",  name: "Incline Dumbbell Curl",        category: "Arms", muscles: ["Biceps"] },
  { id: "b-7",  name: "Concentration Curl",           category: "Arms", muscles: ["Biceps"] },
  { id: "b-8",  name: "Hammer Curl",                  category: "Arms", muscles: ["Biceps", "Brachialis"] },
  { id: "b-9",  name: "Decline Dumbbell Curl",        category: "Arms", muscles: ["Biceps"] },
  { id: "b-10", name: "Zottman Curl",                 category: "Arms", muscles: ["Biceps", "Brachialis"] },
  { id: "b-11", name: "Spider Curl",                  category: "Arms", muscles: ["Biceps"] },
  { id: "b-12", name: "Cable Curl",                   category: "Arms", muscles: ["Biceps"] },
  { id: "b-13", name: "Cable Hammer Curl",            category: "Arms", muscles: ["Biceps", "Brachialis"] },
  { id: "b-14", name: "Overhead Cable Curl",          category: "Arms", muscles: ["Biceps"] },
  { id: "b-15", name: "Single-Arm Cable Curl",        category: "Arms", muscles: ["Biceps"] },
  { id: "b-16", name: "Machine Bicep Curl",           category: "Arms", muscles: ["Biceps"] },
  { id: "b-17", name: "Preacher Curl Machine",        category: "Arms", muscles: ["Biceps"] },

  // ── TRICEPS ─────────────────────────────────────────────────────────────────
  { id: "t-1",  name: "Tricep Dips",                  category: "Arms", muscles: ["Triceps"], aliases: ["dips", "tricep dip", "dip", "triceps dips", "parallel bar dip"] },
  { id: "t-2",  name: "Weighted Dips",                category: "Arms", muscles: ["Triceps", "Chest"], aliases: ["weighted dip", "belt dip"] },
  { id: "t-3",  name: "Bench Dips",                   category: "Arms", muscles: ["Triceps"], aliases: ["bench dip", "chair dip"] },
  { id: "t-4",  name: "Floor Dips",                   category: "Arms", muscles: ["Triceps"], aliases: ["floor dip"] },
  { id: "t-5",  name: "Barbell Skull Crusher",        category: "Arms", muscles: ["Triceps"] },
  { id: "t-6",  name: "EZ-Bar Skull Crusher",         category: "Arms", muscles: ["Triceps"] },
  { id: "t-7",  name: "Dumbbell Skull Crusher",       category: "Arms", muscles: ["Triceps"] },
  { id: "t-8",  name: "Decline Skull Crusher",        category: "Arms", muscles: ["Triceps"] },
  { id: "t-9",  name: "Overhead Rope Extension",      category: "Arms", muscles: ["Triceps"] },
  { id: "t-10", name: "Overhead Dumbbell Extension",  category: "Arms", muscles: ["Triceps"] },
  { id: "t-11", name: "Overhead Barbell Extension",   category: "Arms", muscles: ["Triceps"] },
  { id: "t-12", name: "JM Press",                     category: "Arms", muscles: ["Triceps"] },
  { id: "t-13", name: "Rope Tricep Pushdown",         category: "Arms", muscles: ["Triceps"] },
  { id: "t-14", name: "V-Bar Pushdown",               category: "Arms", muscles: ["Triceps"] },
  { id: "t-15", name: "Straight Bar Pushdown",        category: "Arms", muscles: ["Triceps"] },
  { id: "t-16", name: "Single-Arm Cable Pushdown",    category: "Arms", muscles: ["Triceps"] },
  { id: "t-17", name: "Reverse Grip Pushdown",        category: "Arms", muscles: ["Triceps"] },
  { id: "t-18", name: "Tricep Kickback",              category: "Arms", muscles: ["Triceps"] },
  { id: "t-19", name: "Machine Tricep Extension",     category: "Arms", muscles: ["Triceps"] },
  { id: "t-20", name: "Close-Grip Bench Press",       category: "Arms", muscles: ["Triceps", "Chest"] },

  // ── CHEST ───────────────────────────────────────────────────────────────────
  { id: "c-1",  name: "Flat Barbell Bench Press",     category: "Chest", muscles: ["Pectorals", "Triceps"] },
  { id: "c-2",  name: "Incline Barbell Bench Press",  category: "Chest", muscles: ["Pectorals"] },
  { id: "c-3",  name: "Decline Barbell Bench Press",  category: "Chest", muscles: ["Pectorals"] },
  { id: "c-4",  name: "Reverse Grip Bench Press",     category: "Chest", muscles: ["Pectorals"] },
  { id: "c-5",  name: "Flat Dumbbell Bench Press",    category: "Chest", muscles: ["Pectorals"] },
  { id: "c-6",  name: "Incline Dumbbell Bench Press", category: "Chest", muscles: ["Pectorals"] },
  { id: "c-7",  name: "Decline Dumbbell Bench Press", category: "Chest", muscles: ["Pectorals"] },
  { id: "c-8",  name: "Neutral Grip Dumbbell Press",  category: "Chest", muscles: ["Pectorals"] },
  { id: "c-9",  name: "Single-Arm Dumbbell Press",    category: "Chest", muscles: ["Pectorals"] },
  { id: "c-10", name: "Flat Dumbbell Fly",            category: "Chest", muscles: ["Pectorals"] },
  { id: "c-11", name: "Incline Dumbbell Fly",         category: "Chest", muscles: ["Pectorals"] },
  { id: "c-12", name: "Decline Dumbbell Fly",         category: "Chest", muscles: ["Pectorals"] },
  { id: "c-13", name: "Cable Crossover",              category: "Chest", muscles: ["Pectorals"] },
  { id: "c-14", name: "Pec Deck Machine",             category: "Chest", muscles: ["Pectorals"] },
  { id: "c-15", name: "Chest-Supported Fly",         category: "Chest", muscles: ["Pectorals"] },
  { id: "c-16", name: "Standard Push-Up",             category: "Chest", muscles: ["Pectorals", "Triceps"] },
  { id: "c-17", name: "Wide Grip Push-Up",            category: "Chest", muscles: ["Pectorals"] },
  { id: "c-18", name: "Diamond Push-Up",              category: "Chest", muscles: ["Triceps", "Pectorals"] },
  { id: "c-19", name: "Decline Push-Up",              category: "Chest", muscles: ["Pectorals"] },
  { id: "c-20", name: "Weighted Push-Up",             category: "Chest", muscles: ["Pectorals"] },
  { id: "c-21", name: "Weighted Chest Dips",          category: "Chest", muscles: ["Pectorals", "Triceps"] },
  { id: "c-22", name: "Machine Chest Press",          category: "Chest", muscles: ["Pectorals"] },
  { id: "c-23", name: "Landmine Press",               category: "Chest", muscles: ["Pectorals", "Deltoids"] },

  // ── BACK ────────────────────────────────────────────────────────────────────
  { id: "bk-1",  name: "Bent-Over Barbell Row",       category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-2",  name: "Yates Row",                   category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-3",  name: "Pendlay Row",                 category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-4",  name: "T-Bar Row",                   category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-5",  name: "Single-Arm Dumbbell Row",     category: "Back", muscles: ["Lats"] },
  { id: "bk-6",  name: "Kroc Row",                    category: "Back", muscles: ["Lats"] },
  { id: "bk-7",  name: "Seal Row",                    category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-8",  name: "Incline Bench Dumbbell Row",  category: "Back", muscles: ["Lats"] },
  { id: "bk-9",  name: "Pull-Up",                     category: "Back", muscles: ["Lats"] },
  { id: "bk-10", name: "Chin-Up",                     category: "Back", muscles: ["Lats", "Biceps"] },
  { id: "bk-11", name: "Neutral Grip Pull-Up",        category: "Back", muscles: ["Lats", "Biceps"] },
  { id: "bk-12", name: "Close Grip Pull-Up",          category: "Back", muscles: ["Lats"] },
  { id: "bk-13", name: "Weighted Pull-Up",            category: "Back", muscles: ["Lats"] },
  { id: "bk-14", name: "Assisted Pull-Up",            category: "Back", muscles: ["Lats"] },
  { id: "bk-15", name: "Wide Grip Lat Pulldown",      category: "Back", muscles: ["Lats"] },
  { id: "bk-16", name: "Close Grip Lat Pulldown",     category: "Back", muscles: ["Lats"] },
  { id: "bk-17", name: "Reverse Grip Lat Pulldown",   category: "Back", muscles: ["Lats", "Biceps"] },
  { id: "bk-18", name: "Neutral Grip Lat Pulldown",   category: "Back", muscles: ["Lats"] },
  { id: "bk-19", name: "Single-Arm Lat Pulldown",     category: "Back", muscles: ["Lats"] },
  { id: "bk-20", name: "Straight-Arm Lat Pulldown",   category: "Back", muscles: ["Lats"] },
  { id: "bk-21", name: "Seated Cable Row",             category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-22", name: "Single-Arm Cable Row",        category: "Back", muscles: ["Lats"] },
  { id: "bk-23", name: "Machine Row",                 category: "Back", muscles: ["Lats", "Rhomboids"] },
  { id: "bk-24", name: "Landmine Row",                category: "Back", muscles: ["Lats"] },
  { id: "bk-25", name: "Conventional Deadlift",       category: "Back", muscles: ["Erector Spinae", "Glutes", "Hamstrings"] },
  { id: "bk-26", name: "Sumo Deadlift",               category: "Back", muscles: ["Glutes", "Hamstrings"] },
  { id: "bk-27", name: "Trap Bar Deadlift",           category: "Back", muscles: ["Erector Spinae", "Quadriceps"] },
  { id: "bk-28", name: "Good Morning",                category: "Back", muscles: ["Erector Spinae", "Hamstrings"] },
  { id: "bk-29", name: "Hyperextension",              category: "Back", muscles: ["Erector Spinae"] },
  { id: "bk-30", name: "Barbell Shrug",               category: "Back", muscles: ["Trapezius"] },
  { id: "bk-31", name: "Dumbbell Shrug",              category: "Back", muscles: ["Trapezius"] },

  // ── SHOULDERS ───────────────────────────────────────────────────────────────
  { id: "s-1",  name: "Barbell Military Press",       category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-2",  name: "Seated Overhead Press",        category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-3",  name: "Dumbbell Overhead Press",      category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-4",  name: "Arnold Press",                 category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-5",  name: "Machine Shoulder Press",       category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-6",  name: "Dumbbell Lateral Raise",       category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-7",  name: "Cable Lateral Raise",          category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-8",  name: "Machine Lateral Raise",        category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-9",  name: "Resistance Band Lateral Raise",category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-10", name: "Incline Bench Lateral Raise",  category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-11", name: "Leaning Lateral Raise",        category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-12", name: "Dumbbell Front Raise",         category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-13", name: "Plate Front Raise",            category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-14", name: "Barbell Front Raise",          category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-15", name: "Cable Front Raise",            category: "Shoulders", muscles: ["Deltoids"] },
  { id: "s-16", name: "Dumbbell Rear Delt Fly",       category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-17", name: "Machine Rear Delt Fly",        category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-18", name: "Cable Rear Delt Fly",          category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-19", name: "Bent-Over Lateral Raise",      category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-20", name: "Chest-Supported Rear Delt Raise", category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-21", name: "Reverse Pec Deck",             category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-22", name: "Face Pull",                    category: "Shoulders", muscles: ["Rear Deltoids", "Trapezius"] },
  { id: "s-23", name: "Band Pull-Apart",              category: "Shoulders", muscles: ["Rear Deltoids"] },
  { id: "s-24", name: "External Rotation Cable",      category: "Shoulders", muscles: ["Rotator Cuff"] },
  { id: "s-25", name: "Upright Row",                  category: "Shoulders", muscles: ["Deltoids", "Trapezius"] },
  { id: "s-26", name: "Dumbbell High Pull",            category: "Shoulders", muscles: ["Deltoids", "Trapezius"], aliases: ["high pull dumbbell", "db high pull", "dumbbell high pull"] },

  // ── LEGS — QUADS ────────────────────────────────────────────────────────────
  { id: "q-1",  name: "Barbell Back Squat",           category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-2",  name: "Front Squat",                  category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-3",  name: "Goblet Squat",                 category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-4",  name: "Hack Squat",                   category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-5",  name: "Smith Machine Squat",          category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-6",  name: "Sissy Squat",                  category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-7",  name: "Belt Squat",                   category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-8",  name: "Pendulum Squat",               category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-9",  name: "Zercher Squat",                category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-10", name: "Standard Leg Press",           category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-11", name: "Single-Leg Leg Press",         category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-12", name: "Narrow Stance Leg Press",      category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-13", name: "Wide Stance Leg Press",        category: "Legs", muscles: ["Glutes", "Quadriceps"] },
  { id: "q-14", name: "Leg Extension",                category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-15", name: "Single-Leg Leg Extension",     category: "Legs", muscles: ["Quadriceps"] },
  { id: "q-16", name: "Forward Lunge",                category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-17", name: "Reverse Lunge",                category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-18", name: "Walking Lunge",                category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-19", name: "Bulgarian Split Squat",        category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-20", name: "Step-Up",                      category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-21", name: "Lateral Lunge",                category: "Legs", muscles: ["Quadriceps", "Glutes"] },
  { id: "q-22", name: "Curtsy Lunge",                 category: "Legs", muscles: ["Quadriceps", "Glutes"] },

  // ── LEGS — HAMSTRINGS ───────────────────────────────────────────────────────
  { id: "h-1",  name: "Romanian Deadlift",            category: "Legs", muscles: ["Hamstrings", "Glutes"] },
  { id: "h-2",  name: "Stiff-Leg Deadlift",           category: "Legs", muscles: ["Hamstrings"] },
  { id: "h-3",  name: "Single-Leg Deadlift",          category: "Legs", muscles: ["Hamstrings", "Glutes"] },
  { id: "h-4",  name: "Lying Leg Curl",               category: "Legs", muscles: ["Hamstrings"] },
  { id: "h-5",  name: "Seated Leg Curl",              category: "Legs", muscles: ["Hamstrings"] },
  { id: "h-6",  name: "Standing Leg Curl",            category: "Legs", muscles: ["Hamstrings"] },
  { id: "h-7",  name: "Single-Leg Lying Leg Curl",    category: "Legs", muscles: ["Hamstrings"] },
  { id: "h-8",  name: "Nordic Hamstring Curl",        category: "Legs", muscles: ["Hamstrings"] },
  { id: "h-9",  name: "Glute-Ham Raise",              category: "Legs", muscles: ["Hamstrings", "Glutes"] },
  { id: "h-10", name: "Swiss Ball Leg Curl",          category: "Legs", muscles: ["Hamstrings"] },

  // ── LEGS — CALVES ───────────────────────────────────────────────────────────
  { id: "ca-1",  name: "Machine Standing Calf Raise", category: "Legs", muscles: ["Calves"] },
  { id: "ca-2",  name: "Barbell Standing Calf Raise", category: "Legs", muscles: ["Calves"] },
  { id: "ca-3",  name: "Dumbbell Standing Calf Raise",category: "Legs", muscles: ["Calves"] },
  { id: "ca-4",  name: "Smith Machine Calf Raise",    category: "Legs", muscles: ["Calves"] },
  { id: "ca-5",  name: "Single-Leg Calf Raise",       category: "Legs", muscles: ["Calves"] },
  { id: "ca-6",  name: "Seated Calf Raise",           category: "Legs", muscles: ["Calves"] },
  { id: "ca-7",  name: "Dumbbell Seated Calf Raise",  category: "Legs", muscles: ["Calves"] },
  { id: "ca-8",  name: "Donkey Calf Raise",           category: "Legs", muscles: ["Calves"] },
  { id: "ca-9",  name: "Leg Press Calf Raise",        category: "Legs", muscles: ["Calves"] },

  // ── GLUTES ──────────────────────────────────────────────────────────────────
  { id: "g-1",  name: "Barbell Hip Thrust",           category: "Legs", muscles: ["Glutes"] },
  { id: "g-2",  name: "Dumbbell Hip Thrust",          category: "Legs", muscles: ["Glutes"] },
  { id: "g-3",  name: "Machine Hip Thrust",           category: "Legs", muscles: ["Glutes"] },
  { id: "g-4",  name: "Single-Leg Hip Thrust",        category: "Legs", muscles: ["Glutes"] },
  { id: "g-5",  name: "Elevated Hip Thrust",          category: "Legs", muscles: ["Glutes"] },
  { id: "g-6",  name: "Glute Bridge",                 category: "Legs", muscles: ["Glutes"] },
  { id: "g-7",  name: "Weighted Glute Bridge",        category: "Legs", muscles: ["Glutes"] },
  { id: "g-8",  name: "Single-Leg Glute Bridge",      category: "Legs", muscles: ["Glutes"] },
  { id: "g-9",  name: "Sumo Squat",                   category: "Legs", muscles: ["Glutes", "Quadriceps"] },
  { id: "g-10", name: "Wide Stance Squat",            category: "Legs", muscles: ["Glutes", "Quadriceps"] },
  { id: "g-11", name: "Glute Kickback Machine",       category: "Legs", muscles: ["Glutes"] },
  { id: "g-12", name: "Cable Kickback",               category: "Legs", muscles: ["Glutes"] },
  { id: "g-13", name: "Donkey Kick",                  category: "Legs", muscles: ["Glutes"] },
  { id: "g-14", name: "Leverage Glute Drive",         category: "Legs", muscles: ["Glutes"] },

  // ── CORE ────────────────────────────────────────────────────────────────────
  { id: "co-1",  name: "Standard Plank",              category: "Core", muscles: ["Abs"] },
  { id: "co-2",  name: "Push-Up Plank",               category: "Core", muscles: ["Abs"] },
  { id: "co-3",  name: "Side Plank",                  category: "Core", muscles: ["Obliques"] },
  { id: "co-4",  name: "Side Plank Reach",            category: "Core", muscles: ["Obliques"] },
  { id: "co-5",  name: "Plank with Shoulder Tap",     category: "Core", muscles: ["Abs"] },
  { id: "co-6",  name: "Plank Knee to Elbow",         category: "Core", muscles: ["Abs", "Obliques"] },
  { id: "co-7",  name: "Reverse Plank",               category: "Core", muscles: ["Abs"] },
  { id: "co-8",  name: "Plank Rotation",              category: "Core", muscles: ["Obliques"] },
  { id: "co-9",  name: "Machine Crunch",              category: "Core", muscles: ["Abs"] },
  { id: "co-10", name: "Cable Crunch",                category: "Core", muscles: ["Abs"] },
  { id: "co-11", name: "Decline Bench Crunch",        category: "Core", muscles: ["Abs"] },
  { id: "co-12", name: "Swiss Ball Crunch",           category: "Core", muscles: ["Abs"] },
  { id: "co-13", name: "Weighted Crunch",             category: "Core", muscles: ["Abs"] },
  { id: "co-14", name: "Bicycle Crunch",              category: "Core", muscles: ["Abs", "Obliques"] },
  { id: "co-15", name: "Hanging Knee Raise",          category: "Core", muscles: ["Abs"] },
  { id: "co-16", name: "Hanging Leg Raise",           category: "Core", muscles: ["Abs"] },
  { id: "co-17", name: "Hanging Straight Leg Raise",  category: "Core", muscles: ["Abs"] },
  { id: "co-18", name: "Decline Bench Leg Raise",     category: "Core", muscles: ["Abs"] },
  { id: "co-19", name: "Machine Knee Raise",          category: "Core", muscles: ["Abs"] },
  { id: "co-20", name: "Ab Wheel Rollout",            category: "Core", muscles: ["Abs"] },
  { id: "co-21", name: "Barbell Rollout",             category: "Core", muscles: ["Abs"] },
  { id: "co-22", name: "Cable Woodchop",              category: "Core", muscles: ["Obliques"] },
  { id: "co-23", name: "Machine Woodchop",            category: "Core", muscles: ["Obliques"] },
  { id: "co-24", name: "Russian Twist",               category: "Core", muscles: ["Obliques"] },
  { id: "co-25", name: "Pallof Press",                category: "Core", muscles: ["Obliques", "Abs"] },
  { id: "co-26", name: "Landmine Twist",              category: "Core", muscles: ["Obliques"] },
  { id: "co-27", name: "Sit-Up",                      category: "Core", muscles: ["Abs"] },
  { id: "co-28", name: "Decline Bench Sit-Up",        category: "Core", muscles: ["Abs"] },
  { id: "co-29", name: "Toes to Bar",                 category: "Core", muscles: ["Abs"] },
  { id: "co-30", name: "Dragon Flag",                 category: "Core", muscles: ["Abs"] },
  { id: "co-31", name: "L-Sit",                       category: "Core", muscles: ["Abs"] },

  // ── CARDIO ──────────────────────────────────────────────────────────────────
  { id: "cd-1",  name: "Treadmill Run",               category: "Cardio", muscles: [] },
  { id: "cd-2",  name: "Incline Treadmill Walk",      category: "Cardio", muscles: [] },
  { id: "cd-3",  name: "Stationary Bike",             category: "Cardio", muscles: [] },
  { id: "cd-4",  name: "Assault Bike",                category: "Cardio", muscles: [] },
  { id: "cd-5",  name: "Rowing Machine",              category: "Cardio", muscles: [] },
  { id: "cd-6",  name: "Elliptical",                  category: "Cardio", muscles: [] },
  { id: "cd-7",  name: "Stair Climber",               category: "Cardio", muscles: [] },
  { id: "cd-8",  name: "Ski Erg",                     category: "Cardio", muscles: [] },
  { id: "cd-9",  name: "Jump Rope",                   category: "Cardio", muscles: [] },
  { id: "cd-10", name: "Sprint Intervals",            category: "Cardio", muscles: [] },

  // ── FULL BODY ────────────────────────────────────────────────────────────────
  { id: "fb-1",  name: "Power Clean",                 category: "Full Body", muscles: ["Glutes", "Quadriceps", "Trapezius"] },
  { id: "fb-2",  name: "Hang Clean",                  category: "Full Body", muscles: ["Glutes", "Quadriceps"] },
  { id: "fb-3",  name: "Clean & Jerk",                category: "Full Body", muscles: ["Glutes", "Deltoids"] },
  { id: "fb-4",  name: "Power Snatch",                category: "Full Body", muscles: ["Glutes", "Deltoids"] },
  { id: "fb-5",  name: "Overhead Squat",              category: "Full Body", muscles: ["Quadriceps", "Deltoids"] },
  { id: "fb-6",  name: "Kettlebell Swing",            category: "Full Body", muscles: ["Glutes", "Hamstrings"] },
  { id: "fb-7",  name: "Turkish Get-Up",              category: "Full Body", muscles: ["Deltoids", "Abs"] },
  { id: "fb-8",  name: "Kettlebell Clean",            category: "Full Body", muscles: ["Glutes", "Trapezius"] },
  { id: "fb-9",  name: "Thruster",                    category: "Full Body", muscles: ["Quadriceps", "Deltoids"] },
  { id: "fb-10", name: "Burpee",                      category: "Full Body", muscles: [] },
  { id: "fb-11", name: "Sumo Deadlift High Pull",     category: "Full Body", muscles: ["Glutes", "Trapezius"] },
  { id: "fb-12", name: "Box Jump",                    category: "Full Body", muscles: ["Quadriceps", "Glutes"] },
  { id: "fb-13", name: "Wall Ball",                   category: "Full Body", muscles: ["Quadriceps", "Deltoids"] },
  { id: "fb-14", name: "Farmer Carry",                category: "Full Body", muscles: ["Trapezius", "Abs"] },
  { id: "fb-15", name: "Overhead Carry",              category: "Full Body", muscles: ["Deltoids", "Abs"] },
  { id: "fb-16", name: "Suitcase Carry",              category: "Full Body", muscles: ["Abs", "Trapezius"] },
  { id: "fb-17", name: "Bear Hug Carry",              category: "Full Body", muscles: ["Abs"] },
];

// ─── Cache helpers ───────────────────────────────────────────────────────────
const CACHE_KEY = "fitness_exercise_cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = { data: ExerciseInfo[]; ts: number };

function readCache(): ExerciseInfo[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: ExerciseInfo[]): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // storage full — ignore
  }
}

// ─── wger API fetcher ────────────────────────────────────────────────────────
type WgerExercise = {
  id: number;
  uuid: string;
  name: string;
  category: { id: number; name: string } | null;
  muscles: { id: number; name_en: string }[];
  exercise_base?: number;
};

type WgerPage = {
  count: number;
  next: string | null;
  results: WgerExercise[];
};

async function fetchFromWger(): Promise<ExerciseInfo[]> {
  const results: ExerciseInfo[] = [];
  let url =
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&offset=0";

  // Fetch up to 5 pages (500 exercises)
  for (let page = 0; page < 5 && url; page++) {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`wger API ${res.status}`);
    const json: WgerPage = await res.json();

    for (const ex of json.results) {
      if (!ex.name?.trim()) continue;
      results.push({
        id: `wger-${ex.id}`,
        name: ex.name.trim(),
        category: ex.category?.name ?? undefined,
        muscles: ex.muscles?.map((m) => m.name_en) ?? [],
        wgerId: ex.id,
      });
    }
    url = json.next ?? "";
  }

  return results;
}

// ─── Main export: load all exercises ────────────────────────────────────────
let _cache: ExerciseInfo[] | null = null;

export async function loadExercises(): Promise<ExerciseInfo[]> {
  // In-memory (per page load)
  if (_cache) return _cache;

  // localStorage cache
  const cached = readCache();
  if (cached) {
    _cache = cached;
    return cached;
  }

  // Try wger API
  try {
    const data = await fetchFromWger();
    if (data.length > 0) {
      // Merge with fallback (add any fallback entries not already present)
      const names = new Set(data.map((e) => e.name.toLowerCase()));
      const extras = FALLBACK_EXERCISES.filter(
        (f) => !names.has(f.name.toLowerCase())
      );
      const merged = [...data, ...extras];
      writeCache(merged);
      _cache = merged;
      return merged;
    }
  } catch {
    // API unavailable — fall through to fallback
  }

  _cache = FALLBACK_EXERCISES;
  return FALLBACK_EXERCISES;
}

// ─── Synonym / alias map ─────────────────────────────────────────────────────
// Maps common search terms (Dutch + English) to category names or muscle keywords
// so searching "biceps" returns Arms exercises, "benen" returns Legs, etc.
const SYNONYM_MAP: Record<string, { categories?: string[]; muscles?: string[] }> = {
  // Muscle group synonyms → category
  biceps:       { categories: ["Arms"], muscles: ["Biceps"] },
  bicep:        { categories: ["Arms"], muscles: ["Biceps"] },
  triceps:      { categories: ["Arms"], muscles: ["Triceps"] },
  tricep:       { categories: ["Arms"], muscles: ["Triceps"] },
  arms:         { categories: ["Arms"] },
  armen:        { categories: ["Arms"] },
  arm:          { categories: ["Arms"] },
  chest:        { categories: ["Chest"] },
  borst:        { categories: ["Chest"] },
  pecs:         { categories: ["Chest"], muscles: ["Pectorals"] },
  pectorals:    { categories: ["Chest"], muscles: ["Pectorals"] },
  back:         { categories: ["Back"] },
  rug:          { categories: ["Back"] },
  lats:         { categories: ["Back"], muscles: ["Lats"] },
  shoulders:    { categories: ["Shoulders"] },
  schouders:    { categories: ["Shoulders"] },
  schouder:     { categories: ["Shoulders"] },
  delts:        { categories: ["Shoulders"], muscles: ["Deltoids"] },
  deltoids:     { categories: ["Shoulders"], muscles: ["Deltoids"] },
  legs:         { categories: ["Legs"] },
  benen:        { categories: ["Legs"] },
  been:         { categories: ["Legs"] },
  quads:        { categories: ["Legs"], muscles: ["Quadriceps"] },
  quadriceps:   { categories: ["Legs"], muscles: ["Quadriceps"] },
  hamstrings:   { categories: ["Legs"], muscles: ["Hamstrings"] },
  hamstring:    { categories: ["Legs"], muscles: ["Hamstrings"] },
  glutes:       { categories: ["Legs"], muscles: ["Glutes"] },
  billen:       { categories: ["Legs"], muscles: ["Glutes"] },
  bil:          { categories: ["Legs"], muscles: ["Glutes"] },
  calves:       { categories: ["Legs"], muscles: ["Calves"] },
  kuiten:       { categories: ["Legs"], muscles: ["Calves"] },
  kuit:         { categories: ["Legs"], muscles: ["Calves"] },
  core:         { categories: ["Core"] },
  abs:          { categories: ["Core"], muscles: ["Abs"] },
  buik:         { categories: ["Core"], muscles: ["Abs"] },
  obliques:     { categories: ["Core"], muscles: ["Obliques"] },
  cardio:       { categories: ["Cardio"] },
  "full body":  { categories: ["Full Body"] },
  fullbody:     { categories: ["Full Body"] },
  kettlebell:   { categories: ["Full Body"] },
  olympic:      { categories: ["Full Body"] },
  carries:      { categories: ["Full Body"] },
  // Movement synonyms
  curl:         { categories: ["Arms"], muscles: ["Biceps"] },
  curls:        { categories: ["Arms"], muscles: ["Biceps"] },
  press:        { categories: ["Chest", "Shoulders"] },
  row:          { categories: ["Back"] },
  rows:         { categories: ["Back"] },
  squat:        { categories: ["Legs"] },
  squats:       { categories: ["Legs"] },
  deadlift:     { categories: ["Back", "Legs"] },
  deadlifts:    { categories: ["Back", "Legs"] },
  "pull-up":    { categories: ["Back"] },
  pullup:       { categories: ["Back"] },
  pullups:      { categories: ["Back"] },
  "chin-up":    { categories: ["Back"] },
  chinup:       { categories: ["Back"] },
  dip:          { categories: ["Arms", "Chest"], muscles: ["Triceps"] },
  dips:         { categories: ["Arms", "Chest"], muscles: ["Triceps"] },
  "tricep dip": { categories: ["Arms"], muscles: ["Triceps"] },
  "tricep dips":{ categories: ["Arms"], muscles: ["Triceps"] },
  "triceps dip":{ categories: ["Arms"], muscles: ["Triceps"] },
  lunge:        { categories: ["Legs"] },
  lunges:       { categories: ["Legs"] },
  plank:        { categories: ["Core"] },
  crunch:       { categories: ["Core"] },
  crunches:     { categories: ["Core"] },
};

function getSynonymMatch(
  query: string,
  exercises: ExerciseInfo[]
): ExerciseInfo[] {
  const q = query.trim().toLowerCase();
  const syn = SYNONYM_MAP[q];
  if (!syn) return [];

  return exercises.filter((ex) => {
    const inCategory =
      syn.categories?.some(
        (c) => ex.category?.toLowerCase() === c.toLowerCase()
      ) ?? false;

    // If muscles are specified, require the exercise to match those muscles —
    // category alone is not enough (prevents "biceps" returning tricep exercises).
    if (syn.muscles && syn.muscles.length > 0) {
      return (
        syn.muscles.some((m) =>
          ex.muscles?.some((em) => em.toLowerCase().includes(m.toLowerCase()))
        ) || // exact muscle match anywhere
        // also include exercises whose name contains the muscle keyword
        syn.muscles.some((m) => ex.name.toLowerCase().includes(m.toLowerCase()))
      );
    }

    // No muscle filter → category match is sufficient
    return inCategory;
  });
}

// ─── Fuzzy search ────────────────────────────────────────────────────────────
let _fuse: Fuse<ExerciseInfo> | null = null;

export function buildFuse(exercises: ExerciseInfo[]): Fuse<ExerciseInfo> {
  // Rebuild if exercise list size changed (e.g. after API load)
  if (_fuse && (_fuse as unknown as { _docs: unknown[] })._docs?.length === exercises.length) return _fuse;
  _fuse = new Fuse(exercises, {
    keys: [
      { name: "name", weight: 0.6 },
      { name: "aliases", weight: 0.3 },
      { name: "category", weight: 0.05 },
      { name: "muscles", weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return _fuse;
}

export function searchExercises(
  query: string,
  exercises: ExerciseInfo[],
  limit = 8
): ExerciseInfo[] {
  if (!query.trim()) return [];

  // 1. Try synonym/alias match first
  const synonymResults = getSynonymMatch(query, exercises);
  if (synonymResults.length > 0) {
    return synonymResults.slice(0, limit);
  }

  // 2. Fall back to fuzzy search on exercise name / muscles
  const fuse = buildFuse(exercises);
  return fuse
    .search(query)
    .slice(0, limit)
    .map((r) => r.item);
}

export function getCategories(exercises: ExerciseInfo[]): string[] {
  const cats = new Set(exercises.map((e) => e.category).filter(Boolean) as string[]);
  return Array.from(cats).sort();
}

export function getByCategory(
  category: string,
  exercises: ExerciseInfo[]
): ExerciseInfo[] {
  return exercises.filter((e) => e.category === category);
}
