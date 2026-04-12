export type Set = {
  id: string;
  type?: "reps" | "duration"; // reps+weight or duration in minutes
  reps: number;
  weight: number; // kg
  duration?: number; // minutes (only used when type === "duration")
};

export type Exercise = {
  id: string;
  name: string;
  sets: Set[];
};

export type Workout = {
  id: string;
  name: string;
  date: string; // ISO string
  duration: number; // minutes
  exercises: Exercise[];
};

const STORAGE_KEY = "fitness_workouts";

export function getWorkouts(): Workout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getSampleData();
  } catch {
    return getSampleData();
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export function addWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts.unshift(workout);
  saveWorkouts(workouts);
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts().filter((w) => w.id !== id);
  saveWorkouts(workouts);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ---------------------------------------------------------------------------
// Exercise Library
// ---------------------------------------------------------------------------

export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Legs"
  | "Glutes"
  | "Core"
  | "Cardio"
  | "Full Body"
  | "Custom";

export type ExerciseDefinition = {
  name: string;
  muscle: MuscleGroup;
  custom?: boolean; // user-added
};

const LIBRARY_KEY = "fitness_exercise_library";

/** Built-in exercise list — broad but not overwhelming */
export const BUILTIN_EXERCISES: ExerciseDefinition[] = [
  // Chest
  { name: "Bench Press", muscle: "Chest" },
  { name: "Incline Bench Press", muscle: "Chest" },
  { name: "Decline Bench Press", muscle: "Chest" },
  { name: "Dumbbell Bench Press", muscle: "Chest" },
  { name: "Incline Dumbbell Press", muscle: "Chest" },
  { name: "Chest Fly", muscle: "Chest" },
  { name: "Cable Chest Fly", muscle: "Chest" },
  { name: "Chest Dip", muscle: "Chest" },
  { name: "Push-Up", muscle: "Chest" },
  { name: "Landmine Press", muscle: "Chest" },
  // Back
  { name: "Deadlift", muscle: "Back" },
  { name: "Barbell Row", muscle: "Back" },
  { name: "Pendlay Row", muscle: "Back" },
  { name: "Dumbbell Row", muscle: "Back" },
  { name: "T-Bar Row", muscle: "Back" },
  { name: "Cable Row", muscle: "Back" },
  { name: "Pull-Up", muscle: "Back" },
  { name: "Chin-Up", muscle: "Back" },
  { name: "Lat Pulldown", muscle: "Back" },
  { name: "Straight-Arm Pulldown", muscle: "Back" },
  { name: "Face Pull", muscle: "Back" },
  { name: "Good Morning", muscle: "Back" },
  // Shoulders
  { name: "Overhead Press", muscle: "Shoulders" },
  { name: "Seated Overhead Press", muscle: "Shoulders" },
  { name: "Dumbbell Shoulder Press", muscle: "Shoulders" },
  { name: "Arnold Press", muscle: "Shoulders" },
  { name: "Lateral Raise", muscle: "Shoulders" },
  { name: "Cable Lateral Raise", muscle: "Shoulders" },
  { name: "Front Raise", muscle: "Shoulders" },
  { name: "Rear Delt Fly", muscle: "Shoulders" },
  { name: "Upright Row", muscle: "Shoulders" },
  { name: "Shrug", muscle: "Shoulders" },
  // Biceps
  { name: "Barbell Curl", muscle: "Biceps" },
  { name: "Dumbbell Curl", muscle: "Biceps" },
  { name: "Hammer Curl", muscle: "Biceps" },
  { name: "Incline Dumbbell Curl", muscle: "Biceps" },
  { name: "Concentration Curl", muscle: "Biceps" },
  { name: "Cable Curl", muscle: "Biceps" },
  { name: "Preacher Curl", muscle: "Biceps" },
  { name: "Spider Curl", muscle: "Biceps" },
  // Triceps
  { name: "Tricep Dip", muscle: "Triceps" },
  { name: "Close-Grip Bench Press", muscle: "Triceps" },
  { name: "Skull Crusher", muscle: "Triceps" },
  { name: "Tricep Pushdown", muscle: "Triceps" },
  { name: "Overhead Tricep Extension", muscle: "Triceps" },
  { name: "Diamond Push-Up", muscle: "Triceps" },
  { name: "Kickback", muscle: "Triceps" },
  // Legs
  { name: "Squat", muscle: "Legs" },
  { name: "Front Squat", muscle: "Legs" },
  { name: "Hack Squat", muscle: "Legs" },
  { name: "Leg Press", muscle: "Legs" },
  { name: "Romanian Deadlift", muscle: "Legs" },
  { name: "Bulgarian Split Squat", muscle: "Legs" },
  { name: "Lunge", muscle: "Legs" },
  { name: "Walking Lunge", muscle: "Legs" },
  { name: "Leg Extension", muscle: "Legs" },
  { name: "Leg Curl", muscle: "Legs" },
  { name: "Seated Leg Curl", muscle: "Legs" },
  { name: "Calf Raise", muscle: "Legs" },
  { name: "Seated Calf Raise", muscle: "Legs" },
  { name: "Step-Up", muscle: "Legs" },
  // Glutes
  { name: "Hip Thrust", muscle: "Glutes" },
  { name: "Glute Bridge", muscle: "Glutes" },
  { name: "Cable Kickback", muscle: "Glutes" },
  { name: "Sumo Deadlift", muscle: "Glutes" },
  { name: "Sumo Squat", muscle: "Glutes" },
  { name: "Donkey Kick", muscle: "Glutes" },
  // Core
  { name: "Plank", muscle: "Core" },
  { name: "Side Plank", muscle: "Core" },
  { name: "Crunch", muscle: "Core" },
  { name: "Sit-Up", muscle: "Core" },
  { name: "Leg Raise", muscle: "Core" },
  { name: "Hanging Leg Raise", muscle: "Core" },
  { name: "Cable Crunch", muscle: "Core" },
  { name: "Ab Wheel Rollout", muscle: "Core" },
  { name: "Russian Twist", muscle: "Core" },
  { name: "Dragon Flag", muscle: "Core" },
  // Cardio
  { name: "Running", muscle: "Cardio" },
  { name: "Cycling", muscle: "Cardio" },
  { name: "Rowing", muscle: "Cardio" },
  { name: "Jump Rope", muscle: "Cardio" },
  { name: "Stairmaster", muscle: "Cardio" },
  { name: "Elliptical", muscle: "Cardio" },
  { name: "Battle Ropes", muscle: "Cardio" },
  // Full Body
  { name: "Clean and Press", muscle: "Full Body" },
  { name: "Power Clean", muscle: "Full Body" },
  { name: "Snatch", muscle: "Full Body" },
  { name: "Thruster", muscle: "Full Body" },
  { name: "Burpee", muscle: "Full Body" },
  { name: "Kettlebell Swing", muscle: "Full Body" },
  { name: "Turkish Get-Up", muscle: "Full Body" },
];

/** Get user-created custom exercises from localStorage */
export function getCustomExercises(): ExerciseDefinition[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save a new custom exercise (deduplicates by name, case-insensitive) */
export function addCustomExercise(name: string, muscle: MuscleGroup = "Custom"): void {
  const existing = getCustomExercises();
  const already = [...BUILTIN_EXERCISES, ...existing].some(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (already) return;
  existing.push({ name, muscle, custom: true });
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(existing));
}

/** Full library = built-ins + user customs */
export function getAllExercises(): ExerciseDefinition[] {
  return [...BUILTIN_EXERCISES, ...getCustomExercises()];
}

/** All unique muscle groups present in full library */
export const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Legs", "Glutes", "Core", "Cardio", "Full Body", "Custom",
];

function getSampleData(): Workout[] {
  return [
    {
      id: "sample1",
      name: "Upper Body Strength",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      duration: 55,
      exercises: [
        {
          id: "e1",
          name: "Bench Press",
          sets: [
            { id: "s1", reps: 8, weight: 80 },
            { id: "s2", reps: 8, weight: 80 },
            { id: "s3", reps: 6, weight: 85 },
          ],
        },
        {
          id: "e2",
          name: "Pull-Up",
          sets: [
            { id: "s4", reps: 10, weight: 0 },
            { id: "s5", reps: 8, weight: 0 },
          ],
        },
      ],
    },
    {
      id: "sample2",
      name: "Leg Day",
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      duration: 60,
      exercises: [
        {
          id: "e3",
          name: "Squat",
          sets: [
            { id: "s6", reps: 5, weight: 100 },
            { id: "s7", reps: 5, weight: 100 },
            { id: "s8", reps: 5, weight: 105 },
          ],
        },
        {
          id: "e4",
          name: "Romanian Deadlift",
          sets: [
            { id: "s9", reps: 10, weight: 70 },
            { id: "s10", reps: 10, weight: 70 },
          ],
        },
      ],
    },
    {
      id: "sample3",
      name: "Push Day",
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      duration: 45,
      exercises: [
        {
          id: "e5",
          name: "Overhead Press",
          sets: [
            { id: "s11", reps: 8, weight: 55 },
            { id: "s12", reps: 8, weight: 55 },
            { id: "s13", reps: 6, weight: 60 },
          ],
        },
      ],
    },
  ];
}
