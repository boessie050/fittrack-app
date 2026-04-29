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

/** Built-in exercise list */
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
// Workout Templates (stored locally per device)
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
// Pending Exercise Requests (community — stored in Supabase via community page)
// ---------------------------------------------------------------------------

export type PendingExercise = {
  id: string;
  name: string;
  muscle: MuscleGroup;
  note?: string;
  youtubeUrl?: string;
  fileDataUrl?: string;
  fileType?: "image" | "video";
  submittedAt: string;
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
        return { ...p, upvotes: upvotes - 1, upvotedDeviceIds: upvotedDeviceIds.filter((d) => d !== deviceId) };
      }
      if (downvotedDeviceIds.includes(deviceId)) {
        downvotes -= 1;
        downvotedDeviceIds = downvotedDeviceIds.filter((d) => d !== deviceId);
      }
      return { ...p, upvotes: upvotes + 1, downvotes, upvotedDeviceIds: [...upvotedDeviceIds, deviceId], downvotedDeviceIds };
    } else {
      if (downvotedDeviceIds.includes(deviceId)) {
        return { ...p, downvotes: downvotes - 1, downvotedDeviceIds: downvotedDeviceIds.filter((d) => d !== deviceId) };
      }
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
  exerciseName: string;
  exerciseSlug: string;
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
