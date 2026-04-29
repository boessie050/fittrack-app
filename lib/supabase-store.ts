import { createClient } from "@/lib/supabase/client";
import type { Workout, Exercise, Set } from "@/lib/store";

// ─── Types ──────────────────────────────────────────────────────────────────

export type { Workout, Exercise, Set };

// ─── Read workouts ───────────────────────────────────────────────────────────

export async function getWorkoutsFromDB(): Promise<Workout[]> {
  const supabase = createClient();
  const { data: workoutsData, error } = await supabase
    .from("workouts")
    .select(`
      id, name, date, duration,
      workout_exercises (
        id, name, position,
        workout_sets (
          id, type, reps, weight, duration, position
        )
      )
    `)
    .order("date", { ascending: false });

  if (error || !workoutsData) return [];

  return workoutsData.map((w: any) => ({
    id: w.id,
    name: w.name,
    date: w.date,
    duration: w.duration,
    exercises: (w.workout_exercises || [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((ex: any) => ({
        id: ex.id,
        name: ex.name,
        sets: (ex.workout_sets || [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((s: any) => ({
            id: s.id,
            type: s.type,
            reps: s.reps,
            weight: parseFloat(s.weight),
            duration: s.duration,
          })),
      })),
  }));
}

// ─── Write workout ───────────────────────────────────────────────────────────

export async function addWorkoutToDB(workout: Workout): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Insert workout
  const { data: wRow, error: wErr } = await supabase
    .from("workouts")
    .insert({
      id: workout.id,
      user_id: user.id,
      name: workout.name,
      date: workout.date,
      duration: workout.duration,
    })
    .select("id")
    .single();

  if (wErr || !wRow) {
    console.error("Failed to insert workout", wErr);
    return;
  }

  // 2. Insert exercises + sets
  for (let exIdx = 0; exIdx < workout.exercises.length; exIdx++) {
    const ex = workout.exercises[exIdx];

    const { data: exRow, error: exErr } = await supabase
      .from("workout_exercises")
      .insert({
        id: ex.id,
        workout_id: wRow.id,
        name: ex.name,
        position: exIdx,
      })
      .select("id")
      .single();

    if (exErr || !exRow) continue;

    const setsToInsert = ex.sets.map((s, sIdx) => ({
      id: s.id,
      exercise_id: exRow.id,
      type: s.type ?? "reps",
      reps: s.reps,
      weight: s.weight,
      duration: s.duration ?? 0,
      position: sIdx,
    }));

    await supabase.from("workout_sets").insert(setsToInsert);
  }
}

// ─── Delete workout ──────────────────────────────────────────────────────────

export async function deleteWorkoutFromDB(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("workouts").delete().eq("id", id);
}

// ─── Previous exercise data (from DB) ────────────────────────────────────────

export async function getPreviousExerciseDataFromDB(exerciseName: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const normalizedName = exerciseName.toLowerCase().replace(/^[🔗↳]\s*/, "").trim();

  const { data } = await supabase
    .from("workout_exercises")
    .select(`
      name,
      workout_sets (reps, weight, position),
      workouts!inner (id, name, date, user_id)
    `)
    .ilike("name", normalizedName)
    .eq("workouts.user_id", user.id)
    .order("date", { foreignTable: "workouts", ascending: false })
    .limit(1);

  if (!data || data.length === 0) return null;

  const ex = data[0] as any;
  return {
    date: ex.workouts.date,
    workoutName: ex.workouts.name,
    sets: (ex.workout_sets || [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((s: any) => ({ reps: s.reps, weight: parseFloat(s.weight) })),
  };
}
