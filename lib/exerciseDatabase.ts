export type MuscleGroup =
  | "biceps" | "triceps" | "chest" | "back" | "shoulders"
  | "core" | "quads" | "hamstrings" | "glutes" | "calves";

export type ExerciseDetail = {
  id: string;
  name: string;
  category: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  steps: string[];
  tips: string[];
  gifUrl: string; // hosted gif/image
};

export const EXERCISE_DETAILS: ExerciseDetail[] = [
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description:
      "De bicep curl is dé basisoefening voor het trainen van de bovenarmspieren. Door de elleboog te buigen til je een gewicht op terwijl de bovenarm stilstaat. Perfect voor het opbouwen van massa en kracht in de biceps.",
    steps: [
      "Sta rechtop met een dumbbell in elke hand, palmen naar voren gericht.",
      "Houd je ellebogen dicht langs je lichaam en je bovenarm stil.",
      "Buig de ellebogen en curl het gewicht omhoog naar je schouders.",
      "Knijp de biceps samen bovenaan de beweging.",
      "Laat het gewicht gecontroleerd teruggaan naar de startpositie.",
    ],
    tips: [
      "Swing niet met je rug of schouders — gebruik alleen je onderarm.",
      "Ga helemaal naar beneden voor maximale rek.",
      "Houd de beweging langzaam en gecontroleerd, zeker naar beneden.",
    ],
    gifUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Dumbbell_bicep_curl.gif/220px-Dumbbell_bicep_curl.gif",
  },
];

export function getExerciseDetail(name: string): ExerciseDetail | undefined {
  return EXERCISE_DETAILS.find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
}
