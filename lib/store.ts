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
  { name: "Dumbbell High Pull", muscle: "Shoulders" },
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

// ---------------------------------------------------------------------------
// Previous Exercise History
// ---------------------------------------------------------------------------

export type PreviousSetData = {
  reps: number;
  weight: number;
};

export type PreviousExerciseData = {
  date: string;
  workoutName: string;
  sets: PreviousSetData[];
};

/** Find the most recent workout where this exercise was performed */
export function getPreviousExerciseData(exerciseName: string): PreviousExerciseData | null {
  const workouts = getWorkouts();
  const normalizedName = exerciseName.toLowerCase().trim();
  for (const workout of workouts) {
    const match = workout.exercises.find(
      (e) => e.name.toLowerCase().replace(/^[🔗↳]\s*/, "").trim() === normalizedName
    );
    if (match) {
      return {
        date: workout.date,
        workoutName: workout.name,
        sets: match.sets.map((s) => ({ reps: s.reps, weight: s.weight })),
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Workout Templates
// ---------------------------------------------------------------------------

export type WorkoutTemplateExercise = {
  name: string;
  setType: "reps" | "duration";
  setCount: number;
  defaultReps: number;
  defaultWeight: number;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  createdAt: string;
  exercises: WorkoutTemplateExercise[];
};

const TEMPLATES_KEY = "fitness_workout_templates";

export function getWorkoutTemplates(): WorkoutTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkoutTemplate(template: WorkoutTemplate): void {
  const templates = getWorkoutTemplates();
  // Update if exists, else prepend
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) templates[idx] = template;
  else templates.unshift(template);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function deleteWorkoutTemplate(id: string): void {
  const updated = getWorkoutTemplates().filter((t) => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
}

// ---------------------------------------------------------------------------
// Pending Exercise Requests
// ---------------------------------------------------------------------------

export type PendingExercise = {
  id: string;
  name: string;
  muscle: MuscleGroup;
  note?: string;
  youtubeUrl?: string;
  fileDataUrl?: string;   // base64 encoded image or video
  fileType?: "image" | "video";
  submittedAt: string;    // ISO string
  status: "pending" | "approved" | "rejected";
  upvotes: number;
  downvotes: number;
  upvotedDeviceIds: string[];
  downvotedDeviceIds: string[];
};

const PENDING_KEY = "fitness_pending_exercises";

export function getPendingExercises(): PendingExercise[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("fitness_device_id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("fitness_device_id", id);
  }
  return id;
}

export function addPendingExercise(
  name: string,
  muscle: MuscleGroup,
  note?: string,
  youtubeUrl?: string,
  fileDataUrl?: string,
  fileType?: "image" | "video"
): void {
  const existing = getPendingExercises();
  const already = [...BUILTIN_EXERCISES, ...getCustomExercises()].some(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (already) return;
  existing.push({
    id: generateId(),
    name,
    muscle,
    note,
    youtubeUrl,
    fileDataUrl,
    fileType,
    submittedAt: new Date().toISOString(),
    status: "pending",
    upvotes: 0,
    downvotes: 0,
    upvotedDeviceIds: [],
    downvotedDeviceIds: [],
  });
  localStorage.setItem(PENDING_KEY, JSON.stringify(existing));
}

export function voteForExercise(id: string, direction: "up" | "down"): void {
  const deviceId = getDeviceId();
  const pending = getPendingExercises();
  const updated = pending.map((p) => {
    if (p.id !== id) return p;
    let { upvotes, downvotes, upvotedDeviceIds, downvotedDeviceIds } = p;

    if (direction === "up") {
      if (upvotedDeviceIds.includes(deviceId)) {
        // undo upvote
        return { ...p, upvotes: upvotes - 1, upvotedDeviceIds: upvotedDeviceIds.filter((d) => d !== deviceId) };
      }
      // remove downvote if present
      if (downvotedDeviceIds.includes(deviceId)) {
        downvotes -= 1;
        downvotedDeviceIds = downvotedDeviceIds.filter((d) => d !== deviceId);
      }
      return { ...p, upvotes: upvotes + 1, downvotes, upvotedDeviceIds: [...upvotedDeviceIds, deviceId], downvotedDeviceIds };
    } else {
      if (downvotedDeviceIds.includes(deviceId)) {
        // undo downvote
        return { ...p, downvotes: downvotes - 1, downvotedDeviceIds: downvotedDeviceIds.filter((d) => d !== deviceId) };
      }
      // remove upvote if present
      if (upvotedDeviceIds.includes(deviceId)) {
        upvotes -= 1;
        upvotedDeviceIds = upvotedDeviceIds.filter((d) => d !== deviceId);
      }
      return { ...p, downvotes: downvotes + 1, upvotes, downvotedDeviceIds: [...downvotedDeviceIds, deviceId], upvotedDeviceIds };
    }
  });
  localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
}

export function approvePendingExercise(id: string): void {
  const pending = getPendingExercises();
  const req = pending.find((p) => p.id === id);
  if (!req) return;
  addCustomExercise(req.name, req.muscle);
  const updated = pending.map((p) =>
    p.id === id ? { ...p, status: "approved" as const } : p
  );
  localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
}

export function deletePendingExercise(id: string): void {
  const updated = getPendingExercises().filter((p) => p.id !== id);
  localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
}

// ---------------------------------------------------------------------------
// Removal Requests
// ---------------------------------------------------------------------------

export type RemovalRequest = {
  id: string;
  exerciseName: string;        // name of the exercise to remove
  exerciseSlug: string;        // slug used in exerciseDatabase
  reason: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  upvotes: number;
  downvotes: number;
  upvotedDeviceIds: string[];
  downvotedDeviceIds: string[];
};

const REMOVAL_KEY = "fitness_removal_requests";

export function getRemovalRequests(): RemovalRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REMOVAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRemovalRequest(
  exerciseName: string,
  exerciseSlug: string,
  reason: string
): void {
  const existing = getRemovalRequests();
  // prevent duplicate pending requests for the same exercise
  const dupe = existing.some(
    (r) => r.exerciseSlug === exerciseSlug && r.status === "pending"
  );
  if (dupe) return;
  existing.push({
    id: generateId(),
    exerciseName,
    exerciseSlug,
    reason,
    submittedAt: new Date().toISOString(),
    status: "pending",
    upvotes: 0,
    downvotes: 0,
    upvotedDeviceIds: [],
    downvotedDeviceIds: [],
  });
  localStorage.setItem(REMOVAL_KEY, JSON.stringify(existing));
}

export function voteForRemoval(id: string, direction: "up" | "down"): void {
  const deviceId = getDeviceId();
  const requests = getRemovalRequests();
  const updated = requests.map((r) => {
    if (r.id !== id) return r;
    let { upvotes, downvotes, upvotedDeviceIds, downvotedDeviceIds } = r;
    if (direction === "up") {
      if (upvotedDeviceIds.includes(deviceId)) {
        return { ...r, upvotes: upvotes - 1, upvotedDeviceIds: upvotedDeviceIds.filter((d) => d !== deviceId) };
      }
      if (downvotedDeviceIds.includes(deviceId)) {
        downvotes -= 1;
        downvotedDeviceIds = downvotedDeviceIds.filter((d) => d !== deviceId);
      }
      return { ...r, upvotes: upvotes + 1, downvotes, upvotedDeviceIds: [...upvotedDeviceIds, deviceId], downvotedDeviceIds };
    } else {
      if (downvotedDeviceIds.includes(deviceId)) {
        return { ...r, downvotes: downvotes - 1, downvotedDeviceIds: downvotedDeviceIds.filter((d) => d !== deviceId) };
      }
      if (upvotedDeviceIds.includes(deviceId)) {
        upvotes -= 1;
        upvotedDeviceIds = upvotedDeviceIds.filter((d) => d !== deviceId);
      }
      return { ...r, downvotes: downvotes + 1, upvotes, downvotedDeviceIds: [...downvotedDeviceIds, deviceId], upvotedDeviceIds };
    }
  });
  localStorage.setItem(REMOVAL_KEY, JSON.stringify(updated));
}

export function approveRemovalRequest(id: string): void {
  const requests = getRemovalRequests();
  const updated = requests.map((r) =>
    r.id === id ? { ...r, status: "approved" as const } : r
  );
  localStorage.setItem(REMOVAL_KEY, JSON.stringify(updated));
  // Also remove from custom exercises if present
  const req = requests.find((r) => r.id === id);
  if (req) {
    const customs = getCustomExercises().filter(
      (e) => e.name.toLowerCase() !== req.exerciseName.toLowerCase()
    );
    localStorage.setItem("fitness_custom_exercises", JSON.stringify(customs));
  }
}

export function deleteRemovalRequest(id: string): void {
  const updated = getRemovalRequests().filter((r) => r.id !== id);
  localStorage.setItem(REMOVAL_KEY, JSON.stringify(updated));
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

function d(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86400000).toISOString();
}

function getSampleData(): Workout[] {
  return [
    // ── Week 12 ago ───────────────────────────────────────────────────────
    {
      id: "w1", name: "Push A", date: d(83), duration: 52,
      exercises: [
        { id: "e1", name: "Flat Barbell Bench Press", sets: [{ id: "s1", reps: 8, weight: 70 }, { id: "s2", reps: 8, weight: 70 }, { id: "s3", reps: 6, weight: 75 }] },
        { id: "e2", name: "Overhead Press", sets: [{ id: "s4", reps: 8, weight: 45 }, { id: "s5", reps: 8, weight: 45 }] },
        { id: "e3", name: "Dumbbell Lateral Raise", sets: [{ id: "s6", reps: 15, weight: 10 }, { id: "s7", reps: 15, weight: 10 }] },
      ],
    },
    {
      id: "w2", name: "Pull A", date: d(81), duration: 55,
      exercises: [
        { id: "e4", name: "Conventional Deadlift", sets: [{ id: "s8", reps: 5, weight: 100 }, { id: "s9", reps: 5, weight: 100 }, { id: "s10", reps: 3, weight: 110 }] },
        { id: "e5", name: "Barbell Curl", sets: [{ id: "s11", reps: 10, weight: 30 }, { id: "s12", reps: 10, weight: 30 }] },
        { id: "e6", name: "Lat Pulldown", sets: [{ id: "s13", reps: 10, weight: 60 }, { id: "s14", reps: 10, weight: 65 }] },
      ],
    },
    {
      id: "w3", name: "Legs A", date: d(79), duration: 65,
      exercises: [
        { id: "e7", name: "Barbell Back Squat", sets: [{ id: "s15", reps: 5, weight: 90 }, { id: "s16", reps: 5, weight: 90 }, { id: "s17", reps: 5, weight: 95 }] },
        { id: "e8", name: "Romanian Deadlift", sets: [{ id: "s18", reps: 10, weight: 70 }, { id: "s19", reps: 10, weight: 70 }] },
        { id: "e9", name: "Leg Press", sets: [{ id: "s20", reps: 12, weight: 120 }, { id: "s21", reps: 12, weight: 130 }] },
      ],
    },
    // ── Week 10 ago ───────────────────────────────────────────────────────
    {
      id: "w4", name: "Push B", date: d(69), duration: 50,
      exercises: [
        { id: "e10", name: "Flat Barbell Bench Press", sets: [{ id: "s22", reps: 8, weight: 75 }, { id: "s23", reps: 8, weight: 75 }, { id: "s24", reps: 6, weight: 80 }] },
        { id: "e11", name: "Overhead Press", sets: [{ id: "s25", reps: 8, weight: 47.5 }, { id: "s26", reps: 8, weight: 47.5 }] },
        { id: "e12", name: "Tricep Dips", sets: [{ id: "s27", reps: 12, weight: 0 }, { id: "s28", reps: 10, weight: 0 }] },
      ],
    },
    {
      id: "w5", name: "Pull B", date: d(67), duration: 58,
      exercises: [
        { id: "e13", name: "Conventional Deadlift", sets: [{ id: "s29", reps: 5, weight: 105 }, { id: "s30", reps: 5, weight: 105 }, { id: "s31", reps: 3, weight: 115 }] },
        { id: "e14", name: "Bent-Over Barbell Row", sets: [{ id: "s32", reps: 8, weight: 70 }, { id: "s33", reps: 8, weight: 70 }] },
        { id: "e15", name: "Barbell Curl", sets: [{ id: "s34", reps: 10, weight: 32.5 }, { id: "s35", reps: 10, weight: 32.5 }] },
      ],
    },
    {
      id: "w6", name: "Legs B", date: d(65), duration: 68,
      exercises: [
        { id: "e16", name: "Barbell Back Squat", sets: [{ id: "s36", reps: 5, weight: 95 }, { id: "s37", reps: 5, weight: 95 }, { id: "s38", reps: 5, weight: 100 }] },
        { id: "e17", name: "Romanian Deadlift", sets: [{ id: "s39", reps: 10, weight: 75 }, { id: "s40", reps: 10, weight: 75 }] },
        { id: "e18", name: "Barbell Hip Thrust", sets: [{ id: "s41", reps: 12, weight: 80 }, { id: "s42", reps: 12, weight: 80 }] },
      ],
    },
    // ── Week 7 ago ────────────────────────────────────────────────────────
    {
      id: "w7", name: "Push C", date: d(48), duration: 55,
      exercises: [
        { id: "e19", name: "Flat Barbell Bench Press", sets: [{ id: "s43", reps: 6, weight: 82.5 }, { id: "s44", reps: 6, weight: 82.5 }, { id: "s45", reps: 4, weight: 87.5 }] },
        { id: "e20", name: "Overhead Press", sets: [{ id: "s46", reps: 6, weight: 50 }, { id: "s47", reps: 6, weight: 50 }] },
        { id: "e21", name: "Dumbbell Lateral Raise", sets: [{ id: "s48", reps: 15, weight: 12 }, { id: "s49", reps: 15, weight: 12 }] },
        { id: "e22", name: "Face Pull", sets: [{ id: "s50", reps: 15, weight: 20 }, { id: "s51", reps: 15, weight: 20 }] },
      ],
    },
    {
      id: "w8", name: "Pull C", date: d(46), duration: 60,
      exercises: [
        { id: "e23", name: "Conventional Deadlift", sets: [{ id: "s52", reps: 3, weight: 120 }, { id: "s53", reps: 3, weight: 120 }, { id: "s54", reps: 1, weight: 130 }] },
        { id: "e24", name: "Lat Pulldown", sets: [{ id: "s55", reps: 10, weight: 67.5 }, { id: "s56", reps: 10, weight: 70 }] },
        { id: "e25", name: "Incline Dumbbell Curl", sets: [{ id: "s57", reps: 10, weight: 14 }, { id: "s58", reps: 10, weight: 14 }] },
      ],
    },
    {
      id: "w9", name: "Legs C", date: d(44), duration: 70,
      exercises: [
        { id: "e26", name: "Barbell Back Squat", sets: [{ id: "s59", reps: 5, weight: 100 }, { id: "s60", reps: 5, weight: 102.5 }, { id: "s61", reps: 3, weight: 107.5 }] },
        { id: "e27", name: "Romanian Deadlift", sets: [{ id: "s62", reps: 10, weight: 77.5 }, { id: "s63", reps: 10, weight: 80 }] },
        { id: "e28", name: "Bulgarian Split Squat", sets: [{ id: "s64", reps: 10, weight: 30 }, { id: "s65", reps: 10, weight: 30 }] },
      ],
    },
    // ── Week 4 ago ────────────────────────────────────────────────────────
    {
      id: "w10", name: "Push D", date: d(27), duration: 57,
      exercises: [
        { id: "e29", name: "Flat Barbell Bench Press", sets: [{ id: "s66", reps: 6, weight: 85 }, { id: "s67", reps: 6, weight: 87.5 }, { id: "s68", reps: 4, weight: 90 }] },
        { id: "e30", name: "Overhead Press", sets: [{ id: "s69", reps: 6, weight: 52.5 }, { id: "s70", reps: 6, weight: 52.5 }] },
        { id: "e31", name: "Rope Tricep Pushdown", sets: [{ id: "s71", reps: 12, weight: 25 }, { id: "s72", reps: 12, weight: 27.5 }] },
      ],
    },
    {
      id: "w11", name: "Pull D", date: d(25), duration: 62,
      exercises: [
        { id: "e32", name: "Conventional Deadlift", sets: [{ id: "s73", reps: 3, weight: 125 }, { id: "s74", reps: 3, weight: 127.5 }, { id: "s75", reps: 1, weight: 135 }] },
        { id: "e33", name: "Bent-Over Barbell Row", sets: [{ id: "s76", reps: 8, weight: 75 }, { id: "s77", reps: 8, weight: 77.5 }] },
        { id: "e34", name: "Barbell Curl", sets: [{ id: "s78", reps: 10, weight: 35 }, { id: "s79", reps: 8, weight: 37.5 }] },
      ],
    },
    {
      id: "w12", name: "Legs D", date: d(23), duration: 72,
      exercises: [
        { id: "e35", name: "Barbell Back Squat", sets: [{ id: "s80", reps: 5, weight: 105 }, { id: "s81", reps: 5, weight: 107.5 }, { id: "s82", reps: 3, weight: 112.5 }] },
        { id: "e36", name: "Romanian Deadlift", sets: [{ id: "s83", reps: 10, weight: 82.5 }, { id: "s84", reps: 8, weight: 85 }] },
        { id: "e37", name: "Leg Press", sets: [{ id: "s85", reps: 12, weight: 150 }, { id: "s86", reps: 12, weight: 160 }] },
      ],
    },
    // ── This week ─────────────────────────────────────────────────────────
    {
      id: "w13", name: "Push E", date: d(5), duration: 58,
      exercises: [
        { id: "e38", name: "Flat Barbell Bench Press", sets: [{ id: "s87", reps: 5, weight: 90 }, { id: "s88", reps: 5, weight: 90 }, { id: "s89", reps: 3, weight: 95 }] },
        { id: "e39", name: "Overhead Press", sets: [{ id: "s90", reps: 6, weight: 55 }, { id: "s91", reps: 5, weight: 57.5 }] },
        { id: "e40", name: "Dumbbell Lateral Raise", sets: [{ id: "s92", reps: 15, weight: 14 }, { id: "s93", reps: 15, weight: 14 }] },
        { id: "e41", name: "Face Pull", sets: [{ id: "s94", reps: 15, weight: 22.5 }, { id: "s95", reps: 15, weight: 22.5 }] },
      ],
    },
    {
      id: "w14", name: "Pull E", date: d(3), duration: 63,
      exercises: [
        { id: "e42", name: "Conventional Deadlift", sets: [{ id: "s96", reps: 3, weight: 130 }, { id: "s97", reps: 2, weight: 135 }, { id: "s98", reps: 1, weight: 140 }] },
        { id: "e43", name: "Lat Pulldown", sets: [{ id: "s99", reps: 10, weight: 72.5 }, { id: "s100", reps: 10, weight: 75 }] },
        { id: "e44", name: "Barbell Curl", sets: [{ id: "s101", reps: 10, weight: 37.5 }, { id: "s102", reps: 8, weight: 40 }] },
      ],
    },
    {
      id: "w15", name: "Legs E", date: d(1), duration: 70,
      exercises: [
        { id: "e45", name: "Barbell Back Squat", sets: [{ id: "s103", reps: 5, weight: 110 }, { id: "s104", reps: 5, weight: 112.5 }, { id: "s105", reps: 2, weight: 117.5 }] },
        { id: "e46", name: "Romanian Deadlift", sets: [{ id: "s106", reps: 10, weight: 85 }, { id: "s107", reps: 8, weight: 87.5 }] },
        { id: "e47", name: "Barbell Hip Thrust", sets: [{ id: "s108", reps: 12, weight: 90 }, { id: "s109", reps: 10, weight: 95 }] },
      ],
    },
  ];
}
