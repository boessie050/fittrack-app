import type { BilingualText } from "./language";

export type MuscleGroup =
  | "biceps" | "triceps" | "chest" | "back" | "shoulders"
  | "core" | "quads" | "hamstrings" | "glutes" | "calves";

export type RepRange = {
  goal: BilingualText;
  sets: string;
  reps: string;
  rest: string;
};

export type ExerciseVariant = {
  name: string;
  difference: BilingualText;
};

export type ExerciseDetail = {
  id: string;          // matches slug, e.g. "bench-press"
  name: string;
  category: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: BilingualText;
  scienceNote: BilingualText;
  steps: BilingualText[];
  tips: BilingualText[];
  commonMistakes: BilingualText[];
  variants: ExerciseVariant[];
  repRanges: RepRange[];
  // Media
  youtubeId: string;
  youtubeCreator: string;
  fallbackGifUrl?: string; // used when wger has no GIF
};

export const EXERCISE_DETAILS: ExerciseDetail[] = [

  // ─── CHEST ────────────────────────────────────────────────────────────────

  {
    id: "flat-barbell-bench-press",
    name: "Flat Barbell Bench Press",
    category: "Chest",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De bankdrukken is de meest effectieve compound oefening voor de borstspieren. Je traint de volledige pectoralis major, met sterke bijdrage van de triceps en voorste deltaspier. Door de horizontale drukbeweging bouw je maximale kracht en massa op in de borst.",
      en: "The bench press is the most effective compound movement for the chest. It targets the full pectoralis major with strong contribution from the triceps and anterior deltoid. The horizontal pressing motion builds maximum strength and mass in the chest.",
    },
    scienceNote: {
      nl: "EMG-onderzoek toont aan dat de vlakke bankdrukken de hoogste activatie geeft van de pectoralis major vergeleken met andere borst-oefeningen. Een brede grip (ca. 1,5x schouderbreedte) maximaliseert de ROM en spierspanning.",
      en: "EMG research shows the flat bench press produces the highest pectoralis major activation compared to other chest exercises. A wide grip (~1.5x shoulder width) maximises ROM and muscle tension.",
    },
    steps: [
      { nl: "Ga op de bank liggen met je ogen onder de stang. Voeten plat op de grond.", en: "Lie on the bench with your eyes under the bar. Feet flat on the floor." },
      { nl: "Pak de stang iets breder dan schouderbreedte. Schouderbladen samen en omlaag trekken (scapular retraction).", en: "Grip the bar slightly wider than shoulder width. Pull shoulder blades together and down (scapular retraction)." },
      { nl: "Adem in, ontgrendel de stang en breng hem langzaam naar de onderkant van je borst.", en: "Inhale, unrack the bar and lower it slowly to your lower chest." },
      { nl: "Raak de borst licht aan en druk explosief omhoog totdat de armen gestrekt zijn.", en: "Lightly touch your chest and press explosively until arms are fully extended." },
      { nl: "Adem uit bovenaan. Herhaal.", en: "Exhale at the top. Repeat." },
    ],
    tips: [
      { nl: "Houd je polsen recht — niet naar achteren geknikt.", en: "Keep your wrists straight — don't let them bend back." },
      { nl: "Duw je voeten actief in de grond voor extra stabiliteit en kracht (leg drive).", en: "Actively drive your feet into the floor for stability and power (leg drive)." },
      { nl: "Laat de stang niet stuiteren op je borst — gecontroleerd contact.", en: "Don't bounce the bar off your chest — controlled contact only." },
    ],
    commonMistakes: [
      { nl: "Schouders optrekken tijdens de beweging — dit belast de rotator cuff.", en: "Shrugging the shoulders during the lift — this strains the rotator cuff." },
      { nl: "Te smalle grip — vermindert ROM en borstactivatie.", en: "Grip too narrow — reduces ROM and chest activation." },
      { nl: "Stang te hoog naar de hals brengen in plaats van naar de borst.", en: "Lowering the bar toward the neck instead of the chest." },
    ],
    variants: [
      { name: "Incline Bench Press", difference: { nl: "Meer focus op de bovenste borst (clavicula deel)", en: "More focus on upper chest (clavicular head)" } },
      { name: "Dumbbell Bench Press", difference: { nl: "Grotere ROM en betere spierrek aan de onderkant", en: "Greater ROM and better stretch at the bottom" } },
      { name: "Close-Grip Bench Press", difference: { nl: "Meer focus op de triceps", en: "More triceps focus" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "1–5", rest: "3–5 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "6–12", rest: "2–3 min" },
      { goal: { nl: "Uithoudingsvermogen", en: "Endurance" }, sets: "2–3", reps: "15–20", rest: "60–90 sec" },
    ],
    youtubeId: "vcBig73ojpE",
    youtubeCreator: "Jeff Nippard",
    fallbackGifUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Bench_press_2.jpg/320px-Bench_press_2.jpg",
  },

  {
    id: "incline-barbell-bench-press",
    name: "Incline Barbell Bench Press",
    category: "Chest",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De schuine bankdrukken richt zich specifiek op het bovenste gedeelte van de pectoralis major (claviculaire kop). Dit geeft de borst een vollere, meer ontwikkelde bovenrand. De hoek van de bank ligt idealiter tussen de 30–45 graden.",
      en: "The incline bench press specifically targets the upper portion of the pectoralis major (clavicular head), giving the chest a fuller, more developed upper region. The ideal bench angle is 30–45 degrees.",
    },
    scienceNote: {
      nl: "Onderzoek van Lauver et al. (2016) toont dat een bankhoek van 30° de activatie van de claviculaire borstspier maximaliseert zonder overmatige schouderbelasting. Boven de 45° neemt de deltoidesactivatie sterk toe ten koste van de borst.",
      en: "Research by Lauver et al. (2016) shows a 30° bench angle maximises clavicular pec activation without excessive shoulder stress. Above 45°, deltoid activation increases significantly at the expense of the chest.",
    },
    steps: [
      { nl: "Stel de bank in op 30–45 graden. Ga liggen met ogen onder de stang.", en: "Set bench to 30–45 degrees. Lie with eyes under the bar." },
      { nl: "Pak de stang iets breder dan schouderbreedte, schouderbladen ingeklemd.", en: "Grip slightly wider than shoulder width, shoulder blades retracted." },
      { nl: "Laat de stang zakken naar de bovenkant van de borst/sleutelbeen.", en: "Lower the bar to the upper chest/clavicle area." },
      { nl: "Druk explosief omhoog en vergrendel de ellebogen bovenaan.", en: "Press explosively upward and lock out at the top." },
    ],
    tips: [
      { nl: "Gebruik geen hoek hoger dan 45° — dan wordt het een schouderoefening.", en: "Don't use an angle higher than 45° — it becomes a shoulder exercise." },
      { nl: "Laat de stang naar de bovenborst zakken, niet naar de keel.", en: "Lower the bar to the upper chest, not toward the throat." },
    ],
    commonMistakes: [
      { nl: "Bank te steil instellen (60–90°) — dit traint voornamelijk de schouders.", en: "Setting the bench too steep (60–90°) — this primarily trains the shoulders." },
      { nl: "Schouders laten oprollen naar voren.", en: "Allowing shoulders to roll forward." },
    ],
    variants: [
      { name: "Incline Dumbbell Press", difference: { nl: "Meer rek aan de onderkant, betere spieractivatie per zijde", en: "More stretch at the bottom, better per-side activation" } },
      { name: "Incline Dumbbell Fly", difference: { nl: "Isolatieoefening voor de bovenborst zonder tricepsbelasting", en: "Isolation movement for upper chest without triceps involvement" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4", reps: "3–6", rest: "3 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12", rest: "2 min" },
    ],
    youtubeId: "swp6-_aHfg0",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "cable-crossover",
    name: "Cable Crossover",
    category: "Chest",
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    equipment: "Cable machine",
    difficulty: "Beginner",
    description: {
      nl: "De cable crossover is een isolatie-oefening die de borstspieren traint via een vluchtige beweging (fly). Omdat kabels constante spanning bieden gedurende de hele ROM, is dit een uitstekende aanvulling op compound persen voor maximale hypertrofie.",
      en: "The cable crossover is an isolation exercise training the chest through a fly motion. Because cables provide constant tension throughout the full ROM, it's an excellent complement to compound pressing for maximal hypertrophy.",
    },
    scienceNote: {
      nl: "Kabeloefeningen behouden mechanische spanning ook in de gestrekte positie — dit is cruciaal voor hypertrofie volgens het 'stretched position' principe (Milo Wolf, 2023). Dit maakt cables superieur aan dumbbells voor fly-bewegingen.",
      en: "Cable exercises maintain mechanical tension in the stretched position — this is crucial for hypertrophy according to the 'stretched position' principle (Milo Wolf, 2023). This makes cables superior to dumbbells for fly movements.",
    },
    steps: [
      { nl: "Stel de kabels in op borstoogte. Pak één handgreep in elke hand.", en: "Set cables to chest height. Grab one handle in each hand." },
      { nl: "Doe een stap naar voren zodat je armen licht gestrekt zijn naar achteren (stretch op de borst).", en: "Step forward so your arms are slightly extended behind you (stretch on the chest)." },
      { nl: "Breng de handen samen voor je lichaam met een lichte buiging in de ellebogen.", en: "Bring your hands together in front of your body with a slight elbow bend." },
      { nl: "Knijp de borstspieren samen op het punt van maximale contractie.", en: "Squeeze the chest at the point of maximum contraction." },
      { nl: "Laat gecontroleerd terug naar de startpositie.", en: "Return slowly to the start position." },
    ],
    tips: [
      { nl: "Houd een constante lichte buiging in de ellebogen — nooit volledig strekken.", en: "Maintain a slight constant bend in the elbows — never fully lock out." },
      { nl: "Kabelstand: laag voor de onderborst, hoog voor de bovenborst.", en: "Cable position: low for lower chest, high for upper chest." },
    ],
    commonMistakes: [
      { nl: "Te zwaar gewicht gebruiken waardoor je de beweging niet gecontroleerd kunt uitvoeren.", en: "Using too much weight and losing control of the movement." },
      { nl: "De armen te ver terug laten gaan — overmatige schouderbelasting.", en: "Letting arms go too far back — excessive shoulder strain." },
    ],
    variants: [
      { name: "Low Cable Fly", difference: { nl: "Kabels laag instellen voor de onderste borstrand", en: "Set cables low to target the lower chest" } },
      { name: "Single-Arm Cable Fly", difference: { nl: "Unilaterale focus, meer core-stabiliteit vereist", en: "Unilateral focus, more core stability required" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60–90 sec" },
      { goal: { nl: "Pompwerk / finisher", en: "Pump / finisher" }, sets: "2–3", reps: "15–20", rest: "45 sec" },
    ],
    youtubeId: "taI4XduLpTk",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── BACK ─────────────────────────────────────────────────────────────────

  {
    id: "conventional-deadlift",
    name: "Conventional Deadlift",
    category: "Back",
    primaryMuscles: ["back", "glutes", "hamstrings"],
    secondaryMuscles: ["core", "quads"],
    equipment: "Barbell",
    difficulty: "Advanced",
    description: {
      nl: "De deadlift is de meest effectieve compound oefening voor de volledige achterkant van het lichaam. Hij traint de erector spinae, bilspieren, hamstrings en bovenbeen tegelijk. Geen enkele andere oefening belast zoveel spiermassa in één beweging.",
      en: "The deadlift is the most effective compound exercise for the entire posterior chain. It trains the erector spinae, glutes, hamstrings and quads simultaneously. No other exercise loads as much muscle mass in a single movement.",
    },
    scienceNote: {
      nl: "De deadlift produceert de hoogste totale spieractivatie van alle krachtoefeningen (Escamilla et al., 2002). De heup-scharnierende beweging activeert de gluteus maximus en hamstrings maximaal in een hoge belastingszone.",
      en: "The deadlift produces the highest total muscle activation of all strength exercises (Escamilla et al., 2002). The hip hinge movement maximally activates the gluteus maximus and hamstrings under heavy load.",
    },
    steps: [
      { nl: "Sta met middenvoet onder de stang, voeten op heupbreedte.", en: "Stand with midfoot under the bar, feet hip-width apart." },
      { nl: "Buig door de heupen en knieën en pak de stang met een duimsbrede greep buiten je scheenbenen.", en: "Hinge at hips and knees, grip the bar just outside your shins." },
      { nl: "Adem in, span de core aan (Valsalva manoeuvre), rug recht.", en: "Inhale, brace your core (Valsalva manoeuvre), keep a neutral spine." },
      { nl: "Trek de stang van de grond door gelijktijdig de heupen te strekken en de knieën te drukken.", en: "Pull the bar off the floor by simultaneously extending hips and pushing the floor away." },
      { nl: "Sta volledig rechtop, heupen en knieën gestrekt. Laat gecontroleerd terug.", en: "Stand fully upright, hips and knees locked out. Lower with control." },
    ],
    tips: [
      { nl: "Houd de stang dicht langs het lichaam — dit vermindert de momentarm op de rug.", en: "Keep the bar close to your body — this reduces the moment arm on the spine." },
      { nl: "Begin met de heupen in de juiste hoek: niet te hoog (dan wordt het een stiff-leg), niet te laag (dan wordt het een squat).", en: "Start with hips at the right angle: not too high (stiff-leg) or too low (squat)." },
    ],
    commonMistakes: [
      { nl: "Rug afronden — dit plaatst extreme druk op de lumbale wervels.", en: "Rounding the lower back — this places extreme pressure on the lumbar vertebrae." },
      { nl: "De stang van de grond 'rukken' in plaats van geleidelijk spanning opbouwen.", en: "Jerking the bar off the floor instead of building tension gradually." },
      { nl: "Heupen te vroeg strekken waardoor je torso te ver naar achteren kantelt (stangel).", en: "Extending the hips too early causing your torso to lean back excessively." },
    ],
    variants: [
      { name: "Romanian Deadlift", difference: { nl: "Focus op hamstrings en billen via een heupscharnierbeweging met minimale kniebuiging", en: "Focuses on hamstrings and glutes via hip hinge with minimal knee bend" } },
      { name: "Sumo Deadlift", difference: { nl: "Bredere stand, meer quadriceps en bilspieren, minder rug", en: "Wider stance, more quads and glutes, less lower back" } },
      { name: "Trap Bar Deadlift", difference: { nl: "Meer knieflex, gunstiger voor de rug, goed voor beginners", en: "More knee flexion, more spine-friendly, good for beginners" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "1–5", rest: "4–5 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "5–8", rest: "3 min" },
    ],
    youtubeId: "VL5Ab0T07e4",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "pull-up",
    name: "Pull-Up",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "core"],
    equipment: "Pull-up bar",
    difficulty: "Intermediate",
    description: {
      nl: "De pull-up is de beste bodyweight oefening voor de latissimus dorsi en geeft een V-taper aan het lichaam. De verticale trekbeweging activeert de lats maximaal en traint ook de biceps en core als secundaire spieren.",
      en: "The pull-up is the best bodyweight exercise for the latissimus dorsi and creates a V-taper physique. The vertical pulling movement maximally activates the lats while also training the biceps and core as secondary muscles.",
    },
    scienceNote: {
      nl: "EMG-studies tonen dat pull-ups een hogere lat-activatie geven dan lat-pulldowns bij vergelijkbare belasting. De volledige rek aan de onderkant van de beweging is essentieel — kortere ROM reduceert hypertrofieprikkel significant.",
      en: "EMG studies show pull-ups produce higher lat activation than lat pulldowns at comparable loads. Full stretch at the bottom of the movement is essential — shorter ROM significantly reduces the hypertrophy stimulus.",
    },
    steps: [
      { nl: "Hang aan de stang met een pronated grip (handpalmen van je af), schouderbreedte of iets breder.", en: "Hang from the bar with a pronated grip (palms away), shoulder-width or slightly wider." },
      { nl: "Laat je schouders volledig zakken voor maximale lat-stretch.", en: "Let your shoulders fully depress for maximum lat stretch." },
      { nl: "Trek je ellebogen naar beneden en naar achteren terwijl je omhoog trekt.", en: "Pull your elbows down and back as you pull yourself up." },
      { nl: "Til jezelf op totdat je kin boven de stang is.", en: "Pull until your chin is above the bar." },
      { nl: "Laat gecontroleerd terug naar volledige armstrekking.", en: "Lower with control to full arm extension." },
    ],
    tips: [
      { nl: "Denk 'ellebogen naar je broekzakken' in plaats van 'jezelf omhoog trekken'.", en: "Think 'elbows to your back pockets' instead of 'pull yourself up'." },
      { nl: "Houd de core gespannen om te voorkomen dat je benen zwaaien.", en: "Keep your core tight to prevent your legs from swinging." },
    ],
    commonMistakes: [
      { nl: "Halve reps uitvoeren — altijd volledig strekken aan de onderkant.", en: "Partial reps — always fully extend at the bottom." },
      { nl: "Met de nek naar voren duwen om de kin over de stang te krijgen.", en: "Jutting the neck forward to get the chin over the bar." },
    ],
    variants: [
      { name: "Chin-Up", difference: { nl: "Supinated grip — meer bicepsbetrokkenheid, makkelijker voor beginners", en: "Supinated grip — more bicep involvement, easier for beginners" } },
      { name: "Wide-Grip Pull-Up", difference: { nl: "Bredere grip activeert meer de buitenste lats", en: "Wider grip targets the outer lats more" } },
      { name: "Weighted Pull-Up", difference: { nl: "Extra gewicht voor progressieve overload", en: "Added weight for progressive overload" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "3–6", rest: "3 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "6–12", rest: "2 min" },
    ],
    youtubeId: "fNMSCIKO1YU",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "bent-over-barbell-row",
    name: "Bent-Over Barbell Row",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "core", "hamstrings"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De barbell row is dé compound trekbeweging voor de dikke rugspieren: de rhomboids, midden-trapezius en de lats. Gecombineerd met deadlifts en pull-ups vormt dit het fundament van rugontwikkeling.",
      en: "The barbell row is the primary compound pulling movement for the thick back muscles: rhomboids, mid-trapezius and lats. Combined with deadlifts and pull-ups, it forms the foundation of back development.",
    },
    scienceNote: {
      nl: "De horizontale trekbeweging activeert de midden-rug (rhomboids, trapezius) beter dan verticale trek. Een pronated grip met een hoek van 45° geeft optimale balans tussen lat-activatie en rhomboid-activatie.",
      en: "Horizontal pulling movements activate the mid-back (rhomboids, trapezius) better than vertical pulls. A pronated grip at 45° provides optimal balance between lat and rhomboid activation.",
    },
    steps: [
      { nl: "Sta met voeten op heupbreedte, pak de stang met een pronated greep iets breder dan schouderbreed.", en: "Stand hip-width, grip the bar pronated slightly wider than shoulder-width." },
      { nl: "Kantel de torso naar voren tot ca. 45° (of meer parallel aan de grond).", en: "Hinge forward to about 45° (or more parallel to the floor)." },
      { nl: "Laat de stang hangen met gestrekte armen — voel de rek in de lats.", en: "Let the bar hang with arms extended — feel the stretch in the lats." },
      { nl: "Trek de stang naar je navel/onderkant borst. Knijp de schouderbladen samen.", en: "Row the bar to your navel/lower chest. Squeeze shoulder blades together." },
      { nl: "Laat gecontroleerd terug naar volledig gestrekte armen.", en: "Lower with control to full arm extension." },
    ],
    tips: [
      { nl: "Houd de rug recht — geen geforceerde ronding in de lumbale regio.", en: "Keep your back flat — no forced rounding in the lumbar region." },
      { nl: "Trek met je ellebogen, niet met je handen.", en: "Pull with your elbows, not your hands." },
    ],
    commonMistakes: [
      { nl: "Te veel torsorotatie gebruiken om momentum te genereren.", en: "Using too much torso rotation to generate momentum." },
      { nl: "De stang naar de borst trekken in plaats van naar de navel — dit vermindert latactivatie.", en: "Rowing to the chest instead of the navel — reduces lat activation." },
    ],
    variants: [
      { name: "Pendlay Row", difference: { nl: "Stang start elke rep op de grond — meer explosieve kracht", en: "Bar starts on the floor each rep — more explosive power" } },
      { name: "Dumbbell Row", difference: { nl: "Unilateraal, grotere ROM, minder technische drempel", en: "Unilateral, greater ROM, lower technical barrier" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4", reps: "4–6", rest: "3 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12", rest: "2 min" },
    ],
    youtubeId: "axoeDmW0oAY",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "Cable machine",
    difficulty: "Beginner",
    description: {
      nl: "De lat pulldown is de meest toegankelijke verticale trekbeweging en een ideale alternatief of aanvulling op pull-ups. Hij traint primair de latissimus dorsi en is daarmee essentieel voor breedte in de rug.",
      en: "The lat pulldown is the most accessible vertical pulling movement and an ideal alternative or complement to pull-ups. It primarily trains the latissimus dorsi and is essential for building back width.",
    },
    scienceNote: {
      nl: "Een schouderbrede of iets bredere grip geeft de beste latissimus activatie. Achter het hoofd trekken verhoogt het blessurerisico voor de cervicale wervelkolom significant zonder extra spieractivatie te bieden.",
      en: "A shoulder-width or slightly wider grip produces optimal latissimus activation. Behind-the-neck pulldowns significantly increase cervical spine injury risk with no added muscle activation benefit.",
    },
    steps: [
      { nl: "Zit aan de machine met dijen onder de pads. Pak de stang met een brede pronated greep.", en: "Sit at the machine with thighs under the pads. Grip the bar wide with a pronated grip." },
      { nl: "Kantel de torso licht naar achteren (ca. 15°).", en: "Lean your torso back slightly (~15°)." },
      { nl: "Trek de stang naar je bovenborst terwijl je je ellebogen naar beneden en buiten trekt.", en: "Pull the bar to your upper chest while driving your elbows down and out." },
      { nl: "Knijp de lats samen onderaan. Strek de armen gecontroleerd terug omhoog.", en: "Squeeze the lats at the bottom. Extend arms back up with control." },
    ],
    tips: [
      { nl: "Denk 'ellebogen naar de grond' voor maximale lat-activatie.", en: "Think 'elbows to the floor' for maximum lat activation." },
      { nl: "Nooit achter het hoofd trekken — dit is biomechanisch nadelig.", en: "Never pull behind the head — this is biomechanically disadvantageous." },
    ],
    commonMistakes: [
      { nl: "Te ver naar achteren leunen — dit verandert de oefening in een rij-beweging.", en: "Leaning too far back — this turns it into a rowing movement." },
      { nl: "Met de biceps trekken in plaats van de lats.", en: "Pulling with the biceps instead of the lats." },
    ],
    variants: [
      { name: "Close-Grip Lat Pulldown", difference: { nl: "Meer bicepsbetrokkenheid, grotere ROM", en: "More bicep involvement, greater ROM" } },
      { name: "Single-Arm Lat Pulldown", difference: { nl: "Unilateraal, betere focus per lat", en: "Unilateral, better per-side lat focus" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–15", rest: "90 sec" },
    ],
    youtubeId: "MIvjVGqrCkU",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── SHOULDERS ────────────────────────────────────────────────────────────

  {
    id: "barbell-military-press",
    name: "Barbell Military Press",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De overhead press (OHP) is het fundament van schouderkracht en -massa. Hij traint de volledige deltaspier (voornamelijk de voorste en middelste kop) samen met de triceps en core. Het is de beste compound oefening voor schouderontwikkeling.",
      en: "The overhead press (OHP) is the foundation of shoulder strength and mass. It trains the full deltoid (primarily anterior and medial heads) along with triceps and core. It is the best compound movement for shoulder development.",
    },
    scienceNote: {
      nl: "De OHP activeert alle drie de koppen van de deltaspier, maar primair de voorste deltakop (anterior deltoid). Onderzoek toont dat staand uitvoeren meer core-activatie geeft dan zittend, maar minder gewicht kan worden gebruikt.",
      en: "The OHP activates all three deltoid heads, primarily the anterior deltoid. Research shows standing execution produces more core activation than seated, but less weight can be used.",
    },
    steps: [
      { nl: "Sta met voeten op schouderbreedte. Pak de stang net buiten schouderbreedte.", en: "Stand feet shoulder-width. Grip the bar just outside shoulder width." },
      { nl: "Breng de stang naar schouderhoogte, ellebogen net iets voor de stang.", en: "Bring the bar to shoulder height, elbows slightly in front of the bar." },
      { nl: "Adem in, span de core aan, druk de stang recht omhoog.", en: "Inhale, brace core, press the bar straight overhead." },
      { nl: "Beweeg het hoofd licht naar achteren terwijl de stang passeert, dan terug naar voren.", en: "Move your head slightly back as the bar passes, then forward again." },
      { nl: "Strek de armen volledig bovenaan. Laat gecontroleerd terug naar de schouders.", en: "Fully extend arms at the top. Lower with control back to shoulders." },
    ],
    tips: [
      { nl: "Knijp de billen samen en span de core aan voor maximale stabiliteit.", en: "Squeeze glutes and brace core for maximum stability." },
      { nl: "Houd de stang boven het mid-voet in balans.", en: "Keep the bar balanced over mid-foot." },
    ],
    commonMistakes: [
      { nl: "Te veel in de lende buigen (extreme lordose) — dit belast de lumbale wervelkolom.", en: "Excessive lower back arch — this loads the lumbar spine." },
      { nl: "Ellebogen te breed houden, waardoor de stang niet recht omhoog kan.", en: "Elbows too wide, preventing a straight bar path." },
    ],
    variants: [
      { name: "Seated Overhead Press", difference: { nl: "Meer isolatie van de schouders, minder core-betrokkenheid", en: "More shoulder isolation, less core involvement" } },
      { name: "Dumbbell Shoulder Press", difference: { nl: "Grotere ROM, betere balans per zijde", en: "Greater ROM, better per-side balance" } },
      { name: "Arnold Press", difference: { nl: "Rotatie activeert alle drie de deltakoppen extra", en: "Rotation additionally activates all three deltoid heads" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "3–6", rest: "3–4 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12", rest: "2 min" },
    ],
    youtubeId: "_RlRDWO2jfg",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: [],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    description: {
      nl: "De lateral raise is de meest directe isolatie-oefening voor de middelste deltakop, die verantwoordelijk is voor de breedte van de schouders. Geen enkele compound oefening activeert de middelste delt zo direct als de lateral raise.",
      en: "The lateral raise is the most direct isolation exercise for the medial deltoid head, responsible for shoulder width. No compound movement activates the medial delt as directly as the lateral raise.",
    },
    scienceNote: {
      nl: "De middelste deltakop heeft een hoge spiervezeldichtheid en reageert goed op hogere rep-ranges (15–30). Licht voorover leunen (~30°) verhoogt de mechanische spanning op de middelste delt in de gestrekte positie.",
      en: "The medial deltoid has high muscle fibre density and responds well to higher rep ranges (15–30). Leaning slightly forward (~30°) increases mechanical tension on the medial delt in the stretched position.",
    },
    steps: [
      { nl: "Sta rechtop met een dumbbell in elke hand langs het lichaam.", en: "Stand upright with a dumbbell in each hand at your sides." },
      { nl: "Hef de armen zijwaarts omhoog met een lichte buiging in de ellebogen.", en: "Raise arms laterally with a slight bend in the elbows." },
      { nl: "Til tot schouderhoogte — niet hoger (anders neemt de trapezius het over).", en: "Lift to shoulder height — not higher (otherwise the trapezius takes over)." },
      { nl: "Draai de pinky iets omhoog ('giet een glas leeg') voor extra middelste delt-activatie.", en: "Rotate the pinky slightly upward ('pour a glass') for extra medial delt activation." },
      { nl: "Laat gecontroleerd terug omlaag.", en: "Lower with control." },
    ],
    tips: [
      { nl: "Gebruik licht gewicht — de middelste delt is een kleine spier.", en: "Use light weight — the medial delt is a small muscle." },
      { nl: "Ga niet te hoog om de trapezius uit de beweging te houden.", en: "Don't go too high to keep the trapezius out of the movement." },
    ],
    commonMistakes: [
      { nl: "Momentum gebruiken door het lichaam te wiegen — dit vermindert de spieractivatie enorm.", en: "Using momentum by swinging the body — this greatly reduces muscle activation." },
      { nl: "Armen boven schouderhoogte heffen — trapezius neemt het over.", en: "Raising arms above shoulder height — trapezius takes over." },
    ],
    variants: [
      { name: "Cable Lateral Raise", difference: { nl: "Constante spanning ook in de gestrekte positie — betere hypertrofieprikkel", en: "Constant tension even in the stretched position — better hypertrophy stimulus" } },
      { name: "Leaning Lateral Raise", difference: { nl: "Meer stretch op de middelste delt door naar opzij te leunen", en: "More stretch on the medial delt by leaning to the side" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "15–25", rest: "60 sec" },
    ],
    youtubeId: "kDqklk1ZESo",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "face-pull",
    name: "Face Pull",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["back"],
    equipment: "Cable machine",
    difficulty: "Beginner",
    description: {
      nl: "De face pull traint de achterste deltakop (rear delt) en de externe schouderrotatoren — twee van de meest verwaarloosde spiergroepen in de sportschool. Dit is essentieel voor schoudergezondheid en een gebalanceerd postuur.",
      en: "The face pull targets the rear deltoid and external shoulder rotators — two of the most neglected muscle groups in the gym. This is essential for shoulder health and balanced posture.",
    },
    scienceNote: {
      nl: "De achterste deltakop wordt nauwelijks geactiveerd door de meeste compound oefeningen en vereist gerichte isolatietraining. Externe schouderrotatie versterkt de rotator cuff en beschermt tegen blessures bij pressing-bewegingen.",
      en: "The rear deltoid is barely activated by most compound exercises and requires targeted isolation training. External shoulder rotation strengthens the rotator cuff and protects against injuries during pressing movements.",
    },
    steps: [
      { nl: "Stel de kabel in op ooghoogte met een touw-handgreep.", en: "Set the cable to eye height with a rope attachment." },
      { nl: "Pak het touw met beide handen (duimen naar boven).", en: "Grab the rope with both hands (thumbs facing up)." },
      { nl: "Trek het touw naar je gezicht terwijl je ellebogen breed uitwaarts houdt.", en: "Pull the rope toward your face while keeping elbows wide and high." },
      { nl: "Aan het einde van de beweging: draai de handen naar buiten (externe rotatie).", en: "At the end of the movement: rotate hands outward (external rotation)." },
      { nl: "Laat gecontroleerd terug.", en: "Return with control." },
    ],
    tips: [
      { nl: "Houd de ellebogen minstens op schouderhoogte gedurende de hele beweging.", en: "Keep elbows at least at shoulder height throughout the movement." },
      { nl: "Dit is geen krachtoefening — gebruik licht gewicht met focus op contractie.", en: "This is not a strength exercise — use light weight with focus on contraction." },
    ],
    commonMistakes: [
      { nl: "Ellebogen zakken laten — de achterste delt wordt dan niet geïsoleerd.", en: "Letting elbows drop — the rear delt is no longer isolated." },
      { nl: "Te zwaar gewicht gebruiken waardoor de trapezius domineert.", en: "Using too much weight causing the trapezius to dominate." },
    ],
    variants: [
      { name: "Band Face Pull", difference: { nl: "Weerstandsband als alternatief voor thuis", en: "Resistance band as a home alternative" } },
    ],
    repRanges: [
      { goal: { nl: "Schoudergezondheid / hypertrofie", en: "Shoulder health / hypertrophy" }, sets: "3–4", reps: "15–25", rest: "60 sec" },
    ],
    youtubeId: "rep-qVOkqgk",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── BICEPS ───────────────────────────────────────────────────────────────

  {
    id: "barbell-curl",
    name: "Barbell Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "Barbell",
    difficulty: "Beginner",
    description: {
      nl: "De barbell curl is de meest effectieve compound curl-oefening voor de biceps. Door de bilaterale belasting kun je meer gewicht gebruiken dan met dumbbells, wat leidt tot een sterkere overload en meer massawinst.",
      en: "The barbell curl is the most effective compound curl exercise for the biceps. The bilateral loading allows you to use more weight than with dumbbells, leading to stronger overload and more mass gain.",
    },
    scienceNote: {
      nl: "De biceps brachii heeft twee koppen (lange en korte kop). Een smalle grip activeert meer de lange kop (buitenkant), een brede grip meer de korte kop (binnenkant). Supinatie aan het einde van de beweging maximaliseert de contractie.",
      en: "The biceps brachii has two heads (long and short). A narrow grip activates more of the long head (outer), a wide grip more of the short head (inner). Supination at the top of the movement maximises contraction.",
    },
    steps: [
      { nl: "Sta rechtop met de stang in een supinated greep (palmen omhoog), schouderbreedte.", en: "Stand upright with the bar in a supinated grip (palms up), shoulder-width." },
      { nl: "Houd de ellebogen gefixeerd aan je zij.", en: "Keep elbows fixed at your sides." },
      { nl: "Curl de stang omhoog terwijl je de biceps contracheert.", en: "Curl the bar up while contracting the biceps." },
      { nl: "Knijp bovenaan samen, laat dan gecontroleerd terug naar volledige armstrekking.", en: "Squeeze at the top, then lower with control to full arm extension." },
    ],
    tips: [
      { nl: "Ga altijd naar volledige armstrekking voor maximale rek en hypertrofie.", en: "Always go to full arm extension for maximum stretch and hypertrophy." },
      { nl: "Gebruik de EZ-bar als je polsklachten hebt.", en: "Use an EZ-bar if you have wrist discomfort." },
    ],
    commonMistakes: [
      { nl: "Ellebogen naar voren bewegen — dit maakt het een schouder-oefening.", en: "Moving elbows forward — this turns it into a shoulder exercise." },
      { nl: "Swing met de rug — vermindert bicepsactivatie en verhoogt blessurerisico.", en: "Swinging with the back — reduces bicep activation and increases injury risk." },
    ],
    variants: [
      { name: "EZ-Bar Curl", difference: { nl: "Minder polsbelasting, goed alternatief bij klachten", en: "Less wrist stress, good alternative for discomfort" } },
      { name: "Incline Dumbbell Curl", difference: { nl: "Maximale rek op de lange kop van de biceps", en: "Maximum stretch on the long head of the biceps" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–15", rest: "60–90 sec" },
    ],
    youtubeId: "Gfl6SU7jw2o",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "incline-dumbbell-curl",
    name: "Incline Dumbbell Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    description: {
      nl: "De incline dumbbell curl is de beste isolatie-oefening voor de lange kop van de biceps. Door de schuine bankhoek begint de arm in een gestrekte positie achter het lichaam, wat een maximale rek op de biceps geeft.",
      en: "The incline dumbbell curl is the best isolation exercise for the long head of the biceps. The inclined position starts the arm in an extended position behind the body, providing maximum stretch on the biceps.",
    },
    scienceNote: {
      nl: "Onderzoek (Goto et al., 2022) toont dat oefeningen met maximale spierrek de sterkste hypertrofieprikkel geven. De incline curl plaatst de biceps in een maximaal gestrekte positie aan het begin van de beweging — dit is ideaal voor lange-kop groei.",
      en: "Research (Goto et al., 2022) shows exercises with maximal muscle stretch produce the strongest hypertrophy stimulus. The incline curl places the biceps in a maximally stretched position at the start of the movement — ideal for long-head growth.",
    },
    steps: [
      { nl: "Stel de bank in op 45–60 graden. Ga achterover zitten met dumbbells in beide handen.", en: "Set bench to 45–60 degrees. Sit back with dumbbells in both hands." },
      { nl: "Laat de armen volledig hangen — voel de rek in de biceps.", en: "Let arms hang fully — feel the stretch in the biceps." },
      { nl: "Curl beide dumbbells gelijktijdig omhoog zonder de ellebogen te bewegen.", en: "Curl both dumbbells simultaneously upward without moving the elbows." },
      { nl: "Laat gecontroleerd terug naar volledige strekking.", en: "Lower with control to full extension." },
    ],
    tips: [
      { nl: "Gebruik een lager gewicht dan bij staande curls — de stretch-positie is veel intenser.", en: "Use lighter weight than standing curls — the stretch position is much more intense." },
      { nl: "Doe elke rep langzaam naar beneden (3–4 seconden) voor maximaal effect.", en: "Lower each rep slowly (3–4 seconds) for maximum effect." },
    ],
    commonMistakes: [
      { nl: "Ellebogen naar voren brengen bij de curling-beweging — verliest de rek.", en: "Bringing elbows forward during the curl — loses the stretch." },
      { nl: "Te zware dumbbells gebruiken waardoor je spierspanning verliest aan de onderkant.", en: "Using too heavy dumbbells causing loss of muscle tension at the bottom." },
    ],
    variants: [
      { name: "Spider Curl", difference: { nl: "Borst op schuine bank — maximaliseert contractie bovenaan", en: "Chest on incline bench — maximises contraction at top" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60 sec" },
    ],
    youtubeId: "sAq_ocpRh_I",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── TRICEPS ──────────────────────────────────────────────────────────────

  {
    id: "skull-crusher",
    name: "Skull Crusher",
    category: "Arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: "Barbell / EZ-bar",
    difficulty: "Intermediate",
    description: {
      nl: "De skull crusher (ook wel lying tricep extension) is de beste isolatie-oefening voor de lange kop van de triceps. De overhead positie van de arm plaatst de lange kop in een maximale gestrekte positie.",
      en: "The skull crusher (also known as lying tricep extension) is the best isolation exercise for the long head of the triceps. The overhead arm position places the long head in a maximally stretched position.",
    },
    scienceNote: {
      nl: "De lange kop van de triceps maakt 67% uit van de totale tricepsomvang en wordt het beste geactiveerd bij overhead extensies (arm boven het hoofd). EMG-studies bevestigen hogere lange-kop activatie bij skull crushers dan bij pushdowns.",
      en: "The long head of the triceps makes up 67% of total triceps volume and is best activated in overhead extensions (arm overhead). EMG studies confirm higher long-head activation in skull crushers than pushdowns.",
    },
    steps: [
      { nl: "Ga op de bank liggen met een EZ-bar of stang. Houd de stang boven je borst met gestrekte armen.", en: "Lie on a bench with an EZ-bar or barbell. Hold the bar above your chest with arms extended." },
      { nl: "Houd de bovenarmen verticaal — beweeg alleen de onderarmen.", en: "Keep upper arms vertical — move only the forearms." },
      { nl: "Laat de stang zakken naar je voorhoofd (vandaar de naam).", en: "Lower the bar toward your forehead (hence the name)." },
      { nl: "Strek de armen explosief terug naar de startpositie.", en: "Extend arms explosively back to the start position." },
    ],
    tips: [
      { nl: "Houd de ellebogen naar binnen — niet naar buiten flappen.", en: "Keep elbows pointing inward — don't flare them out." },
      { nl: "EZ-bar is vriendelijker voor de polsen dan een rechte stang.", en: "EZ-bar is more wrist-friendly than a straight barbell." },
    ],
    commonMistakes: [
      { nl: "Ellebogen naar buiten laten vallen — dit vermindert de tricepsactivatie.", en: "Letting elbows flare out — this reduces triceps activation." },
      { nl: "De bovenarmen bewegen in plaats van gefixeerd houden.", en: "Moving the upper arms instead of keeping them fixed." },
    ],
    variants: [
      { name: "Overhead Dumbbell Extension", difference: { nl: "Zittend of staand — meer nadruk op de lange kop", en: "Seated or standing — more long head emphasis" } },
      { name: "Cable Skull Crusher", difference: { nl: "Constante spanning door de volledige ROM", en: "Constant tension through full ROM" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–15", rest: "90 sec" },
    ],
    youtubeId: "ng0DqMHe6zw",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "rope-tricep-pushdown",
    name: "Rope Tricep Pushdown",
    category: "Arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: "Cable machine",
    difficulty: "Beginner",
    description: {
      nl: "De touw pushdown is de meest populaire isolatie-oefening voor de triceps. Het touw laat je aan het einde van de beweging de handen naar buiten draaien, wat een extra sterke contractie van alle drie de tricepskoppen geeft.",
      en: "The rope pushdown is the most popular isolation exercise for the triceps. The rope allows you to flare the hands outward at the bottom of the movement, producing an extra strong contraction of all three triceps heads.",
    },
    scienceNote: {
      nl: "De laterale kop (buitenkant) en mediale kop van de triceps worden sterk geactiveerd bij pushdowns. Door de handen te spreiden aan het einde van de beweging (pronatie) wordt de volledige tricepscontractie bereikt.",
      en: "The lateral and medial heads of the triceps are strongly activated during pushdowns. Spreading the hands at the end of the movement (pronation) achieves full triceps contraction.",
    },
    steps: [
      { nl: "Stel de kabel in op de hoogste stand met een touw-handgreep.", en: "Set cable to the highest position with a rope attachment." },
      { nl: "Pak het touw met beide handen, ellebogen dicht bij het lichaam.", en: "Grab the rope with both hands, elbows close to the body." },
      { nl: "Druk het touw omlaag terwijl je ellebogen gefixeerd blijven.", en: "Push the rope downward while elbows remain fixed." },
      { nl: "Aan het einde: spreid de handen naar buiten voor maximale contractie.", en: "At the bottom: spread hands outward for maximum contraction." },
      { nl: "Laat gecontroleerd terug naar de startpositie.", en: "Return with control to the start position." },
    ],
    tips: [
      { nl: "Houd de ellebogen gefixeerd — beweeg alleen de onderarmen.", en: "Keep elbows fixed — move only the forearms." },
      { nl: "Leun licht naar voren voor een betere hoek en meer stabiliteit.", en: "Lean slightly forward for a better angle and more stability." },
    ],
    commonMistakes: [
      { nl: "Ellebogen van het lichaam af bewegen — dit maakt het een compound beweging.", en: "Moving elbows away from the body — this turns it into a compound movement." },
      { nl: "Alleen de onderste helft van de ROM uitvoeren.", en: "Only performing the bottom half of the ROM." },
    ],
    variants: [
      { name: "V-Bar Pushdown", difference: { nl: "Meer weerstand in de bovenste ROM, goed voor kracht", en: "More resistance at top of ROM, good for strength" } },
      { name: "Single-Arm Cable Pushdown", difference: { nl: "Unilateraal, betere focus per tricepskop", en: "Unilateral, better per-side focus" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "12–20", rest: "60 sec" },
    ],
    youtubeId: "kiuVA0gs3EI",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "tricep-dips",
    name: "Tricep Dips",
    category: "Arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "shoulders"],
    equipment: "Dip bars",
    difficulty: "Intermediate",
    description: {
      nl: "Tricep dips zijn een van de zwaarste en meest effectieve bodyweight oefeningen voor de triceps. Door de torso rechtop te houden (niet naar voren te leunen) wordt de focus op de triceps gehouden in plaats van de borst.",
      en: "Tricep dips are one of the heaviest and most effective bodyweight exercises for the triceps. By keeping the torso upright (not leaning forward) the focus remains on the triceps rather than the chest.",
    },
    scienceNote: {
      nl: "De hoek van de torso bepaalt de spierverdeling: rechtop = tricepsgerichte dip, naar voren = borst-gerichte dip. Gewogen dips met een progressieve overload zijn een van de beste manieren om de triceps te overbelasten.",
      en: "Torso angle determines muscle distribution: upright = triceps-focused dip, leaning forward = chest-focused dip. Weighted dips with progressive overload are one of the best ways to overload the triceps.",
    },
    steps: [
      { nl: "Pak de dip-stangen en begin in de toppositie met gestrekte armen.", en: "Grip the dip bars and start at the top position with arms extended." },
      { nl: "Houd de torso rechtop (minimale voorwaartse lean voor tricepsfocus).", en: "Keep torso upright (minimal forward lean for triceps focus)." },
      { nl: "Laat jezelf langzaam zakken totdat de ellebogen 90° gebogen zijn.", en: "Lower yourself slowly until elbows are bent to 90°." },
      { nl: "Druk explosief terug naar de beginpositie.", en: "Press explosively back to the starting position." },
    ],
    tips: [
      { nl: "Houd de ellebogen dicht bij het lichaam — niet naar buiten flappen.", en: "Keep elbows close to the body — don't flare them out." },
      { nl: "Ga niet te diep als je schouderklachten hebt.", en: "Don't go too deep if you have shoulder issues." },
    ],
    commonMistakes: [
      { nl: "Te ver naar voren leunen — dit wordt een borst-oefening.", en: "Leaning too far forward — this becomes a chest exercise." },
      { nl: "Ellebogen naar buiten flappen — verhoogt schouderbelasting.", en: "Flaring elbows outward — increases shoulder strain." },
    ],
    variants: [
      { name: "Weighted Dips", difference: { nl: "Extra gewicht via een dipping belt voor progressieve overload", en: "Added weight via dipping belt for progressive overload" } },
      { name: "Bench Dips", difference: { nl: "Makkelijkere variant voor beginners op een bankje", en: "Easier beginner variant on a bench" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4", reps: "4–8", rest: "3 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–15", rest: "90 sec" },
    ],
    youtubeId: "2z8JmcrW-As",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── LEGS ─────────────────────────────────────────────────────────────────

  {
    id: "barbell-back-squat",
    name: "Barbell Back Squat",
    category: "Legs",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "Barbell",
    difficulty: "Advanced",
    description: {
      nl: "De squat wordt vaak de 'koning van alle oefeningen' genoemd. Hij traint de gehele onderbeenmusculatuur — primair de quadriceps en bilspieren — tegelijk met een sterke core-activatie. Het is de meest effectieve compound oefening voor beenspieren en totale lichaamskracht.",
      en: "The squat is often called the 'king of all exercises'. It trains the entire lower body musculature — primarily the quadriceps and glutes — while also strongly activating the core. It is the most effective compound exercise for leg muscles and total body strength.",
    },
    scienceNote: {
      nl: "EMG-onderzoek toont dat de squat de hoogste gecombineerde activatie geeft van quadriceps, gluteus maximus en hamstrings. Een diepe squat (onder parallel) produceert significant meer glute-activatie dan een halve squat.",
      en: "EMG research shows the squat produces the highest combined activation of the quadriceps, gluteus maximus and hamstrings. A deep squat (below parallel) produces significantly more glute activation than a half squat.",
    },
    steps: [
      { nl: "Zet de stang op schouderhoogte in het rack. Stap onder de stang en leg hem op de bovenkant van de trapezius.", en: "Set the bar at shoulder height in the rack. Step under and place it on your upper trapezius." },
      { nl: "Voeten iets breder dan schouderbreedte, tenen 15–30° naar buiten.", en: "Feet slightly wider than shoulder-width, toes 15–30° outward." },
      { nl: "Adem in, span de core aan, ontgrendel de stang en stap terug.", en: "Inhale, brace core, unrack and step back." },
      { nl: "Zak omlaag door gelijktijdig de heupen terug en knieën uitwaarts te bewegen.", en: "Descend by simultaneously pushing hips back and knees outward." },
      { nl: "Zak tot minimaal parallel (bovenbeen parallel aan de grond) of dieper.", en: "Descend to at least parallel (thigh parallel to floor) or deeper." },
      { nl: "Druk vanuit de hielen omhoog naar de startpositie.", en: "Drive through the heels back to the starting position." },
    ],
    tips: [
      { nl: "Houd de borst omhoog en de ruggengraat neutraal tijdens de volledige beweging.", en: "Keep chest up and spine neutral throughout the entire movement." },
      { nl: "Duw de knieën actief naar buiten in de richting van de kleine teen.", en: "Actively push knees outward in the direction of your little toe." },
    ],
    commonMistakes: [
      { nl: "Knieën naar binnen zakken (knee cave) — dit belast de ligamenten van de knie.", en: "Knees caving inward — this strains the knee ligaments." },
      { nl: "Halverwege stoppen (quartter squats) — dit vermindert glute-activatie sterk.", en: "Stopping halfway (quarter squats) — this greatly reduces glute activation." },
      { nl: "Hielen optillen — duidt op onvoldoende enkel-mobiliteit.", en: "Heels rising off the floor — indicates insufficient ankle mobility." },
    ],
    variants: [
      { name: "Front Squat", difference: { nl: "Meer quadricepsfocus, rechter torso, meer enkelmobiliteit vereist", en: "More quad focus, more upright torso, more ankle mobility required" } },
      { name: "Goblet Squat", difference: { nl: "Beginnersvriendelijk, uitstekend voor techniek leren", en: "Beginner-friendly, excellent for learning technique" } },
      { name: "Bulgarian Split Squat", difference: { nl: "Unilateraal, sterk billen- en quads-effect", en: "Unilateral, strong glutes and quads effect" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "1–5", rest: "4–5 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "6–12", rest: "2–3 min" },
    ],
    youtubeId: "sdeQjm7avi8",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "Legs",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De Romanian Deadlift (RDL) is de beste oefening voor het trainen van de hamstrings in gestrekte positie. Door de heupscharnierbeweging met minimale kniebuiging worden de hamstrings maximaal gerekt en gecontraheerd.",
      en: "The Romanian Deadlift (RDL) is the best exercise for training the hamstrings in a stretched position. The hip hinge movement with minimal knee bend maximally stretches and contracts the hamstrings.",
    },
    scienceNote: {
      nl: "Recent onderzoek (Maeo et al., 2021) toont dat hamstring-hypertrofie significant groter is bij oefeningen die de spier trainen in de gestrekte positie. De RDL is daarin superieur aan de leg curl voor hamstring-massa.",
      en: "Recent research (Maeo et al., 2021) shows hamstring hypertrophy is significantly greater in exercises that train the muscle in the stretched position. The RDL is superior to the leg curl for hamstring mass.",
    },
    steps: [
      { nl: "Sta rechtop met de stang in je handen, armen gestrekt.", en: "Stand upright with the bar in your hands, arms extended." },
      { nl: "Houd een lichte buiging in de knieën — dit blijft constant door de hele beweging.", en: "Maintain a slight knee bend — this remains constant throughout the movement." },
      { nl: "Kantel de torso naar voren door de heupen terug te duwen. Houd de rug recht.", en: "Hinge forward by pushing hips back. Keep back straight." },
      { nl: "Laat de stang langs de benen zakken tot je de rek in de hamstrings voelt (ca. halverwege het scheenbeen).", en: "Lower the bar along the legs until you feel the hamstring stretch (about mid-shin)." },
      { nl: "Druk de heupen naar voren terug naar de startpositie.", en: "Drive hips forward back to the starting position." },
    ],
    tips: [
      { nl: "Houd de stang dicht langs de benen — dit vermindert de belasting op de rug.", en: "Keep the bar close to your legs — this reduces the load on the back." },
      { nl: "Stop de beweging wanneer je de rek voelt in de hamstrings — niet per se de grond raken.", en: "Stop the movement when you feel the hamstring stretch — not necessarily touching the floor." },
    ],
    commonMistakes: [
      { nl: "De rug afronden in de lumbale regio — risico op rugblessures.", en: "Rounding the lower back — risk of back injury." },
      { nl: "De knieën te sterk buigen — dit maakt het een conventional deadlift.", en: "Bending the knees too much — this turns it into a conventional deadlift." },
    ],
    variants: [
      { name: "Single-Leg RDL", difference: { nl: "Unilateraal, meer balans en stabiliteit vereist", en: "Unilateral, requires more balance and stability" } },
      { name: "Dumbbell RDL", difference: { nl: "Makkelijker te leren, grotere ROM mogelijk", en: "Easier to learn, greater ROM possible" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12", rest: "2 min" },
    ],
    youtubeId: "Q5vwsJFwhyg",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "barbell-hip-thrust",
    name: "Barbell Hip Thrust",
    category: "Legs",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De hip thrust is de meest effectieve isolatie-oefening voor de gluteus maximus. Geen enkele andere oefening produceert zo'n hoge directe bilspieractivatie. Hij is essentieel voor iedereen die sterke, goed ontwikkelde bilspieren wil.",
      en: "The hip thrust is the most effective isolation exercise for the gluteus maximus. No other exercise produces such high direct glute activation. It is essential for anyone wanting strong, well-developed glutes.",
    },
    scienceNote: {
      nl: "Onderzoek van Contreras et al. toont dat de hip thrust 3× meer gluteus maximus EMG-activatie produceert dan de squat. De horizontale heupextensie activeert de gluteus maximus in zijn sterkste functie: de heup strekken vanuit buiging.",
      en: "Research by Contreras et al. shows the hip thrust produces 3× more gluteus maximus EMG activation than the squat. The horizontal hip extension activates the gluteus maximus in its strongest function: extending the hip from flexion.",
    },
    steps: [
      { nl: "Zet een bankje achter je en rol een stang met bumper plates over je heupen.", en: "Set a bench behind you and roll a barbell with bumper plates over your hips." },
      { nl: "Leun met je schouderbladen op de rand van de bank.", en: "Rest your shoulder blades on the edge of the bench." },
      { nl: "Voeten plat op de grond, knieën 90° gebogen bovenaan de beweging.", en: "Feet flat on floor, knees at 90° at the top of the movement." },
      { nl: "Druk de heupen omhoog totdat het lichaam van knieën tot schouders een rechte lijn vormt.", en: "Drive hips upward until body forms a straight line from knees to shoulders." },
      { nl: "Knijp de bilspieren samen bovenaan. Laat gecontroleerd terug.", en: "Squeeze glutes at the top. Lower with control." },
    ],
    tips: [
      { nl: "Gebruik een barbell pad of handdoek voor comfort op de heupen.", en: "Use a barbell pad or towel for hip comfort." },
      { nl: "Houd de kin naar de borst voor een neutrale ruggengraat bovenaan.", en: "Tuck chin to chest for a neutral spine at the top." },
    ],
    commonMistakes: [
      { nl: "Heupen te hoog duwen waardoor de rug hyperextendeert.", en: "Pushing hips too high causing back hyperextension." },
      { nl: "Voeten te ver of te dicht bij het lichaam plaatsen — kniehoek 90° bovenaan is optimaal.", en: "Feet too far or too close — knee angle of 90° at the top is optimal." },
    ],
    variants: [
      { name: "Single-Leg Hip Thrust", difference: { nl: "Unilateraal, sterkere bilspier-activatie per zijde", en: "Unilateral, stronger per-side glute activation" } },
      { name: "Dumbbell Hip Thrust", difference: { nl: "Makkelijker om mee te beginnen, geen rack nodig", en: "Easier to start with, no rack needed" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4", reps: "5–8", rest: "3 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "90 sec" },
    ],
    youtubeId: "xDmFkJxPzeM",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "leg-press",
    name: "Leg Press",
    category: "Legs",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    difficulty: "Beginner",
    description: {
      nl: "De leg press is een uitstekende compound oefening voor de quadriceps die de rug volledig ontlast. Hij is ideaal als aanvulling op de squat of als alternatief voor mensen met rugklachten. De voetplaatsing bepaalt welke spieren primair worden aangesproken.",
      en: "The leg press is an excellent compound exercise for the quadriceps that fully unloads the back. It's ideal as a squat supplement or alternative for those with back issues. Foot placement determines which muscles are primarily targeted.",
    },
    scienceNote: {
      nl: "Lage voetplaatsing activeert meer de quadriceps. Hoge voetplaatsing activeert meer de glutes en hamstrings. Volledige ROM (knieën naar de borst) geeft significant meer spierspanning dan partiele reps.",
      en: "Low foot placement activates more quadriceps. High foot placement activates more glutes and hamstrings. Full ROM (knees to chest) produces significantly more muscle tension than partial reps.",
    },
    steps: [
      { nl: "Ga in de machine zitten met voeten op heupbreedte, midden op het platform.", en: "Sit in the machine with feet hip-width, in the middle of the platform." },
      { nl: "Ontgrendel de veiligheidshendels.", en: "Unlock the safety handles." },
      { nl: "Laat het platform gecontroleerd zakken totdat je knieën 90° gebogen zijn of verder.", en: "Lower the platform with control until knees are at 90° or further." },
      { nl: "Druk het platform terug zonder de knieën volledig te vergrendelen.", en: "Press the platform back without fully locking the knees." },
    ],
    tips: [
      { nl: "Vergrendel de knieën nooit volledig bovenaan — dit belast de gewrichten.", en: "Never fully lock out the knees at the top — this strains the joints." },
      { nl: "Houd de rug plat tegen de rugleuning gedurende de hele beweging.", en: "Keep back flat against the seat throughout the movement." },
    ],
    commonMistakes: [
      { nl: "Halve reps uitvoeren — volle ROM is essentieel voor maximale spieractivatie.", en: "Partial reps — full ROM is essential for maximum muscle activation." },
      { nl: "Billen optillen van de stoel aan het einde van de beweging.", en: "Lifting the glutes off the seat at the bottom of the movement." },
    ],
    variants: [
      { name: "Single-Leg Leg Press", difference: { nl: "Unilateraal, ook voor het corrigeren van onevenwichtigheden", en: "Unilateral, also for correcting imbalances" } },
      { name: "High Foot Leg Press", difference: { nl: "Meer nadruk op de bilspieren en hamstrings", en: "More emphasis on glutes and hamstrings" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "90 sec" },
    ],
    youtubeId: "IZxyjW7MPJQ",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "lying-leg-curl",
    name: "Lying Leg Curl",
    category: "Legs",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    equipment: "Machine",
    difficulty: "Beginner",
    description: {
      nl: "De lying leg curl is de directe isolatie-oefening voor de hamstrings via knieflexie. In combinatie met de RDL (die de hamstrings traint via heupextensie) vormt dit een complete hamstringtraining.",
      en: "The lying leg curl is the direct isolation exercise for the hamstrings via knee flexion. Combined with the RDL (which trains hamstrings via hip extension), this forms a complete hamstring training approach.",
    },
    scienceNote: {
      nl: "De hamstrings worden zowel via de heup als de knie bewogen. Alleen de leg curl traint de knieflexie-functie van de hamstrings. Beide bewegingspatronen zijn nodig voor volledige hamstring-ontwikkeling.",
      en: "The hamstrings work at both the hip and the knee. Only the leg curl trains the knee flexion function of the hamstrings. Both movement patterns are needed for complete hamstring development.",
    },
    steps: [
      { nl: "Ga op je buik liggen in de machine. Enkels onder de pad.", en: "Lie face down in the machine. Ankles under the pad." },
      { nl: "Curl de onderbenen omhoog richting de billen.", en: "Curl the lower legs upward toward the glutes." },
      { nl: "Knijp de hamstrings samen bovenaan.", en: "Squeeze hamstrings at the top." },
      { nl: "Laat gecontroleerd terug naar volledige strekking.", en: "Lower with control to full extension." },
    ],
    tips: [
      { nl: "Ga altijd naar volledige strekking — de rek is de helft van de hypertrofieprikkel.", en: "Always go to full extension — the stretch is half of the hypertrophy stimulus." },
      { nl: "Plantairflexie (tenen naar beneden) activeert meer de biceps femoris.", en: "Plantarflexion (toes pointing down) activates more of the biceps femoris." },
    ],
    commonMistakes: [
      { nl: "Heupen optillen van de bank om meer gewicht te kunnen bewegen.", en: "Lifting hips off the pad to move more weight." },
      { nl: "Te snel naar beneden laten — de excentrische fase is essentieel.", en: "Lowering too quickly — the eccentric phase is essential." },
    ],
    variants: [
      { name: "Seated Leg Curl", difference: { nl: "Heup in flexie — meer activatie van de korte kop van de biceps femoris", en: "Hip in flexion — more activation of the short head of biceps femoris" } },
      { name: "Nordic Hamstring Curl", difference: { nl: "Extreem hoge eccentrische belasting — krachtig maar veeleisend", en: "Extremely high eccentric loading — powerful but demanding" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60–90 sec" },
    ],
    youtubeId: "s7uDIWl7Ilo",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "machine-standing-calf-raise",
    name: "Machine Standing Calf Raise",
    category: "Legs",
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    equipment: "Machine",
    difficulty: "Beginner",
    description: {
      nl: "De standing calf raise is de meest effectieve oefening voor de gastrocnemius — de grote, tweekoppen kuitspier die het meeste bijdraagt aan de zichtbare kuitontwikkeling. Staand uitvoeren activeert de gastrocnemius maximaal omdat de knie gestrekt is.",
      en: "The standing calf raise is the most effective exercise for the gastrocnemius — the large, two-headed calf muscle that contributes most to visible calf development. Standing execution maximally activates the gastrocnemius because the knee is extended.",
    },
    scienceNote: {
      nl: "De kuit bestaat uit twee lagen: de gastrocnemius (bovenste, tweekoppen, gestrekte knie) en de soleus (onderste, knie gebogen). Staande calf raises trainen primair de gastrocnemius. Volle ROM — maximale rek aan de onderkant — is essentieel voor hypertrofie.",
      en: "The calf has two layers: the gastrocnemius (upper, two-headed, knee extended) and the soleus (lower, knee bent). Standing calf raises primarily train the gastrocnemius. Full ROM — maximum stretch at the bottom — is essential for hypertrophy.",
    },
    steps: [
      { nl: "Stap op de machine met de ballen van de voeten op het platform.", en: "Step onto the machine with the balls of your feet on the platform." },
      { nl: "Laat de hielen zo ver mogelijk zakken voor maximale rek.", en: "Lower heels as far as possible for maximum stretch." },
      { nl: "Druk de hielen omhoog tot maximale plantairflexie.", en: "Push heels up to maximum plantarflexion." },
      { nl: "Pauzeer 1 seconde bovenaan. Laat gecontroleerd terug.", en: "Pause 1 second at the top. Lower with control." },
    ],
    tips: [
      { nl: "Volle ROM is cruciaal — halve reps zijn zeer ineffectief voor kuiten.", en: "Full ROM is crucial — partial reps are very ineffective for calves." },
      { nl: "Pauzeer 1–2 seconden aan de onderkant in de rek voor extra stimulus.", en: "Pause 1–2 seconds at the bottom stretch for extra stimulus." },
    ],
    commonMistakes: [
      { nl: "Verenbeweging uitvoeren (stuiteren) — dit vermindert de spieractivatie enorm.", en: "Bouncing — this greatly reduces muscle activation." },
      { nl: "Halve ROM — kuiten zijn gewend aan volle ROM in het dagelijks leven.", en: "Half ROM — calves are accustomed to full ROM in daily life." },
    ],
    variants: [
      { name: "Seated Calf Raise", difference: { nl: "Knie gebogen → primair de soleus (diepere kuitspier) actief", en: "Knee bent → primarily targets the soleus (deeper calf muscle)" } },
      { name: "Single-Leg Calf Raise", difference: { nl: "Meer overload per been, goed voor laag volume", en: "More load per leg, good for low volume" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "4–5", reps: "10–20", rest: "60–90 sec" },
    ],
    youtubeId: "gwLzBJYoWlI",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── CHEST (aanvulling) ───────────────────────────────────────────────────

  {
    id: "chest-dip",
    name: "Chest Dip",
    category: "Chest",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Dip bars",
    difficulty: "Intermediate",
    description: {
      nl: "De chest dip is een krachtige compound oefening die de onderste borst, triceps en voorste deltaspier tegelijk traint. Door voorover te leunen verschuift de focus van de triceps naar de borstspieren.",
      en: "The chest dip is a powerful compound exercise training the lower chest, triceps and anterior deltoid simultaneously. Leaning forward shifts the focus from triceps to the chest muscles.",
    },
    scienceNote: {
      nl: "Een voorwaartse torso-hoek van 30–45° maximaliseert de pectorale activatie bij dips. EMG-studies tonen dat chest dips de onderste pectoralis major sterker activeren dan de flat bench press.",
      en: "A forward torso angle of 30–45° maximises pectoral activation during dips. EMG studies show chest dips activate the lower pectoralis major more strongly than the flat bench press.",
    },
    steps: [
      { nl: "Pak de dip-stangen en begin in de toppositie met gestrekte armen.", en: "Grip the dip bars and start at the top with arms extended." },
      { nl: "Leun de torso bewust 30–45° naar voren.", en: "Deliberately lean your torso 30–45° forward." },
      { nl: "Laat jezelf zakken tot de ellebogen 90° zijn, of iets dieper.", en: "Lower yourself until elbows reach 90°, or slightly deeper." },
      { nl: "Druk explosief omhoog terwijl je de borst samenknijpt.", en: "Press explosively upward while squeezing the chest." },
    ],
    tips: [
      { nl: "Hoe verder je naar voren leunt, hoe meer borst — hoe rechter je staat, hoe meer triceps.", en: "The further forward you lean, the more chest — the more upright, the more triceps." },
      { nl: "Ga niet dieper dan 90° als je schouderklachten hebt.", en: "Don't go deeper than 90° if you have shoulder issues." },
    ],
    commonMistakes: [
      { nl: "Rechtop blijven staan — dit maakt het een tricep dip.", en: "Staying upright — this turns it into a tricep dip." },
      { nl: "Te snel zakken zonder controle.", en: "Descending too quickly without control." },
    ],
    variants: [
      { name: "Tricep Dips", difference: { nl: "Torso rechtop → tricepsfocus", en: "Upright torso → triceps focus" } },
      { name: "Weighted Dips", difference: { nl: "Extra gewicht voor progressieve overload", en: "Added weight for progressive overload" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–15", rest: "2 min" },
    ],
    youtubeId: "Orxowest56U",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "flat-dumbbell-fly",
    name: "Flat Dumbbell Fly",
    category: "Chest",
    primaryMuscles: ["chest"],
    secondaryMuscles: [],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    description: {
      nl: "De dumbbell fly is een isolatie-oefening die de borstspieren traint via een uitvluchtige beweging (abductie van de arm). Het grote voordeel is de maximale rek op de pectoralis aan de onderkant van de beweging.",
      en: "The dumbbell fly is an isolation exercise training the chest through an arcing movement (arm abduction). The main advantage is the maximum stretch on the pectoralis at the bottom of the movement.",
    },
    scienceNote: {
      nl: "De dumbbell fly plaatst de pectoralis major in maximale rek terwijl er nog mechanische spanning aanwezig is. Dit 'stretch-overload' principe is een krachtige groeiprikkel. Kabels zijn superieur vanwege constante spanning, maar dumbbells geven meer rek.",
      en: "The dumbbell fly places the pectoralis major under maximum stretch while mechanical tension is still present. This 'stretch-overload' principle is a powerful growth stimulus. Cables are superior for constant tension, but dumbbells provide more stretch.",
    },
    steps: [
      { nl: "Ga op een vlakke bank liggen met een dumbbell in elke hand, armen gestrekt boven de borst.", en: "Lie on a flat bench with a dumbbell in each hand, arms extended above the chest." },
      { nl: "Laat de armen zijwaarts zakken met een lichte buiging in de ellebogen.", en: "Lower arms out to the sides with a slight elbow bend." },
      { nl: "Ga zo diep als comfortabel is — voel de rek in de borst.", en: "Go as deep as comfortable — feel the stretch in the chest." },
      { nl: "Breng de dumbbells terug boven de borst via dezelfde boogbeweging.", en: "Return the dumbbells above the chest via the same arc movement." },
    ],
    tips: [
      { nl: "Gebruik nooit zwaar gewicht — dit is een isolatie-oefening voor het gevoel.", en: "Never use heavy weight — this is an isolation exercise done by feel." },
      { nl: "Houd de ellebooghoek constant door de hele beweging.", en: "Maintain a constant elbow angle throughout the movement." },
    ],
    commonMistakes: [
      { nl: "De armen volledig strekken — dit belast de ellebooggewrichten.", en: "Fully extending the arms — this stresses the elbow joints." },
      { nl: "Te zwaar waardoor de beweging een press wordt.", en: "Too heavy causing the movement to become a press." },
    ],
    variants: [
      { name: "Incline Dumbbell Fly", difference: { nl: "Bank schuin voor meer bovenborst-activatie", en: "Inclined bench for more upper chest activation" } },
      { name: "Cable Crossover", difference: { nl: "Constante spanning door de volledige ROM", en: "Constant tension through full ROM" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "12–15", rest: "60–90 sec" },
    ],
    youtubeId: "eozdVDA78K0",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── BACK (aanvulling) ────────────────────────────────────────────────────

  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "Cable machine",
    difficulty: "Beginner",
    description: {
      nl: "De seated cable row is een van de beste oefeningen voor de middelste rug — de rhomboids, midden-trapezius en lats. De kabel biedt constante spanning door de volledige beweging, inclusief in de gestrekte positie.",
      en: "The seated cable row is one of the best exercises for the mid-back — the rhomboids, mid-trapezius and lats. The cable provides constant tension throughout the full movement, including in the stretched position.",
    },
    scienceNote: {
      nl: "Horizontale trekbewegingen activeren de midden-rug significant beter dan verticale trek. De gestrekte positie bij kabelrijen biedt een mechanische spanning die bij barbell rijen deels verloren gaat doordat de stang de grond raakt.",
      en: "Horizontal pulling movements significantly better activate the mid-back than vertical pulls. The stretched position in cable rows provides mechanical tension that is partially lost in barbell rows when the bar contacts the floor.",
    },
    steps: [
      { nl: "Zit aan de kabelrij-machine, voeten op de steun, knieën licht gebogen.", en: "Sit at the cable row machine, feet on the footrest, knees slightly bent." },
      { nl: "Pak de handgreep met beide handen, armen volledig gestrekt — voel de rek in de lats.", en: "Grip the handle with both hands, arms fully extended — feel the stretch in the lats." },
      { nl: "Trek de handgreep naar je navel terwijl je de schouderbladen samen trekt.", en: "Pull the handle toward your navel while squeezing your shoulder blades together." },
      { nl: "Houd de torso rechtop — geen overdreven achterwaartse beweging.", en: "Keep torso upright — no excessive backward lean." },
      { nl: "Laat gecontroleerd terug naar de gestrekte positie.", en: "Return with control to the stretched position." },
    ],
    tips: [
      { nl: "Trek met je ellebogen, niet met je handen.", en: "Pull with your elbows, not your hands." },
      { nl: "Laat de torso licht mee naar voren in de rek — dit vergroot de ROM.", en: "Allow a slight forward torso lean in the stretch — this increases ROM." },
    ],
    commonMistakes: [
      { nl: "Te ver naar achteren leunen bij het trekken — dit wordt een rugextensie.", en: "Leaning too far back when pulling — this becomes a back extension." },
      { nl: "De armen niet volledig strekken aan het begin — korte ROM vermindert lat-activatie.", en: "Not fully extending arms at the start — short ROM reduces lat activation." },
    ],
    variants: [
      { name: "Single-Arm Cable Row", difference: { nl: "Unilateraal, grotere ROM mogelijk", en: "Unilateral, greater ROM possible" } },
      { name: "Wide-Grip Cable Row", difference: { nl: "Bredere grip activeert meer de buitenste lats", en: "Wider grip activates more of the outer lats" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "90 sec" },
    ],
    youtubeId: "GZbfZ033f74",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "single-arm-dumbbell-row",
    name: "Single-Arm Dumbbell Row",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: {
      nl: "De unilaterale dumbbell row is uitstekend voor het trainen van de lats met een grote ROM. Door de vrije beweging van de dumbbell kan je meer rotatie en trek toepassen dan met een barbell, wat leidt tot sterkere spieractivatie.",
      en: "The unilateral dumbbell row is excellent for training the lats with a large ROM. The free movement of the dumbbell allows more rotation and pull than a barbell, leading to stronger muscle activation.",
    },
    scienceNote: {
      nl: "Unilaterale training elimineert compensatie tussen zijden en laat toe dat elke lat onafhankelijk maximaal wordt geactiveerd. Onderzoek toont hogere lats-activatie bij dumbbell rows versus barbell rows door de grotere scapulaire vrijheid.",
      en: "Unilateral training eliminates side-to-side compensation and allows each lat to be maximally activated independently. Research shows higher lat activation in dumbbell rows versus barbell rows due to greater scapular freedom.",
    },
    steps: [
      { nl: "Zet één knie en één hand op een bank. Andere voet plat op de grond.", en: "Place one knee and one hand on a bench. Other foot flat on the floor." },
      { nl: "Pak de dumbbell met de vrije hand, arm volledig gestrekt.", en: "Grab the dumbbell with the free hand, arm fully extended." },
      { nl: "Trek de dumbbell omhoog richting je heup, elleboog strak langs het lichaam.", en: "Pull the dumbbell up toward your hip, elbow close to the body." },
      { nl: "Knijp de lat samen bovenaan.", en: "Squeeze the lat at the top." },
      { nl: "Laat gecontroleerd terug naar volledig gestrekte arm.", en: "Lower with control to full arm extension." },
    ],
    tips: [
      { nl: "Trek naar je heup, niet naar je schouder — dit activeert meer de lats.", en: "Pull toward your hip, not your shoulder — this activates the lats more." },
      { nl: "Laat de schouder volledig zakken onderaan voor maximale rek.", en: "Let the shoulder fully drop at the bottom for maximum stretch." },
    ],
    commonMistakes: [
      { nl: "De elleboog te hoog optrekken (naar het plafond) — dit isoleert meer de trapezius.", en: "Pulling the elbow too high (toward the ceiling) — this isolates the trapezius more." },
      { nl: "Met de torso roteren om extra gewicht te bewegen.", en: "Rotating the torso to move extra weight." },
    ],
    variants: [
      { name: "Kroc Row", difference: { nl: "Zware lading, lichte torsorotatie bewust toegestaan voor maximale overload", en: "Heavy load, slight torso rotation intentionally allowed for maximum overload" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "90 sec" },
    ],
    youtubeId: "6zfRSo1bDaA",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── SHOULDERS (aanvulling) ───────────────────────────────────────────────

  {
    id: "arnold-press",
    name: "Arnold Press",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    description: {
      nl: "De Arnold Press is een roterende overhead press die alle drie de deltakoppen in één beweging activeert. De rotatie van supinated naar pronated grip tijdens de press trekt de voorste én middelste deltakop aan.",
      en: "The Arnold Press is a rotating overhead press that activates all three deltoid heads in one movement. The rotation from supinated to pronated grip during the press engages both the anterior and medial deltoid.",
    },
    scienceNote: {
      nl: "Door de rotatie van de onderarm gedurende de press activeert de Arnold Press de voorste deltakop over een grotere ROM dan een standaard dumbbell press. EMG-studies bevestigen hogere totale deltoidactivatie vergeleken met de reguliere shoulder press.",
      en: "The forearm rotation during the press activates the anterior deltoid over a greater ROM than a standard dumbbell press. EMG studies confirm higher total deltoid activation compared to the regular shoulder press.",
    },
    steps: [
      { nl: "Zit op een bank met dumbbells op schouderhoogte, palmen naar je toe (supinated).", en: "Sit on a bench with dumbbells at shoulder height, palms facing you (supinated)." },
      { nl: "Begin te persen en draai de dumbbells tegelijk naar buiten (pronation).", en: "Begin pressing and simultaneously rotate the dumbbells outward (pronation)." },
      { nl: "Eindig bovenaan met palmen naar voren, armen gestrekt.", en: "Finish at the top with palms facing forward, arms extended." },
      { nl: "Laat terug zakken met de omgekeerde rotatie.", en: "Lower with the reverse rotation." },
    ],
    tips: [
      { nl: "Voer de rotatie vloeiend uit — niet schokkerig.", en: "Perform the rotation smoothly — not jerkily." },
      { nl: "Gebruik iets minder gewicht dan bij een standaard dumbbell press.", en: "Use slightly less weight than a standard dumbbell press." },
    ],
    commonMistakes: [
      { nl: "De rotatie overslaan en het gewoon als een normale press uitvoeren.", en: "Skipping the rotation and performing it as a normal press." },
      { nl: "Te zwaar waardoor de rotatie niet meer vloeiend gaat.", en: "Too heavy causing the rotation to become uncontrolled." },
    ],
    variants: [
      { name: "Dumbbell Shoulder Press", difference: { nl: "Geen rotatie — meer gewicht, minder ROM per deltakop", en: "No rotation — more weight, less ROM per deltoid head" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "90 sec" },
    ],
    youtubeId: "6Z15_WdXmVw",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "rear-delt-fly",
    name: "Rear Delt Fly",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["back"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    description: {
      nl: "De rear delt fly traint specifiek de achterste deltakop via horizontale abductie. Dit is een van de meest verwaarloosde oefeningen in de sportschool, terwijl de achterste delt essentieel is voor een gebalanceerd schouderuiterlijk en blessurepreventie.",
      en: "The rear delt fly specifically trains the posterior deltoid via horizontal abduction. This is one of the most neglected exercises in the gym, while the rear delt is essential for balanced shoulder appearance and injury prevention.",
    },
    scienceNote: {
      nl: "De achterste deltakop wordt nauwelijks actief bij pressing- of trekbewegingen in de sagittale vlak. Horizontale abductie met een naar achteren gerichte elleboog (elleboog lager dan de schouder) isoleert de achterste delt optimaal.",
      en: "The posterior deltoid is barely active during pressing or pulling in the sagittal plane. Horizontal abduction with a backward-directed elbow (elbow lower than shoulder) optimally isolates the rear delt.",
    },
    steps: [
      { nl: "Leun voorover tot de torso bijna parallel aan de grond is.", en: "Lean forward until the torso is nearly parallel to the floor." },
      { nl: "Houd een dumbbell in elke hand met een lichte elleboogbuiging.", en: "Hold a dumbbell in each hand with a slight elbow bend." },
      { nl: "Hef de armen zijwaarts omhoog tot schouderhoogte, ellebogen leidend.", en: "Raise arms out to the sides to shoulder height, elbows leading." },
      { nl: "Knijp de achterste delt samen bovenaan. Laat gecontroleerd terug.", en: "Squeeze the rear delt at the top. Lower with control." },
    ],
    tips: [
      { nl: "Houd de ellebogen licht gebogen en leid met de ellebogen — niet de handen.", en: "Keep elbows slightly bent and lead with the elbows — not the hands." },
      { nl: "Licht gewicht is voldoende — de rear delt is een kleine spier.", en: "Light weight is sufficient — the rear delt is a small muscle." },
    ],
    commonMistakes: [
      { nl: "Te rechtop staan — de trapezius neemt dan het werk over.", en: "Standing too upright — the trapezius takes over the work." },
      { nl: "Armen boven schouderhoogte heffen.", en: "Raising arms above shoulder height." },
    ],
    variants: [
      { name: "Cable Rear Delt Fly", difference: { nl: "Constante spanning ook in de gestrekte positie", en: "Constant tension even in the stretched position" } },
      { name: "Machine Rear Delt Fly", difference: { nl: "Stabieler, makkelijker te isoleren", en: "More stable, easier to isolate" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "15–25", rest: "60 sec" },
    ],
    youtubeId: "EA7u4Q_8HQ0",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── BICEPS (aanvulling) ──────────────────────────────────────────────────

  {
    id: "hammer-curl",
    name: "Hammer Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    description: {
      nl: "De hammer curl traint de brachialis en brachioradialis — twee spieren die onder de biceps liggen en de bovenarm dikker en voller maken. De neutrale (hammer) grip vermindert de bicepsactivatie maar maximaliseert de brachialis-activatie.",
      en: "The hammer curl trains the brachialis and brachioradialis — two muscles that lie beneath the biceps and make the upper arm thicker and fuller. The neutral (hammer) grip reduces biceps activation but maximises brachialis activation.",
    },
    scienceNote: {
      nl: "De brachialis ligt onder de biceps en wordt gedwongen harder te werken bij een neutrale gripstand. Door de brachialis te vergroten wordt de biceps optisch omhoog geduwd, wat een grotere armomvang geeft. Dit maakt de hammer curl een essentieel onderdeel van armtraining.",
      en: "The brachialis lies beneath the biceps and is forced to work harder in a neutral grip position. Enlarging the brachialis pushes the biceps upward optically, giving a larger arm circumference. This makes the hammer curl an essential part of arm training.",
    },
    steps: [
      { nl: "Sta rechtop met dumbbells in neutrale grip (duimen naar voren).", en: "Stand upright with dumbbells in a neutral grip (thumbs forward)." },
      { nl: "Houd de ellebogen gefixeerd langs het lichaam.", en: "Keep elbows fixed at your sides." },
      { nl: "Curl de dumbbells omhoog zonder de pols te roteren.", en: "Curl the dumbbells upward without rotating the wrist." },
      { nl: "Laat gecontroleerd terug naar volledige armstrekking.", en: "Lower with control to full arm extension." },
    ],
    tips: [
      { nl: "Alterneer of doe beide zijden tegelijk — beide methoden werken.", en: "Alternate or do both sides simultaneously — both methods work." },
      { nl: "Volle armstrekking aan de onderkant is essentieel voor brachialis-rek.", en: "Full arm extension at the bottom is essential for brachialis stretch." },
    ],
    commonMistakes: [
      { nl: "De pols supineren bovenaan — dit maakt het een reguliere curl.", en: "Supinating the wrist at the top — this turns it into a regular curl." },
    ],
    variants: [
      { name: "Cross-Body Hammer Curl", difference: { nl: "Curl naar het tegenovergestelde schouder — meer brachioradialis activatie", en: "Curl toward the opposite shoulder — more brachioradialis activation" } },
      { name: "Cable Hammer Curl", difference: { nl: "Constante spanning door de volledige ROM", en: "Constant tension through full ROM" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60–90 sec" },
    ],
    youtubeId: "TwD-YGVP4Bk",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "preacher-curl",
    name: "Preacher Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "EZ-bar / Barbell",
    difficulty: "Beginner",
    description: {
      nl: "De preacher curl isoleert de biceps volledig door de bovenarm vast te leggen op de preacher bank. Dit elimineert elke mogelijkheid van valsspelen met de rug of schouders, waardoor de biceps gedwongen wordt het volledige werk te doen.",
      en: "The preacher curl completely isolates the biceps by fixing the upper arm on the preacher bench. This eliminates any possibility of cheating with the back or shoulders, forcing the biceps to do all the work.",
    },
    scienceNote: {
      nl: "De preacher curl plaatst de biceps in een voorwaarts gekanteld positie (schouder in flexie), wat de korte kop van de biceps sterker activeert. Dit maakt het de beste oefening voor de 'peak' van de biceps (de bult bovenaan).",
      en: "The preacher curl places the biceps in a forward-tilted position (shoulder in flexion), which more strongly activates the short head of the biceps. This makes it the best exercise for the biceps 'peak' (the bump at the top).",
    },
    steps: [
      { nl: "Zit aan de preacher bank met de bovenarmen plat op het kussen.", en: "Sit at the preacher bench with upper arms flat on the pad." },
      { nl: "Pak de EZ-bar of stang met een supinated greep.", en: "Grip the EZ-bar or barbell with a supinated grip." },
      { nl: "Curl de stang omhoog tot de biceps volledig gecontraheerd is.", en: "Curl the bar up until the biceps is fully contracted." },
      { nl: "Laat gecontroleerd terug — ga bijna naar volledige strekking maar nooit volledig (risico op scheuring).", en: "Lower with control — go close to full extension but never fully (risk of tear)." },
    ],
    tips: [
      { nl: "Ga nooit naar volledige armstrekking bij een heavy preacher curl — risico op bicepspeesscheur.", en: "Never go to full arm extension on heavy preacher curls — risk of biceps tendon tear." },
      { nl: "De EZ-bar is comfortabeler voor de polsen dan een rechte stang.", en: "The EZ-bar is more comfortable for the wrists than a straight bar." },
    ],
    commonMistakes: [
      { nl: "Gewicht laten vallen naar beneden — controleer altijd de excentrische fase.", en: "Letting the weight drop — always control the eccentric phase." },
    ],
    variants: [
      { name: "Dumbbell Preacher Curl", difference: { nl: "Unilateraal, grotere ROM mogelijk", en: "Unilateral, greater ROM possible" } },
      { name: "Machine Preacher Curl", difference: { nl: "Constante spanning, goed voor hoge reps", en: "Constant tension, good for high reps" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3", reps: "10–15", rest: "60–90 sec" },
    ],
    youtubeId: "fIWP-FRFNU0",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── TRICEPS (aanvulling) ─────────────────────────────────────────────────

  {
    id: "overhead-dumbbell-extension",
    name: "Overhead Dumbbell Extension",
    category: "Arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: {
      nl: "De overhead tricep extension is de beste oefening voor de lange kop van de triceps omdat de arm boven het hoofd wordt gehouden. Dit plaatst de lange kop — die de bulk van de tricepsmassa uitmaakt — in maximale rek.",
      en: "The overhead tricep extension is the best exercise for the long head of the triceps because the arm is held overhead. This places the long head — which makes up the bulk of triceps mass — in maximum stretch.",
    },
    scienceNote: {
      nl: "Onderzoek toont dat de lange kop van de triceps significant meer hypertrofie ervaart bij overhead extensies dan bij pushdowns. De overhead positie plaatst de lange kop in bi-articulaire stretch (aan zowel de schouder als elleboog), wat de maximale groeiprikkel geeft.",
      en: "Research shows the long head of the triceps experiences significantly more hypertrophy from overhead extensions than pushdowns. The overhead position places the long head under bi-articular stretch (at both the shoulder and elbow), providing the maximum growth stimulus.",
    },
    steps: [
      { nl: "Zit of sta rechtop met één dumbbell in beide handen boven het hoofd.", en: "Sit or stand upright holding one dumbbell with both hands overhead." },
      { nl: "Houd de bovenarmen verticaal naast het hoofd.", en: "Keep upper arms vertical beside your head." },
      { nl: "Laat de dumbbell zakken achter het hoofd door de ellebogen te buigen.", en: "Lower the dumbbell behind your head by bending the elbows." },
      { nl: "Strek de armen explosief terug omhoog.", en: "Extend arms explosively back up." },
    ],
    tips: [
      { nl: "Houd de ellebogen naar binnen — niet naar buiten flappen.", en: "Keep elbows pointing inward — don't let them flare out." },
      { nl: "Ga zo diep als comfortabel voor maximale rek op de lange kop.", en: "Go as deep as comfortable for maximum stretch on the long head." },
    ],
    commonMistakes: [
      { nl: "Bovenarmen naar voren laten zakken — dit reduceert de lange-kop stretch.", en: "Letting upper arms fall forward — this reduces the long-head stretch." },
      { nl: "Te zwaar waardoor de ellebogen naar buiten wijzen.", en: "Too heavy causing elbows to flare outward." },
    ],
    variants: [
      { name: "Cable Overhead Tricep Extension", difference: { nl: "Constante spanning, makkelijker te controleren", en: "Constant tension, easier to control" } },
      { name: "Skull Crusher", difference: { nl: "Liggend uitgevoerd — meer stabiliteit, iets minder rek", en: "Performed lying — more stability, slightly less stretch" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60–90 sec" },
    ],
    youtubeId: "YbX7Wd8jQ-Q",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "close-grip-bench-press",
    name: "Close-Grip Bench Press",
    category: "Arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "shoulders"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De close-grip bench press is de zwaarste compound oefening voor de triceps. Door de smalle grip verschuift de belasting van de borst naar de triceps. Het is uitstekend voor het opbouwen van kracht en massa in de hele triceps.",
      en: "The close-grip bench press is the heaviest compound exercise for the triceps. The narrow grip shifts the load from the chest to the triceps. It is excellent for building strength and mass throughout the entire triceps.",
    },
    scienceNote: {
      nl: "Een grip van schouderbreedte (niet te smal) activeert de triceps maximaal zonder overmatige polsbelasting. EMG-studies tonen dat de close-grip bench press de laterale en mediale tricepskop sterker activeert dan pushdowns bij hogere belasting.",
      en: "A shoulder-width grip (not too narrow) maximally activates the triceps without excessive wrist stress. EMG studies show the close-grip bench press activates the lateral and medial triceps heads more strongly than pushdowns at higher loads.",
    },
    steps: [
      { nl: "Ga op de bank liggen. Pak de stang op schouderbreedte (niet smaller).", en: "Lie on the bench. Grip the bar at shoulder width (not narrower)." },
      { nl: "Houd de ellebogen dicht bij het lichaam tijdens de beweging.", en: "Keep elbows close to the body throughout the movement." },
      { nl: "Laat de stang zakken naar de onderkant van de borst.", en: "Lower the bar to the lower chest." },
      { nl: "Druk explosief omhoog, focus op de tricepscontractie.", en: "Press explosively upward, focusing on the triceps contraction." },
    ],
    tips: [
      { nl: "Gebruik geen grip smaller dan schouderbreedte — dit verhoogt het polsletselrisico.", en: "Don't use a grip narrower than shoulder width — this increases wrist injury risk." },
      { nl: "Houd de ellebogen naar binnen — niet naar buiten.", en: "Keep elbows tucked in — not flared out." },
    ],
    commonMistakes: [
      { nl: "Grip te smal (handen bijna tegen elkaar) — onnodig polsbelastend.", en: "Grip too narrow (hands almost touching) — unnecessarily stressful on wrists." },
      { nl: "Ellebogen naar buiten laten gaan — dit wordt een reguliere bench press.", en: "Letting elbows flare out — this becomes a regular bench press." },
    ],
    variants: [
      { name: "JM Press", difference: { nl: "Hybride tussen bench press en skull crusher — extreme tricepsoverload", en: "Hybrid between bench press and skull crusher — extreme triceps overload" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4", reps: "4–8", rest: "3 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3", reps: "8–12", rest: "2 min" },
    ],
    youtubeId: "gYbZTHpPTBQ",
    youtubeCreator: "Jeff Nippard",
  },

  // ─── LEGS (aanvulling) ────────────────────────────────────────────────────

  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    category: "Legs",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "Dumbbells / Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De Bulgarian split squat is een van de meest effectieve unilaterale beenoefeningen. Door het achterste been op een bank te plaatsen wordt het voorste been gedwongen het volledige gewicht te dragen, wat zorgt voor extreme quadriceps- en bilspieractivatie.",
      en: "The Bulgarian split squat is one of the most effective unilateral leg exercises. By elevating the rear foot on a bench, the front leg is forced to carry the full load, producing extreme quadriceps and glute activation.",
    },
    scienceNote: {
      nl: "Onderzoek toont dat unilaterale oefeningen zoals de BSS een hogere glute-activatie produceren dan bilaterale squats. De gestrekte heuppositie van het achterste been stretch de heupflexoren, wat extra rekspanning op de quadriceps van het voorste been plaatst.",
      en: "Research shows unilateral exercises like the BSS produce higher glute activation than bilateral squats. The extended hip position of the rear leg stretches the hip flexors, placing additional stretch tension on the front leg quadriceps.",
    },
    steps: [
      { nl: "Sta met de rug naar een bankje. Leg de wreef van het achterste been op het bankje.", en: "Stand with your back to a bench. Place the top of your rear foot on the bench." },
      { nl: "Het voorste been staat ca. 60–70 cm voor het bankje.", en: "The front foot is about 60–70 cm in front of the bench." },
      { nl: "Laat het achterste been zakken totdat de knie bijna de grond raakt.", en: "Lower the rear knee until it nearly touches the floor." },
      { nl: "Het voorste knie mag licht over de voet uitkomen — dit is normaal.", en: "The front knee may slightly pass the toes — this is normal." },
      { nl: "Druk door de hiel van het voorste been terug omhoog.", en: "Drive through the heel of the front foot to return upward." },
    ],
    tips: [
      { nl: "Voet verder naar voren = meer bilspieren. Voet dichterbij = meer quadriceps.", en: "Foot further forward = more glutes. Foot closer = more quadriceps." },
      { nl: "Begin zonder gewicht totdat je de balans beheerst.", en: "Start without weight until you master the balance." },
    ],
    commonMistakes: [
      { nl: "Voorste knie naar binnen zakken — houd de knie uitgelijnd met de voet.", en: "Front knee caving inward — keep the knee aligned with the foot." },
      { nl: "Te rechtopstaande torso — een lichte voorwaartse lean activeert meer de glutes.", en: "Too upright torso — a slight forward lean activates more glutes." },
    ],
    variants: [
      { name: "Barbell Bulgarian Split Squat", difference: { nl: "Meer belasting mogelijk, meer stabiliteit vereist", en: "More load possible, more stability required" } },
      { name: "Heel-Elevated BSS", difference: { nl: "Hiel op plaat — meer ROM en quadricepsactivatie", en: "Heel on plate — more ROM and quad activation" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12 per been", rest: "2 min" },
    ],
    youtubeId: "2C-uNgKwPLE",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "front-squat",
    name: "Front Squat",
    category: "Legs",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "core"],
    equipment: "Barbell",
    difficulty: "Advanced",
    description: {
      nl: "De front squat plaatst de stang voor op de schouders, wat een rechter torso vereist en de nadruk sterker op de quadriceps legt dan de back squat. Het is de beste squat-variant voor maximale quadricepsactivatie.",
      en: "The front squat positions the bar in front on the shoulders, requiring a more upright torso and placing greater emphasis on the quadriceps than the back squat. It is the best squat variation for maximum quadriceps activation.",
    },
    scienceNote: {
      nl: "De meer verticale torso-positie bij de front squat vergroot de knieflexie en plaatst meer belasting op de quadriceps. Onderzoek toont ~20% hogere quadricepsactivatie versus de back squat. De rechte torso vermindert ook de lumbale belasting.",
      en: "The more vertical torso position in the front squat increases knee flexion and places more load on the quadriceps. Research shows ~20% higher quadriceps activation versus the back squat. The upright torso also reduces lumbar loading.",
    },
    steps: [
      { nl: "Zet de stang in het rack. Maak een 'rek-greep': stang op vingertoppen, ellebogen hoog naar voren.", en: "Set bar in rack. Create a 'rack position': bar on fingertips, elbows high and forward." },
      { nl: "Voeten iets smaller dan bij back squat, tenen 15–20° naar buiten.", en: "Feet slightly narrower than back squat, toes 15–20° outward." },
      { nl: "Zak omlaag met rechte torso, ellebogen hoog houden.", en: "Descend with upright torso, keeping elbows high." },
      { nl: "Zak tot minimaal parallel of dieper.", en: "Descend to at least parallel or deeper." },
      { nl: "Druk explosief omhoog, torso rechtop houden.", en: "Drive explosively upward, maintaining upright torso." },
    ],
    tips: [
      { nl: "Enkelmobiliteit is cruciaal bij de front squat — werk hier actief aan.", en: "Ankle mobility is crucial for the front squat — actively work on this." },
      { nl: "Als de ellebogen zakken verlies je de stang — dit is het signaal dat je te zwaar gaat.", en: "If your elbows drop you'll lose the bar — this signals you're going too heavy." },
    ],
    commonMistakes: [
      { nl: "Ellebogen laten zakken — de stang rolt dan naar voren en valt.", en: "Dropping the elbows — the bar rolls forward and falls." },
      { nl: "Te weinig enkelmobiliteit waardoor de hielen optillen.", en: "Insufficient ankle mobility causing the heels to rise." },
    ],
    variants: [
      { name: "Goblet Squat", difference: { nl: "Dumbbell/kettlebell voor de borst — uitstekend voor techniek leren", en: "Dumbbell/kettlebell held at chest — excellent for learning technique" } },
      { name: "Barbell Back Squat", difference: { nl: "Meer gewicht mogelijk, meer glutes en rug betrokken", en: "More weight possible, more glutes and back involvement" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "3–5", rest: "3–4 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "6–10", rest: "2–3 min" },
    ],
    youtubeId: "Bzrdc3LwEkk",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "goblet-squat",
    name: "Goblet Squat",
    category: "Legs",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["core"],
    equipment: "Dumbbell / Kettlebell",
    difficulty: "Beginner",
    description: {
      nl: "De goblet squat is de meest beginnersvriendelijke squat-variant. Door het gewicht voor de borst te houden wordt een rechte torso geforceerd en wordt de bewegingstechniek vanzelf gecorrigeerd. Uitstekend als instap voor de squat.",
      en: "The goblet squat is the most beginner-friendly squat variation. Holding the weight at the chest forces an upright torso and naturally corrects movement technique. Excellent as an introduction to squatting.",
    },
    scienceNote: {
      nl: "De goblet squat dwingt automatisch een rechte torso-positie af en activeert de core sterker dan veel andere squat-varianten. Het is bewezen een van de meest effectieve squat-leervormen voor beginners vanwege de zelfcorrigerende mechanica.",
      en: "The goblet squat automatically enforces an upright torso position and activates the core more strongly than many other squat variations. It is proven to be one of the most effective squat learning tools for beginners due to its self-correcting mechanics.",
    },
    steps: [
      { nl: "Houd een dumbbell of kettlebell verticaal voor de borst met beide handen.", en: "Hold a dumbbell or kettlebell vertically at your chest with both hands." },
      { nl: "Voeten iets breder dan schouderbreedte, tenen naar buiten.", en: "Feet slightly wider than shoulder-width, toes outward." },
      { nl: "Zak diep omlaag terwijl de ellebogen langs de knieën sturen.", en: "Descend deeply while guiding elbows along the inside of the knees." },
      { nl: "Houd de borst omhoog en de torso rechtop.", en: "Keep chest up and torso upright." },
      { nl: "Druk door beide hielen omhoog naar startpositie.", en: "Drive through both heels upward to starting position." },
    ],
    tips: [
      { nl: "Gebruik de ellebogen om de knieën uitwaarts te sturen voor meer diepte.", en: "Use the elbows to push the knees outward for more depth." },
      { nl: "Hoe zwaarder het gewicht, hoe meer de torso rechtop blijft — dit is de goblet squat zijn sterkste punt.", en: "The heavier the weight, the more upright the torso stays — this is the goblet squat's greatest strength." },
    ],
    commonMistakes: [
      { nl: "Gewicht te laag houden waardoor de torso naar voren valt.", en: "Holding the weight too low causing the torso to fall forward." },
    ],
    variants: [
      { name: "Barbell Back Squat", difference: { nl: "Zwaarder te belasten, meer rug en balans vereist", en: "Can be loaded heavier, more back and balance required" } },
      { name: "Front Squat", difference: { nl: "Stang-versie van de goblet squat principe", en: "Barbell version of the goblet squat principle" } },
    ],
    repRanges: [
      { goal: { nl: "Techniek / Hypertrofie", en: "Technique / Hypertrophy" }, sets: "3", reps: "10–15", rest: "90 sec" },
    ],
    youtubeId: "MeIiIdhvXT4",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "nordic-hamstring-curl",
    name: "Nordic Hamstring Curl",
    category: "Legs",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "core"],
    equipment: "Partner / GHD",
    difficulty: "Advanced",
    description: {
      nl: "De Nordic hamstring curl is een van de krachtigste oefeningen voor de hamstrings en een bewezen methode om hamstringblessures te voorkomen. De extreme excentrische belasting stimuleert ongeëvenaarde hypertrofie en kracht.",
      en: "The Nordic hamstring curl is one of the most powerful hamstring exercises and a proven method for preventing hamstring injuries. The extreme eccentric loading stimulates unmatched hypertrophy and strength.",
    },
    scienceNote: {
      nl: "Meta-analyses tonen dat regelmatige Nordic hamstring curl training hamstringblessures met 51% vermindert. De oefening produceert de hoogste excentrische hamstringkracht van alle beschikbare oefeningen en stimuleert spierfasickellengteverlenging.",
      en: "Meta-analyses show regular Nordic hamstring curl training reduces hamstring injuries by 51%. The exercise produces the highest eccentric hamstring force of all available exercises and stimulates muscle fascicle length increases.",
    },
    steps: [
      { nl: "Kniel op de grond. Een partner houdt je enkels vast (of gebruik een GHD/bank).", en: "Kneel on the floor. A partner holds your ankles (or use a GHD/bench)." },
      { nl: "Houd het lichaam recht van knieën tot hoofd.", en: "Keep the body straight from knees to head." },
      { nl: "Laat je lichaam langzaam naar voren vallen, weerstand biedend met de hamstrings.", en: "Slowly lower your body forward, resisting with the hamstrings." },
      { nl: "Gebruik je handen om de val op te vangen als je niet meer kunt weerstand bieden.", en: "Use your hands to catch the fall when you can no longer resist." },
      { nl: "Druk jezelf met de handen terug naar de beginpositie.", en: "Push yourself back to the starting position with your hands." },
    ],
    tips: [
      { nl: "Begin met geassisteerde versie — gebruik een weerstandsband onder de oksels.", en: "Start with an assisted version — use a resistance band under your armpits." },
      { nl: "De beweging is extreem intensief — begin met 2–3 reps per set.", en: "The movement is extremely intense — start with 2–3 reps per set." },
    ],
    commonMistakes: [
      { nl: "Te snel zakken — het effect zit volledig in de gecontroleerde neergaande fase.", en: "Descending too quickly — the effect is entirely in the controlled lowering phase." },
    ],
    variants: [
      { name: "Lying Leg Curl", difference: { nl: "Makkelijker te doseren, minder blessurepreventief", en: "Easier to dose, less injury-preventive" } },
      { name: "Romanian Deadlift", difference: { nl: "Meer heupextensie, minder knieflexie focus", en: "More hip extension, less knee flexion focus" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht / Blessurepreventie", en: "Strength / Injury prevention" }, sets: "3", reps: "3–6", rest: "2–3 min" },
    ],
    youtubeId: "d5vlX3Yjaf8",
    youtubeCreator: "Athlean-X",
  },

  {
    id: "seated-calf-raise",
    name: "Seated Calf Raise",
    category: "Legs",
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    equipment: "Machine",
    difficulty: "Beginner",
    description: {
      nl: "De seated calf raise traint de soleus — de diepe kuitspier die onder de gastrocnemius ligt. De soleus is alleen actief wanneer de knie gebogen is, waardoor de seated calf raise de enige manier is om hem direct te trainen.",
      en: "The seated calf raise trains the soleus — the deep calf muscle lying beneath the gastrocnemius. The soleus is only active when the knee is bent, making the seated calf raise the only way to directly train it.",
    },
    scienceNote: {
      nl: "De soleus maakt ca. 60% van de kuitdikte uit maar wordt volledig gemist door staande calf raises. Door de knie te buigen wordt de gastrocnemius ontspannen (bi-articulaire spier), waardoor de soleus geïsoleerd wordt geactiveerd.",
      en: "The soleus comprises about 60% of calf thickness but is completely missed by standing calf raises. Bending the knee relaxes the gastrocnemius (bi-articular muscle), allowing the soleus to be isolated.",
    },
    steps: [
      { nl: "Zit aan de machine met de pads op de bovenkant van je knieën.", en: "Sit at the machine with the pads on top of your knees." },
      { nl: "Plaatst de ballen van de voeten op het platform, hielen vrij hangen.", en: "Place the balls of your feet on the platform, heels hanging free." },
      { nl: "Laat de hielen zo ver mogelijk zakken voor maximale rek.", en: "Lower heels as far as possible for maximum stretch." },
      { nl: "Druk de hielen omhoog naar maximale plantairflexie.", en: "Drive heels upward to maximum plantarflexion." },
      { nl: "Pauzeer 1–2 seconden bovenaan.", en: "Pause 1–2 seconds at the top." },
    ],
    tips: [
      { nl: "Pauzeer bewust aan de onderkant voor extra soleus-rek.", en: "Deliberately pause at the bottom for extra soleus stretch." },
      { nl: "Combineer altijd met staande calf raises voor complete kuitontwikkeling.", en: "Always combine with standing calf raises for complete calf development." },
    ],
    commonMistakes: [
      { nl: "Stuiteren onderaan — dit vermindert de soleus-activatie enorm.", en: "Bouncing at the bottom — this greatly reduces soleus activation." },
    ],
    variants: [
      { name: "Machine Standing Calf Raise", difference: { nl: "Knie gestrekt → gastrocnemius wordt primair geactiveerd", en: "Knee extended → gastrocnemius is primarily activated" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "4", reps: "12–20", rest: "60 sec" },
    ],
    youtubeId: "JbyjNymZOt0",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "hip-abduction-machine",
    name: "Hip Abduction Machine",
    category: "Legs",
    primaryMuscles: ["glutes"],
    secondaryMuscles: [],
    equipment: "Machine",
    difficulty: "Beginner",
    description: {
      nl: "De heupabductie machine traint de gluteus medius — de middelste bilspier die verantwoordelijk is voor de zijkant van de billen en voor heupstabiliteit. Deze spier wordt nauwelijks geactiveerd door squats of hip thrusts.",
      en: "The hip abduction machine trains the gluteus medius — the middle glute muscle responsible for the side of the glutes and hip stability. This muscle is barely activated by squats or hip thrusts.",
    },
    scienceNote: {
      nl: "De gluteus medius heeft een andere vezeloriëntatie dan de gluteus maximus en vereist laterale beenbewegingen voor optimale activatie. EMG-studies tonen dat de machine heupabductie de hoogste gluteus medius activatie geeft van alle geïsoleerde glute-oefeningen.",
      en: "The gluteus medius has a different fibre orientation than the gluteus maximus and requires lateral leg movements for optimal activation. EMG studies show machine hip abduction produces the highest gluteus medius activation of all isolated glute exercises.",
    },
    steps: [
      { nl: "Ga in de machine zitten met de pads aan de buitenkant van de knieën.", en: "Sit in the machine with the pads on the outside of your knees." },
      { nl: "Spreid de knieën uit elkaar zo ver als het bereik toelaat.", en: "Spread knees apart as far as the range allows." },
      { nl: "Knijp de gluteus medius samen op het punt van maximale abductie.", en: "Squeeze the gluteus medius at maximum abduction." },
      { nl: "Laat gecontroleerd terug naar de startpositie.", en: "Return with control to the starting position." },
    ],
    tips: [
      { nl: "Leun licht naar voren in de machine voor meer gluteus medius-activatie.", en: "Lean slightly forward in the machine for more gluteus medius activation." },
      { nl: "Focus op de squeeze bovenaan — niet op het gewicht.", en: "Focus on the squeeze at the top — not on the weight." },
    ],
    commonMistakes: [
      { nl: "Te snel uitvoeren — de gluteus medius heeft langzame, gecontroleerde beweging nodig.", en: "Performing too quickly — the gluteus medius needs slow, controlled movement." },
    ],
    variants: [
      { name: "Cable Hip Abduction", difference: { nl: "Staand, meer functioneel en core-activerend", en: "Standing, more functional and core-activating" } },
      { name: "Lateral Band Walk", difference: { nl: "Activerend voor warming-up, minder overload", en: "Activating for warm-up, less overload" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "15–20", rest: "60 sec" },
    ],
    youtubeId: "4O-ZyFUJoKg",
    youtubeCreator: "Bret Contreras",
  },

  // ─── CORE ─────────────────────────────────────────────────────────────────

  {
    id: "cable-crunch",
    name: "Cable Crunch",
    category: "Core",
    primaryMuscles: ["core"],
    secondaryMuscles: [],
    equipment: "Cable machine",
    difficulty: "Beginner",
    description: {
      nl: "De cable crunch is de meest effectieve belaste core-oefening voor de rectus abdominis. Door het gewicht progressief te verhogen kan je de buikspieren overloaden net als elk ander spiergroep — iets wat bij bodyweight crunches onmogelijk is.",
      en: "The cable crunch is the most effective loaded core exercise for the rectus abdominis. By progressively increasing the weight, you can overload the abs just like any other muscle group — something impossible with bodyweight crunches.",
    },
    scienceNote: {
      nl: "De buikspieren zijn spieren zoals alle andere en reageren op progressieve overload. EMG-studies tonen dat belaste crunches significant hogere rectus abdominis activatie produceren dan bodyweight varianten. Constante spanning via de kabel is superieur aan vrije gewichten voor core-isolatie.",
      en: "The abs are muscles like any other and respond to progressive overload. EMG studies show loaded crunches produce significantly higher rectus abdominis activation than bodyweight variations. Constant cable tension is superior to free weights for core isolation.",
    },
    steps: [
      { nl: "Kniel voor de kabel-machine, touw op de hoogste stand. Pak het touw achter het hoofd.", en: "Kneel in front of the cable machine, rope at the highest position. Hold the rope behind your head." },
      { nl: "Houd de heupen gefixeerd — de beweging komt alleen vanuit de buikspieren.", en: "Keep hips fixed — the movement comes only from the abs." },
      { nl: "Crunch omlaag totdat de ellebogen de knieën bijna raken.", en: "Crunch down until elbows nearly touch the knees." },
      { nl: "Knijp de buikspieren samen onderaan.", en: "Squeeze the abs at the bottom." },
      { nl: "Laat gecontroleerd terug naar de startpositie.", en: "Return with control to the starting position." },
    ],
    tips: [
      { nl: "De beweging is een spinal flexie — niet een heupflexie. Heupen blijven gefixeerd.", en: "The movement is spinal flexion — not hip flexion. Hips stay fixed." },
      { nl: "Verhoog het gewicht net als bij andere spiergroepen voor progressieve overload.", en: "Increase the weight just like other muscle groups for progressive overload." },
    ],
    commonMistakes: [
      { nl: "Heupen naar beneden bewegen in plaats van de wervelkolom te buigen.", en: "Moving the hips downward instead of flexing the spine." },
      { nl: "Te veel gewicht waardoor het nekspieren overneemt.", en: "Too much weight causing the neck muscles to take over." },
    ],
    variants: [
      { name: "Ab Wheel Rollout", difference: { nl: "Anti-extensie — traint de core via stabilisatie", en: "Anti-extension — trains the core through stabilisation" } },
      { name: "Hanging Leg Raise", difference: { nl: "Meer focus op de onderbuik via heupflexie", en: "More lower abs focus via hip flexion" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60 sec" },
    ],
    youtubeId: "YGGjeRm9lKg",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    category: "Core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["back", "shoulders"],
    equipment: "Ab wheel",
    difficulty: "Advanced",
    description: {
      nl: "De ab wheel rollout is een van de zwaarste en meest effectieve core-oefeningen. Door de anti-extensie beweging wordt de core gedwongen de ruggengraat te stabiliseren onder extreme belasting. Dit traint de rectus abdominis en transversus abdominis simultaan.",
      en: "The ab wheel rollout is one of the most challenging and effective core exercises. The anti-extension movement forces the core to stabilise the spine under extreme load. This trains the rectus abdominis and transversus abdominis simultaneously.",
    },
    scienceNote: {
      nl: "Anti-extensie oefeningen zoals de ab wheel rollout activeren de core via isometrische spierspanning terwijl het lichaam externe belasting weerstaat. Dit mimickt de functionele rol van de core in het dagelijks leven en sport meer dan crunches.",
      en: "Anti-extension exercises like the ab wheel rollout activate the core through isometric muscle tension while resisting external load. This mimics the functional role of the core in daily life and sport more than crunches.",
    },
    steps: [
      { nl: "Kniel op de grond met het ab wheel voor je.", en: "Kneel on the floor with the ab wheel in front of you." },
      { nl: "Rol langzaam naar voren terwijl de core gespannen blijft.", en: "Roll slowly forward while keeping the core braced." },
      { nl: "Ga zo ver als je de lumbale neutraliteit kunt handhaven.", en: "Go as far as you can maintain lumbar neutrality." },
      { nl: "Trek de core samen en rol terug naar de startpositie.", en: "Contract the core and roll back to the starting position." },
    ],
    tips: [
      { nl: "Begin met korte uitrolbewegingen en vergroot de ROM geleidelijk.", en: "Start with short roll-outs and gradually increase the ROM." },
      { nl: "Nooit de rug laten doorzakken — dit is het signaal om te stoppen.", en: "Never let the lower back sag — this is the signal to stop." },
    ],
    commonMistakes: [
      { nl: "Rug laten doorzakken bij het uitrollen — extreme lumbale belasting.", en: "Letting the back sag during rollout — extreme lumbar loading." },
      { nl: "Te ver uitrollen voordat je de kracht hebt.", en: "Rolling out too far before having the strength." },
    ],
    variants: [
      { name: "Plank", difference: { nl: "Makkelijker, statische core-stabilisatie", en: "Easier, static core stabilisation" } },
      { name: "Barbell Rollout", difference: { nl: "Zwaarder alternatief zonder ab wheel", en: "Heavier alternative without ab wheel" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht / Hypertrofie", en: "Strength / Hypertrophy" }, sets: "3–4", reps: "5–10", rest: "90 sec" },
    ],
    youtubeId: "FHnMDMEZrVk",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "Core",
    primaryMuscles: ["core"],
    secondaryMuscles: [],
    equipment: "Pull-up bar",
    difficulty: "Intermediate",
    description: {
      nl: "De hanging leg raise is de beste oefening voor de onderbuik (lager rectus abdominis) via heupflexie. Door de benen gehangen op te tillen worden de buikspieren maximaal geactiveerd over de volledige ROM.",
      en: "The hanging leg raise is the best exercise for the lower abs (lower rectus abdominis) via hip flexion. Lifting the legs while hanging maximally activates the abdominal muscles over the full ROM.",
    },
    scienceNote: {
      nl: "De onderste portie van de rectus abdominis wordt beter geactiveerd bij heupflexie-bewegingen dan bij spinale flexie (crunches). De hanging variant maximaliseert de ROM en elimineert grond-ondersteuning, waardoor de core het volledige werk doet.",
      en: "The lower portion of the rectus abdominis is better activated during hip flexion movements than spinal flexion (crunches). The hanging variant maximises ROM and eliminates floor support, forcing the core to do all the work.",
    },
    steps: [
      { nl: "Hang aan een pull-up stang met gestrekte armen.", en: "Hang from a pull-up bar with arms extended." },
      { nl: "Span de core aan. Til de benen op tot minimaal parallel aan de grond.", en: "Brace the core. Raise legs to at least parallel with the floor." },
      { nl: "Voor gevorderden: til de benen tot de stang (L-sit positie).", en: "For advanced: raise legs to the bar (L-sit position)." },
      { nl: "Laat gecontroleerd terug — geen swing.", en: "Lower with control — no swinging." },
    ],
    tips: [
      { nl: "Vermijd swing — draag de kern van de beweging vanuit de core, niet het momentum.", en: "Avoid swinging — drive the movement from the core, not momentum." },
      { nl: "Gebogen knieën is een makkelijkere variant voor beginners.", en: "Bent knees is an easier variant for beginners." },
    ],
    commonMistakes: [
      { nl: "Zwaaien met het lichaam voor momentum.", en: "Swinging the body for momentum." },
      { nl: "Alleen tot heupstand tillen — ga verder voor meer activatie.", en: "Only lifting to hip height — go further for more activation." },
    ],
    variants: [
      { name: "Hanging Knee Raise", difference: { nl: "Makkelijker beginner-variant met gebogen knieën", en: "Easier beginner variant with bent knees" } },
      { name: "Toes to Bar", difference: { nl: "Extreme ROM — teentoppen raken de stang", en: "Extreme ROM — toes touch the bar" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "60 sec" },
    ],
    youtubeId: "hdng3Nm1x_E",
    youtubeCreator: "Jeff Nippard",
  },


  // ─── BATCH 3 ──────────────────────────────────────────────────────────────

  // BACK

  {
    id: "t-bar-row",
    name: "T-Bar Row",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "shoulders"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De T-Bar Row is een compound trekbeweging die de mid- en bovenrug intensief traint. Door de neutrale greep en het beperkte schouderisolatieproblem is het een van de beste oefeningen voor dikte van de rugspieren.",
      en: "The T-Bar Row is a compound pulling movement that intensively trains the mid and upper back. The neutral grip and limited shoulder isolation make it one of the best exercises for back thickness.",
    },
    scienceNote: {
      nl: "EMG-onderzoek toont aan dat de T-Bar Row een hoge activatie geeft van de m. latissimus dorsi, teres major en rhomboids tegelijk. De horizontale trekvector is optimaal voor breedte én dikte van de rug.",
      en: "EMG research shows the T-Bar Row produces high activation of the latissimus dorsi, teres major, and rhomboids simultaneously. The horizontal pull vector is optimal for both width and thickness of the back.",
    },
    steps: [
      { nl: "Zet een barbell in een landmijn-bevestiging of hoek. Voeg een V-greep of T-bar-attachment toe aan het beladen uiteinde.", en: "Set a barbell in a landmine attachment or corner. Add a V-grip or T-bar attachment to the loaded end." },
      { nl: "Stap schrijlings over de bar, pak de grepen en sta gebogen met een rechte rug (45–60° voorover).", en: "Stand astride the bar, grip the handles, and hinge forward with a flat back (45–60° forward lean)." },
      { nl: "Trek de bar naar je borst door je ellebogen langs je zij te trekken en je schouderbladen samen te knijpen.", en: "Pull the bar toward your chest by driving your elbows back along your sides and squeezing your shoulder blades together." },
      { nl: "Houd de contractie 1 seconde vast en laat gecontroleerd zakken tot volledige armextensie.", en: "Hold the contraction for 1 second and lower under control to full arm extension." },
    ],
    tips: [
      { nl: "Houd je rug vlak — vermijd ronden van de onderrug.", en: "Keep your back flat — avoid rounding the lower back." },
      { nl: "Trek met je ellebogen, niet met je handen.", en: "Pull with your elbows, not your hands." },
      { nl: "Neutraliseer je core door je buik aan te spannen alsof je een klap verwacht.", en: "Brace your core as if expecting a punch to prevent lower back strain." },
    ],
    commonMistakes: [
      { nl: "Te veel gewicht waardoor de rug rondt.", en: "Too much weight causing the back to round." },
      { nl: "Ellebogen te wijd uitsteken (meer lateral raise dan rij).", en: "Elbows flaring too wide (more lateral raise than row)." },
      { nl: "Gebruik van momentum met de heupen om het gewicht omhoog te slingeren.", en: "Using hip momentum to heave the weight up." },
    ],
    variants: [
      { name: "Chest-Supported T-Bar Row", difference: { nl: "Borst op een kussen voor extra stabiliteit en isolatie", en: "Chest on a pad for extra stability and isolation" } },
      { name: "Wide-Grip T-Bar Row", difference: { nl: "Bredere greep voor meer bovenrug-focus", en: "Wider grip for more upper back focus" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "4–6", rest: "3–4 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12", rest: "90 sec" },
    ],
    youtubeId: "j3Igk5nyZE4",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "meadows-row",
    name: "Meadows Row",
    category: "Back",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De Meadows Row is een unilaterale rij-variatie ontwikkeld door de late bodybuilder John Meadows. De schuine hoek en overhand-greep zorgen voor een maximale stretch van de lat aan het begin van de herhaling.",
      en: "The Meadows Row is a unilateral rowing variation developed by the late bodybuilder John Meadows. The angled pull and overhand grip maximize the lat stretch at the bottom of each rep.",
    },
    scienceNote: {
      nl: "Unilaterale training corrigeert kracht-asymmetrie en verhoogt de mechanische spanning op de werkende zijde doordat de contralaterale zijde niet compenseert. De uitgestrekte startpositie maximaliseert de stretch-mediated hypertrophy.",
      en: "Unilateral training corrects strength asymmetries and increases mechanical tension on the working side because the contralateral side cannot compensate. The stretched start position maximizes stretch-mediated hypertrophy.",
    },
    steps: [
      { nl: "Zet een barbell in een landmijn-hoek. Sta perpendiculair op de bar en pak het uiteinde met een overhand-greep.", en: "Place a barbell in a landmine corner. Stand perpendicular to the bar and grip the end with an overhand grip." },
      { nl: "Kantel je romp 45–60° voorover met het werkende been iets naar achter.", en: "Hinge your torso 45–60° forward with the working-side foot stepped slightly back." },
      { nl: "Trek de bar langs je zij omhoog totdat je elleboog achter je lichaam is. Knijp de lat samen.", en: "Pull the bar along your side until your elbow passes behind your torso. Squeeze the lat hard." },
      { nl: "Laat gecontroleerd zakken tot de lat volledig uitgestrekt is.", en: "Lower under control until the lat is fully stretched." },
    ],
    tips: [
      { nl: "Gebruik een greep zo ver mogelijk naar het einde voor maximale ROM.", en: "Grip as far toward the end as possible for maximum ROM." },
      { nl: "Stabiliseer met de vrije hand op je knie of een bank.", en: "Stabilize with the free hand on your knee or a bench." },
    ],
    commonMistakes: [
      { nl: "Romp te veel draaien in plaats van zuiver trekken.", en: "Rotating the torso instead of pulling straight." },
      { nl: "Elleboog te snel omhoog stoten zonder lat-contractie.", en: "Rushing the elbow up without a lat contraction." },
    ],
    variants: [
      { name: "Single-Arm Dumbbell Row", difference: { nl: "Klassieke unilaterale variant op een bank", en: "Classic unilateral variant supported on a bench" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "8–12", rest: "75 sec" },
    ],
    youtubeId: "PmstgzlGJoU",
    youtubeCreator: "Jeff Nippard",
  },

  // SHOULDERS

  {
    id: "cable-lateral-raise",
    name: "Cable Lateral Raise",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: [],
    equipment: "Cable",
    difficulty: "Beginner",
    description: {
      nl: "De Cable Lateral Raise is de kabel-variant van de dumbbell lateral raise en biedt een constante spanningscurve door de gehele beweging. Dit maakt het bijzonder effectief voor isolatie van de mediale deltoid.",
      en: "The Cable Lateral Raise is the cable version of the dumbbell lateral raise and provides a constant tension curve throughout the movement, making it particularly effective for medial deltoid isolation.",
    },
    scienceNote: {
      nl: "Bij vrije gewichten valt de spanning weg in het onderste deel van de beweging (arm naast het lichaam). Kabels handhaven constante spanning ook in de gestretched positie, wat meer time-under-tension en meer hypertrofie-stimulus geeft.",
      en: "With free weights, tension drops near zero at the bottom (arm beside the body). Cables maintain constant tension even in the stretched position, increasing time-under-tension and the hypertrophic stimulus.",
    },
    steps: [
      { nl: "Stel het kabelpulley in op de laagste stand. Pak het handvat met de hand die het verst van de machine af is.", en: "Set the cable pulley to the lowest position. Grip the handle with the hand furthest from the machine." },
      { nl: "Sta rechtop, arm langs het lichaam met een lichte elleboogbuiging.", en: "Stand upright, arm at your side with a slight elbow bend." },
      { nl: "Til je arm zijwaarts omhoog tot schouderhoogte (90°). Houd de elleboog licht gebogen gedurende de hele beweging.", en: "Raise your arm sideways to shoulder height (90°). Keep the elbow slightly bent throughout." },
      { nl: "Laat gecontroleerd zakken — laat de kabel de arm terug trekken voor maximale stretch.", en: "Lower under control — let the cable pull the arm back for maximum stretch." },
    ],
    tips: [
      { nl: "Trek de kabel via de hand die het dichtst bij de machine staat om je romp te stabiliseren.", en: "Hold the cable column with the near hand to stabilize your torso." },
      { nl: "Houd je schouder laag — vermijd het ophalen van de schouder.", en: "Keep your shoulder depressed — avoid shrugging." },
      { nl: "Lichte inclinatie voorover (10–15°) verbetert de congruentie van de deltoid.", en: "A slight forward lean (10–15°) improves deltoid congruence and feel." },
    ],
    commonMistakes: [
      { nl: "Te zwaar gewicht waardoor de trapezius overneemt.", en: "Too much weight causing the trapezius to take over." },
      { nl: "De arm over 90° tillen — dit neemt de spanning weg van de deltoid.", en: "Raising the arm past 90° — this shifts load away from the deltoid." },
    ],
    variants: [
      { name: "Dumbbell Lateral Raise", difference: { nl: "Vrij gewicht-variant, minder spanning onderaan", en: "Free weight variant, less tension at the bottom" } },
      { name: "Leaning Cable Lateral Raise", difference: { nl: "Sterk zijdelings leunen voor nog meer stretch", en: "Lean hard sideways for an even greater stretch" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–5", reps: "12–20", rest: "60 sec" },
    ],
    youtubeId: "PPDEjHfDfoc",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "upright-row",
    name: "Upright Row",
    category: "Shoulders",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De Upright Row is een compound schouder- en trapezius-oefening waarbij de stang verticaal langs het lichaam omhoog getrokken wordt. Wijs gebogen met correcte techniek traint het de mediale deltoid en bovenrug.",
      en: "The Upright Row is a compound shoulder and trapezius exercise where the bar is pulled vertically up along the body. With correct technique it effectively trains the medial deltoid and upper back.",
    },
    scienceNote: {
      nl: "Bij een smalle greep en hoog trekken ontstaat interne rotatie van de humerus, wat subacromiale impingement kan veroorzaken. Een brede greep (schouderbreedte+) en het beperken van de ellebooghoogte tot schouderniveau minimaliseren dit risico.",
      en: "A narrow grip and high pull creates internal humeral rotation, risking subacromial impingement. A wider grip (shoulder-width+) and limiting elbow height to shoulder level minimizes this risk.",
    },
    steps: [
      { nl: "Pak de stang met een overhand-greep iets breder dan schouderbreedte.", en: "Grip the bar overhand slightly wider than shoulder-width." },
      { nl: "Trek de stang langs je lichaam omhoog door je ellebogen naar boven en buiten te leiden.", en: "Pull the bar up along your body by driving your elbows upward and outward." },
      { nl: "Stop wanneer je ellebogen op schouderhoogte zijn — niet hoger.", en: "Stop when your elbows reach shoulder height — no higher." },
      { nl: "Laat gecontroleerd zakken tot de armen gestrekt zijn.", en: "Lower under control to full arm extension." },
    ],
    tips: [
      { nl: "Gebruik een brede greep en stop op schouderhoogte voor pijnvrije schouders.", en: "Use a wide grip and stop at shoulder height for pain-free shoulders." },
      { nl: "Kabelvariant biedt constante spanning en minder gewrichtsbelasting.", en: "The cable variant provides constant tension and less joint stress." },
    ],
    commonMistakes: [
      { nl: "Smalle greep + ellebogen boven de oren trekken — klassieke oorzaak van schouderpijn.", en: "Narrow grip + pulling elbows above ears — classic cause of shoulder pain." },
      { nl: "Momentum gebruiken door de heupen te strekken.", en: "Using hip extension to generate momentum." },
    ],
    variants: [
      { name: "Dumbbell Upright Row", difference: { nl: "Meer vrijheid per arm, minder impingement-risico", en: "More freedom per arm, lower impingement risk" } },
      { name: "Cable Upright Row", difference: { nl: "Constante spanning door de beweging", en: "Constant tension throughout the movement" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "75 sec" },
    ],
    youtubeId: "VFDzqDwXHSM",
    youtubeCreator: "Jeff Nippard",
  },

  // BICEPS / ARMS

  {
    id: "concentration-curl",
    name: "Concentration Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: {
      nl: "De Concentration Curl isoleert de biceps door de elleboog te stabiliseren op de binnenkant van de dij. Het elimineert slingerbeweging en verplicht volledige range-of-motion.",
      en: "The Concentration Curl isolates the biceps by bracing the elbow on the inner thigh. It eliminates swinging and forces full range-of-motion.",
    },
    scienceNote: {
      nl: "Onderzoek van de American Council on Exercise plaatste de Concentration Curl in de top voor biceps EMG-activatie, mede door de supinatie van de onderarm en de gefixeerde elleboogpositie die compensatie door andere spieren vrijwel uitsluit.",
      en: "American Council on Exercise research ranked the Concentration Curl among the top exercises for biceps EMG activation, partly due to forearm supination and the fixed elbow position that largely eliminates compensation from other muscles.",
    },
    steps: [
      { nl: "Zit op een bank, knieën 90°. Pak een dumbbell en leun licht voorover.", en: "Sit on a bench, knees at 90°. Pick up a dumbbell and lean slightly forward." },
      { nl: "Plaats de achterkant van je bovenarm tegen de binnenkant van je dij als vast steunpunt.", en: "Rest the back of your upper arm against the inner thigh as a fixed pivot point." },
      { nl: "Curl de dumbbell omhoog terwijl je de pols supineert (handpalm naar het plafond).", en: "Curl the dumbbell upward while supinating the wrist (palm facing the ceiling)." },
      { nl: "Knijp de biceps samen boven en laat langzaam zakken tot volledige extensie.", en: "Squeeze the biceps at the top and lower slowly to full extension." },
    ],
    tips: [
      { nl: "Houd de elleboog het hele traject op de dij — beweeg alleen de onderarm.", en: "Keep the elbow on the thigh throughout — only the forearm should move." },
      { nl: "Volle extensie onderaan is essentieel voor maximale stretch.", en: "Full extension at the bottom is essential for maximum stretch." },
    ],
    commonMistakes: [
      { nl: "Te snel naar beneden laten vallen (verlies van eccentrische spanning).", en: "Dropping the weight too fast (losing eccentric tension)." },
      { nl: "De bovenarm van de dij afhalen om meer gewicht te liften.", en: "Lifting the upper arm off the thigh to handle heavier weight." },
    ],
    variants: [
      { name: "Cable Concentration Curl", difference: { nl: "Kabelversie met constante spanning ook onderaan", en: "Cable version with constant tension even at the bottom" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie / pump", en: "Hypertrophy / pump" }, sets: "3–4", reps: "10–15", rest: "60 sec" },
    ],
    youtubeId: "ULEqX5oAtHg",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "cable-curl",
    name: "Cable Curl",
    category: "Arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: "Cable",
    difficulty: "Beginner",
    description: {
      nl: "De Cable Curl combineert de voordelen van constante spanning (via kabel) met de klassieke curl-beweging. Ideaal als afsluiting van een biceps-training voor maximale pump.",
      en: "The Cable Curl combines the benefits of constant tension (via cable) with the classic curl movement. Ideal as a finishing exercise for maximum biceps pump.",
    },
    scienceNote: {
      nl: "Kabels houden de biceps onder spanning in de volledig gestrekte positie (arm recht naar beneden), terwijl dumbbells hier nagenoeg geen weerstand bieden. Dit verbetert de stimulus in de stretch-positie — de fase die geassocieerd is met de grootste hypertrofie-respons.",
      en: "Cables keep the biceps under tension in the fully stretched position (arm hanging straight), whereas dumbbells offer virtually no resistance here. This improves the stimulus at the stretch position — the phase associated with the greatest hypertrophic response.",
    },
    steps: [
      { nl: "Stel het kabelpulley in op de laagste stand. Pak de rechte of EZ-bar attachment.", en: "Set the cable pulley to the lowest position. Grip the straight bar or EZ-bar attachment." },
      { nl: "Sta rechtop, bovenarmen langs het lichaam. Begin met volledig gestrekte armen.", en: "Stand upright, upper arms at your sides. Start with fully extended arms." },
      { nl: "Curl de bar omhoog door de ellebogen te buigen en de onderarmen te supineren.", en: "Curl the bar up by bending the elbows and supinating the forearms." },
      { nl: "Knijp de biceps samen boven en laat gecontroleerd zakken.", en: "Squeeze the biceps at the top and lower under control." },
    ],
    tips: [
      { nl: "Houd de bovenarmen stil naast het lichaam — geen zwaaien.", en: "Keep the upper arms stationary at your sides — no swinging." },
      { nl: "Gebruik een EZ-bar voor minder polsbelasting.", en: "Use an EZ-bar for less wrist stress." },
    ],
    commonMistakes: [
      { nl: "Ellebogen naar voren steken bovenaan (vermindert spanning op biceps).", en: "Elbows shooting forward at the top (reduces tension on the biceps)." },
      { nl: "Torso achterover kantelen om te helpen.", en: "Leaning the torso back to assist the lift." },
    ],
    variants: [
      { name: "Single-Arm Cable Curl", difference: { nl: "Unilateraal voor betere mind-muscle connection", en: "Unilateral for better mind-muscle connection" } },
      { name: "High-Cable Curl", difference: { nl: "Pulley hoog instellen voor stretched-positie focus", en: "Pulley set high for stretch-position focus" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie / pump", en: "Hypertrophy / pump" }, sets: "3–4", reps: "12–20", rest: "60 sec" },
    ],
    youtubeId: "NFzTWp2qpiE",
    youtubeCreator: "Jeff Nippard",
  },

  // TRICEPS

  {
    id: "overhead-cable-tricep-extension",
    name: "Overhead Cable Tricep Extension",
    category: "Arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: "Cable",
    difficulty: "Beginner",
    description: {
      nl: "De Overhead Cable Tricep Extension plaatst de triceps in een maximaal gestrekte positie door de armen boven het hoofd, wat de lange kop van de triceps — het grootste deel — optimaal activeert.",
      en: "The Overhead Cable Tricep Extension places the triceps in a maximally stretched position with arms overhead, optimally activating the long head — the largest portion of the triceps.",
    },
    scienceNote: {
      nl: "De lange kop van de triceps heeft zijn oorsprong aan het schouderblad en wordt het meest gestrekt wanneer de arm gestrekt boven het hoofd is. Studies van Milo Wolf en collega's tonen dat overhead triceps-oefeningen de lange kop significant beter isoleren en hypertrofiëren dan pushdown-varianten.",
      en: "The triceps long head originates on the scapula and is maximally stretched when the arm is elevated overhead. Research by Milo Wolf and colleagues shows overhead triceps exercises significantly better isolate and hypertrophy the long head compared to pushdown variants.",
    },
    steps: [
      { nl: "Stel het kabelpulley in op de hoogste stand. Pak een touwhandle of rechte bar. Draai je rug naar de machine.", en: "Set the cable pulley to the highest position. Grip a rope handle or straight bar. Turn your back to the machine." },
      { nl: "Stap een stap naar voren. Breng je handen achter je hoofd, ellebogen wijzend naar het plafond.", en: "Step one step forward. Bring hands behind your head, elbows pointing at the ceiling." },
      { nl: "Strek de armen volledig door de ellebogen te strekken terwijl de bovenarmen stil blijven.", en: "Extend the arms fully by straightening the elbows while the upper arms stay still." },
      { nl: "Laat gecontroleerd zakken tot je de stretch in de triceps voelt.", en: "Lower under control until you feel the stretch in the triceps." },
    ],
    tips: [
      { nl: "Houd de ellebogen smal — vermijd dat ze naar buiten dwarrelen.", en: "Keep elbows narrow — avoid letting them flare outward." },
      { nl: "Volledige extensie bovenaan is essentieel voor maximale contractie.", en: "Full extension at the top is essential for maximum contraction." },
    ],
    commonMistakes: [
      { nl: "Bovenarmen bewegen mee (verlies van isolatie).", en: "Upper arms moving along (loss of isolation)." },
      { nl: "Gewicht te zwaar waardoor de ROM beperkt wordt.", en: "Too heavy a load restricting range of motion." },
    ],
    variants: [
      { name: "Dumbbell Overhead Extension", difference: { nl: "Vrij gewicht-variant, meer ROM maar minder spanning onderaan", en: "Free weight variant, more ROM but less tension at the bottom" } },
      { name: "Rope Overhead Extension", difference: { nl: "Touw split bovenaan voor meer contractie", en: "Rope splits at top for greater contraction" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15", rest: "75 sec" },
    ],
    youtubeId: "CUkULBzogxc",
    youtubeCreator: "Jeff Nippard",
  },

  // LEGS

  {
    id: "sumo-deadlift",
    name: "Sumo Deadlift",
    category: "Legs",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["quads", "back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: {
      nl: "De Sumo Deadlift is een deadlift-variatie met een brede standbreedte en handen binnen de knieën. Het vermindert de torso-inclinatie en verschuift de belasting meer naar de glutes en heupadductoren vergeleken met de conventional deadlift.",
      en: "The Sumo Deadlift is a deadlift variation with a wide stance and hands inside the knees. It reduces torso lean and shifts load more toward the glutes and hip adductors compared to the conventional deadlift.",
    },
    scienceNote: {
      nl: "Biomechanisch verkort de sumo-stand de effectieve hefboom van de rug, wat de lumbale compressiekrachten vermindert. Ideaal voor lifters met lange femora of beperkte rugbeweeglijkheid. De heupabductoren en adductoren worden zwaarder belast.",
      en: "Biomechanically, the sumo stance shortens the effective back lever arm, reducing lumbar compressive forces. Ideal for lifters with long femurs or limited lumbar mobility. The hip abductors and adductors are more heavily loaded.",
    },
    steps: [
      { nl: "Sta met brede voeten (1,5–2× schouderbreedte), tenen uitgedraaid 30–45°. Handen binnen de knieën op de stang.", en: "Stand wide (1.5–2× shoulder-width), toes turned out 30–45°. Hands inside the knees on the bar." },
      { nl: "Druk de knieën actief naar buiten zodat ze over de voeten wijzen. Trek de heupen naar beneden.", en: "Actively push the knees outward so they track over the feet. Pull the hips down toward the bar." },
      { nl: "Trek de stang omhoog door tegelijkertijd de vloer weg te duwen en de heupen door te strekken.", en: "Pull the bar up by simultaneously pushing the floor away and extending the hips." },
      { nl: "Bovenaan volledig staan — heupen en knieën gestrekt, schouders achter de stang.", en: "Stand fully at the top — hips and knees extended, shoulders behind the bar." },
    ],
    tips: [
      { nl: "Activeer de heupflexors door actief de grond 'uit elkaar te trekken' met je voeten.", en: "Activate hip flexors by actively 'pulling the floor apart' with your feet." },
      { nl: "Houd de stang dicht bij het lichaam — 'scheer' je schenen er langs.", en: "Keep the bar close to the body — 'shave' your shins on the way up." },
    ],
    commonMistakes: [
      { nl: "Knieën naar binnen zakken bij het opstaan.", en: "Knees caving inward during the ascent." },
      { nl: "Heupen te vroeg strekken, waardoor de rug het overneemt.", en: "Hips extending too early, causing the back to take over." },
    ],
    variants: [
      { name: "Conventional Deadlift", difference: { nl: "Smallere stand, meer rugbelasting", en: "Narrower stance, more back demand" } },
      { name: "Sumo Romanian Deadlift", difference: { nl: "Sumo-stand met RDL-patroon voor hamstrings/glutes", en: "Sumo stance with RDL pattern for hamstrings/glutes" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht", en: "Strength" }, sets: "4–5", reps: "3–5", rest: "4–5 min" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "6–10", rest: "2–3 min" },
    ],
    youtubeId: "op9kVnSso6Q",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "glute-bridge",
    name: "Glute Bridge",
    category: "Legs",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    description: {
      nl: "De Glute Bridge is een fundamentele glute-oefening waarbij de heupen vanuit liggende positie worden uitgestrekt. Ideaal als activatie voor training of als zelfstandige glute-developer.",
      en: "The Glute Bridge is a foundational glute exercise performed by extending the hips from a lying position. Ideal as a warm-up activation or standalone glute developer.",
    },
    scienceNote: {
      nl: "De Glute Bridge plaatst de gluteus maximus in een korte, samengetrokken positie aan het einde van de beweging. In combinatie met hip thrust (meer ROM) vormt het een complete stimulus voor glute-hypertrofie over de volledige lengtecurve.",
      en: "The Glute Bridge places the gluteus maximus in a shortened, contracted position at the end of the movement. Combined with the hip thrust (more ROM), it provides a complete stimulus for glute hypertrophy across the full length-tension curve.",
    },
    steps: [
      { nl: "Lig op je rug, knieën gebogen 90°, voeten plat op de grond op heupbreedte.", en: "Lie on your back, knees bent 90°, feet flat on the floor hip-width apart." },
      { nl: "Span je glutes en core aan. Druk je voeten in de grond en til je heupen omhoog.", en: "Brace your glutes and core. Press your feet into the floor and drive your hips up." },
      { nl: "Strek heupen volledig totdat je knieën, heupen en schouders een rechte lijn vormen.", en: "Extend hips fully until knees, hips, and shoulders form a straight line." },
      { nl: "Houd 1–2 seconden vast en laat gecontroleerd zakken.", en: "Hold 1–2 seconds and lower under control." },
    ],
    tips: [
      { nl: "Duw de kin licht naar de borst om de nek te ontlasten.", en: "Tuck the chin slightly to relieve neck tension." },
      { nl: "Voeg een weerstandsband rond de knieën toe voor extra glute-activatie.", en: "Add a resistance band around the knees for extra glute activation." },
    ],
    commonMistakes: [
      { nl: "Heupen niet volledig strekken — halverwege stoppen vermindert de glute-contractie drastisch.", en: "Not fully extending the hips — stopping halfway dramatically reduces glute contraction." },
      { nl: "Rug hyperextensie — de bovenrug mag niet van de grond loskomen.", en: "Lower back hyperextension — the upper back should not arch off the floor." },
    ],
    variants: [
      { name: "Barbell Hip Thrust", difference: { nl: "Rug op een bank voor grotere ROM en belasting", en: "Back on a bench for greater ROM and loading capacity" } },
      { name: "Single-Leg Glute Bridge", difference: { nl: "Unilateraal voor extra belasting en stabiliteitstraining", en: "Unilateral for extra load and stability training" } },
    ],
    repRanges: [
      { goal: { nl: "Activatie/warm-up", en: "Activation/warm-up" }, sets: "2–3", reps: "15–20", rest: "45 sec" },
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "12–20", rest: "60 sec" },
    ],
    youtubeId: "OUgsJ8-Vi0E",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "walking-lunge",
    name: "Walking Lunge",
    category: "Legs",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: {
      nl: "De Walking Lunge is een dynamische unilaterale beenbeweging die kracht, balans en coördinatie traint. Door de stap-voor-stap beweging wordt ook de heupflexor van het achterste been gestrekt.",
      en: "The Walking Lunge is a dynamic unilateral leg movement that trains strength, balance, and coordination. The step-by-step motion also stretches the hip flexor of the trailing leg.",
    },
    scienceNote: {
      nl: "Lunges activeren de quadriceps en gluteus maximus in een functioneel bewegingspatroon dat translatie van het lichaamszwaartepunt vereist. Unilaterale training corrrigeert links/rechts asymmetrie en heeft een hoge overdracht naar sportbewegingen.",
      en: "Lunges activate the quadriceps and gluteus maximus in a functional movement pattern requiring center-of-mass translation. Unilateral training corrects left/right asymmetry and has high transfer to sports movements.",
    },
    steps: [
      { nl: "Sta rechtop met een dumbbell in elke hand (of stang op rug voor meer belasting).", en: "Stand upright with a dumbbell in each hand (or barbell on back for greater load)." },
      { nl: "Stap één grote stap naar voren. Laat de achterste knie zakken tot vlak boven de grond.", en: "Step one large step forward. Lower the rear knee to just above the floor." },
      { nl: "Druk met je voorste hiel af om naar voren te stappen naar de volgende rep.", en: "Press through your front heel to step forward into the next rep." },
      { nl: "Wissel benen af terwijl je vooruit loopt. Houd de romp opgericht.", en: "Alternate legs as you walk forward. Keep the torso upright." },
    ],
    tips: [
      { nl: "Stap groot genoeg zodat de voorste scheen verticaal blijft aan het einde.", en: "Step far enough so the front shin stays vertical at the bottom." },
      { nl: "Kijk recht vooruit — naar de grond kijken verstoort de balans.", en: "Look straight ahead — looking down disrupts balance." },
    ],
    commonMistakes: [
      { nl: "Te kleine stap waardoor de knie ver voor de teen komt.", en: "Too small a step causing the knee to shoot far past the toe." },
      { nl: "Romp te ver voorover leunen.", en: "Leaning the torso too far forward." },
    ],
    variants: [
      { name: "Stationary Lunge", difference: { nl: "Geen verplaatsing — ideaal voor beginners of beperkte ruimte", en: "No walking — ideal for beginners or limited space" } },
      { name: "Reverse Lunge", difference: { nl: "Stap achterwaarts — minder kniebelasting, meer glutefocus", en: "Step backward — less knee stress, more glute focus" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–14 per been", rest: "90 sec" },
    ],
    youtubeId: "L8fvypPrzzs",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "step-up",
    name: "Step-Up",
    category: "Legs",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: {
      nl: "De Step-Up is een functionele unilaterale beenbeweging op een box of bank. Het isoleert effectief één been per keer en verbetert balans, heupextensie-kracht en de transfer naar dagelijkse bewegingen.",
      en: "The Step-Up is a functional unilateral leg movement performed on a box or bench. It effectively isolates one leg at a time, improving balance, hip extension strength, and transfer to everyday movement.",
    },
    scienceNote: {
      nl: "Door de hoge boxhoogte (scheenbeen ≈ 90°) wordt de gluteus maximus in een verlengde positie geactiveerd, wat de hypertrofie-stimulus vergroot. Onderzoek toont vergelijkbare quad-activatie als de squat maar met lagere spinale compressiekrachten.",
      en: "A taller box (shin ≈ 90°) activates the gluteus maximus in a lengthened position, increasing the hypertrophic stimulus. Research shows comparable quad activation to the squat but with lower spinal compressive forces.",
    },
    steps: [
      { nl: "Sta voor een box of stevige bank (kniehoogte). Houd dumbbells vast langs het lichaam.", en: "Stand in front of a box or sturdy bench (knee height). Hold dumbbells at your sides." },
      { nl: "Stap met één voet volledig op de box. Duw door de hiel om je lichaam omhoog te brengen.", en: "Place one foot fully on the box. Drive through that heel to raise your body up." },
      { nl: "Breng het andere been omhoog zodat je volledig rechtop staat op de box.", en: "Bring the trailing leg up until you're standing fully upright on the box." },
      { nl: "Stap gecontroleerd terug naar de beginsituatie.", en: "Step back down under control to the starting position." },
    ],
    tips: [
      { nl: "Duw af via de hiel van het werkende been, niet de voorvoet van het stappende been.", en: "Drive through the heel of the working leg, not the toe of the stepping leg." },
      { nl: "Hogere box = meer glute-activatie. Lagere box = meer quad-focus.", en: "Higher box = more glute activation. Lower box = more quad focus." },
    ],
    commonMistakes: [
      { nl: "Afduwen met het achterste been waardoor het werkende been niet volledig belast wordt.", en: "Pushing off with the back foot, unloading the working leg." },
      { nl: "Romp excessief voorover leunen.", en: "Excessive forward lean of the torso." },
    ],
    variants: [
      { name: "Lateral Step-Up", difference: { nl: "Zij-op op de box voor heupabductie-focus", en: "Step up sideways for hip abduction focus" } },
      { name: "Deficit Reverse Lunge", difference: { nl: "Vergelijkbare glute-stimulus met meer controle", en: "Similar glute stimulus with more control" } },
    ],
    repRanges: [
      { goal: { nl: "Hypertrofie", en: "Hypertrophy" }, sets: "3–4", reps: "10–15 per been", rest: "75 sec" },
    ],
    youtubeId: "dQqApCGd5Ss",
    youtubeCreator: "Jeff Nippard",
  },

  // CORE

  {
    id: "pallof-press",
    name: "Pallof Press",
    category: "Core",
    primaryMuscles: ["core"],
    secondaryMuscles: [],
    equipment: "Cable",
    difficulty: "Beginner",
    description: {
      nl: "De Pallof Press is een anti-rotatie core-oefening. In tegenstelling tot crunch-varianten traint het de core als stabilisator door weerstand te bieden aan rotatie vanuit de kabel.",
      en: "The Pallof Press is an anti-rotation core exercise. Unlike crunches, it trains the core as a stabilizer by resisting rotation generated by the cable.",
    },
    scienceNote: {
      nl: "De primaire functie van de core in functionele bewegingen is anti-rotatie en anti-extensie, niet het genereren van flexie. De Pallof Press traint dit direct: de externe moment van de kabel wil de romp roteren, en de core moet dit weerstaan.",
      en: "The primary function of the core in functional movement is anti-rotation and anti-extension, not flexion generation. The Pallof Press trains this directly: the cable's external torque tries to rotate the torso, and the core must resist it.",
    },
    steps: [
      { nl: "Stel het kabelpulley in op borsthoogte. Sta zijdelings op de machine, pak de handle met beide handen voor de borst.", en: "Set the cable pulley to chest height. Stand sideways to the machine, hold the handle with both hands at your chest." },
      { nl: "Stap weg van de machine zodat de kabel spanning heeft. Sta in een athletische houding (knieën licht gebogen).", en: "Step away from the machine until the cable is taut. Stand in an athletic stance (knees slightly bent)." },
      { nl: "Druk de handle recht naar voren en strek de armen volledig. Houd de romp strak en vermijd rotatie.", en: "Press the handle straight out and fully extend the arms. Keep the torso rigid and resist rotation." },
      { nl: "Trek de handle terug naar de borst. Herhaal voor alle reps. Verander daarna van zijde.", en: "Pull the handle back to the chest. Repeat for all reps. Then switch sides." },
    ],
    tips: [
      { nl: "Hoe verder je van de machine staat, hoe zwaarder de rotatie-moment.", en: "The further you stand from the machine, the greater the rotational torque." },
      { nl: "Adem uit tijdens het uitdrukken, adem in bij terugkeer.", en: "Exhale on the press-out, inhale on the return." },
    ],
    commonMistakes: [
      { nl: "De romp laten roteren in de richting van de kabel.", en: "Letting the torso rotate toward the cable." },
      { nl: "Te snel bewegen — dit is een statische stabilisatieoefening.", en: "Moving too fast — this is a static stabilization exercise." },
    ],
    variants: [
      { name: "Half-Kneeling Pallof Press", difference: { nl: "Kneeling-positie vergroot de anti-rotatie-uitdaging", en: "Kneeling position increases the anti-rotation challenge" } },
      { name: "Overhead Pallof Press", difference: { nl: "Druk omhoog ipv naar voren — anti-lateraalflexie", en: "Press overhead instead of forward — anti-lateral flexion" } },
    ],
    repRanges: [
      { goal: { nl: "Core stabiliteit", en: "Core stability" }, sets: "3", reps: "10–15 per zijde", rest: "60 sec" },
    ],
    youtubeId: "AH_QZLm_0-s",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "russian-twist",
    name: "Russian Twist",
    category: "Core",
    primaryMuscles: ["core"],
    secondaryMuscles: [],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    description: {
      nl: "De Russian Twist is een rotatie-core-oefening waarbij je in een V-sit positie de romp van links naar rechts draait. Het traint de obliques en de rotationele kracht van de buikspieren.",
      en: "The Russian Twist is a rotational core exercise performed in a V-sit position, rotating the torso from side to side. It trains the obliques and rotational abdominal strength.",
    },
    scienceNote: {
      nl: "De obliques (interne en externe) zijn de primaire rotators van de romp. Rotationele core-kracht is cruciaal voor atletische prestaties en heeft een directe transfer naar sport zoals tennis, golf en worstelen.",
      en: "The obliques (internal and external) are the primary torso rotators. Rotational core strength is critical for athletic performance, with direct transfer to sports such as tennis, golf, and wrestling.",
    },
    steps: [
      { nl: "Zit op de grond, knieën gebogen, hielen licht van de grond (gevorderd: benen gestrekt).", en: "Sit on the floor, knees bent, heels slightly off the ground (advanced: legs extended)." },
      { nl: "Leun achterover tot de romp 45° is. Houd de handen samen voor de borst of houd een gewicht.", en: "Lean back until the torso is at 45°. Clasp hands together at chest or hold a weight." },
      { nl: "Draai de romp naar rechts terwijl je de handen naar de grond naast je heup beweegt.", en: "Rotate the torso to the right while moving the hands toward the floor beside your hip." },
      { nl: "Draai terug naar het midden en dan naar links. Dat is één herhaling.", en: "Rotate back to center and then to the left. That is one repetition." },
    ],
    tips: [
      { nl: "De beweging moet vanuit de obliques komen, niet de schouders.", en: "The movement should come from the obliques, not the shoulders." },
      { nl: "Gebruik een medicijnbal of gewichtsschijf voor extra weerstand.", en: "Use a medicine ball or weight plate for added resistance." },
    ],
    commonMistakes: [
      { nl: "Te snel bewegen met swing — verlies van controle en spanning.", en: "Moving too fast with momentum — losing control and tension." },
      { nl: "Rug ronden in de V-sit positie.", en: "Rounding the back in the V-sit position." },
    ],
    variants: [
      { name: "Weighted Russian Twist", difference: { nl: "Medicijnbal of schijf voor progressieve overload", en: "Medicine ball or plate for progressive overload" } },
      { name: "Seated Cable Twist", difference: { nl: "Machine-variant met constante spanning", en: "Machine variant with constant tension" } },
    ],
    repRanges: [
      { goal: { nl: "Core kracht / obliques", en: "Core strength / obliques" }, sets: "3–4", reps: "20–30 (10–15 per kant)", rest: "60 sec" },
    ],
    youtubeId: "JyUqwkVpsi8",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "cable-woodchop",
    name: "Cable Woodchop",
    category: "Core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders"],
    equipment: "Cable",
    difficulty: "Intermediate",
    description: {
      nl: "De Cable Woodchop traint de diagonale krachtlijn van de romp — een van de meest functionele bewegingspatronen. Ideaal voor rotationele kracht en coördinatie tussen bovenlichaam en kern.",
      en: "The Cable Woodchop trains the diagonal power line of the torso — one of the most functional movement patterns. Ideal for rotational strength and upper body–core coordination.",
    },
    scienceNote: {
      nl: "De woodchop traint de samenwerking van de obliques, seratus anterior en contralaterale heupspieren in een diagonale krachtketen. Dit patroon is direct functioneel voor sportspecifieke bewegingen zoals gooien, slaan en schoppen.",
      en: "The woodchop trains the cooperation of the obliques, serratus anterior, and contralateral hip muscles in a diagonal force chain. This pattern is directly functional for sport-specific movements such as throwing, striking, and kicking.",
    },
    steps: [
      { nl: "Stel het kabelpulley in op de hoogste stand. Pak de handle met beide handen en sta zijdelings op de machine.", en: "Set the cable pulley to the highest position. Hold the handle with both hands and stand sideways to the machine." },
      { nl: "Pak de handle met gestrekte armen. Begin in een gedraaide positie richting de machine.", en: "Hold the handle with extended arms. Start in a rotated position toward the machine." },
      { nl: "Trek de handle diagonaal naar beneden — van boven-buitenste naar beneden-binnenste — door de romp te roteren.", en: "Pull the handle diagonally downward — from high-outside to low-inside — by rotating the torso." },
      { nl: "Houd de hips stabiel — de beweging komt primair uit de romp.", en: "Keep the hips stable — the movement comes primarily from the torso." },
    ],
    tips: [
      { nl: "Houd de armen bijna gestrekt gedurende de beweging.", en: "Keep the arms nearly straight throughout the movement." },
      { nl: "Varieer de kabelhoek (hoog naar laag, laag naar hoog, horizontaal) voor volledige oblique-stimulatie.", en: "Vary the cable angle (high to low, low to high, horizontal) for complete oblique stimulus." },
    ],
    commonMistakes: [
      { nl: "De beweging uitvoeren met alleen de armen — de romp moet roteren.", en: "Performing the movement with only the arms — the torso must rotate." },
      { nl: "De heupen mee laten draaien (verlies van isolatie).", en: "Letting the hips rotate along (loss of isolation)." },
    ],
    variants: [
      { name: "Low-to-High Woodchop", difference: { nl: "Van laag naar hoog — meer nadruk op externe obliques", en: "Low to high — greater emphasis on external obliques" } },
      { name: "Horizontal Woodchop", difference: { nl: "Horizontale variant — meer nadruk op de transverse abdominis", en: "Horizontal variant — more emphasis on the transverse abdominis" } },
    ],
    repRanges: [
      { goal: { nl: "Rotationele core kracht", en: "Rotational core strength" }, sets: "3", reps: "10–15 per zijde", rest: "60 sec" },
    ],
    youtubeId: "pAplQXSNNwk",
    youtubeCreator: "Jeff Nippard",
  },

  // CARDIO / FULL BODY

  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    category: "Full Body",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["back", "core"],
    equipment: "Kettlebell",
    difficulty: "Intermediate",
    description: {
      nl: "De Kettlebell Swing is een explosieve heupbeweging die kracht, power en cardiovasculaire conditie combineert. Het is een van de meest effectieve oefeningen voor posterior chain-ontwikkeling in combinatie met metabole stress.",
      en: "The Kettlebell Swing is an explosive hip hinge that combines strength, power, and cardiovascular conditioning. It is one of the most effective exercises for posterior chain development combined with metabolic stress.",
    },
    scienceNote: {
      nl: "De swing traint de posterieure keten (glutes, hamstrings, rugspieren) via een ballistisch hip-hinge patroon. Studies tonen significante verbeteringen in VO2max naast kracht- en vermogensontwikkeling, waardoor het de efficiëntste all-in-one oefening is.",
      en: "The swing trains the posterior chain (glutes, hamstrings, back muscles) via a ballistic hip-hinge pattern. Studies show significant improvements in VO2max alongside strength and power development, making it one of the most time-efficient all-in-one exercises.",
    },
    steps: [
      { nl: "Sta met voeten iets breder dan schouderbreedte. Kettlebell staat 30 cm voor je op de grond.", en: "Stand slightly wider than shoulder-width. Kettlebell is on the floor 30 cm in front of you." },
      { nl: "Kantel je romp voorover (hip hinge), pak de kettlebell en haal hem tussen je benen door naar achter als een pendulum.", en: "Hinge forward, grip the kettlebell and hike it back between your legs like a pendulum." },
      { nl: "Explosief: duw je heupen door en span je glutes samen. De kettlebell 'zweeft' omhoog door de heupkracht — niet door je armen.", en: "Explosively drive your hips through and squeeze your glutes. The kettlebell 'floats' up from hip power — not from your arms." },
      { nl: "Laat de kettlebell zakken via dezelfde boog en ga direct in de volgende herhaling.", en: "Let the kettlebell swing back down along the same arc and immediately go into the next rep." },
    ],
    tips: [
      { nl: "De swing is een heupbeweging, geen squat — de knieën buigen minimaal.", en: "The swing is a hip hinge, not a squat — knees bend minimally." },
      { nl: "Knijp je glutes samen alsof je een munt vasthoudt bij het staan.", en: "Squeeze your glutes together as if holding a coin when you stand tall." },
    ],
    commonMistakes: [
      { nl: "Met de armen optillen in plaats van de kracht via de heupen te genereren.", en: "Lifting with the arms instead of generating power through the hips." },
      { nl: "Te ver achterover leunen bovenaan — de romp staat verticaal, niet hypergeëxtendeerd.", en: "Leaning too far back at the top — the torso is vertical, not hyperextended." },
    ],
    variants: [
      { name: "American Swing", difference: { nl: "Kettlebell gaat boven het hoofd — meer schoudermobiliteit vereist", en: "Kettlebell goes overhead — more shoulder mobility required" } },
      { name: "Single-Arm Swing", difference: { nl: "Meer anti-rotatie core-activatie en grip-uitdaging", en: "More anti-rotation core activation and grip challenge" } },
    ],
    repRanges: [
      { goal: { nl: "Kracht / power", en: "Strength / power" }, sets: "5", reps: "10–15", rest: "90 sec" },
      { goal: { nl: "Conditioning", en: "Conditioning" }, sets: "3–5", reps: "20–30", rest: "60 sec" },
    ],
    youtubeId: "sSESeQAir2M",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "box-jump",
    name: "Box Jump",
    category: "Full Body",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "calves"],
    equipment: "Box",
    difficulty: "Intermediate",
    description: {
      nl: "De Box Jump is een plyometrische oefening die explosieve beenontwikkeling traint. Het verbetert sprint-snelheid, spronghoogte en de algehele power van de onderste extremiteiten.",
      en: "The Box Jump is a plyometric exercise that trains explosive leg power. It improves sprint speed, jump height, and overall lower extremity power.",
    },
    scienceNote: {
      nl: "Plyometrische training verbetert de stretch-shortening cycle (SSC) van spieren en pezen. De SSC slaat elastische energie op in de voorbelastingsfase en geeft deze vrij in de propulsieve fase, wat meer kracht genereert dan pure concentrische contractie.",
      en: "Plyometric training improves the stretch-shortening cycle (SSC) of muscles and tendons. The SSC stores elastic energy in the loading phase and releases it in the propulsive phase, generating more force than pure concentric contraction.",
    },
    steps: [
      { nl: "Sta voor een stevige plyometrische box (begin laag: 40–50 cm).", en: "Stand in front of a sturdy plyometric box (start low: 40–50 cm)." },
      { nl: "Zak snel in een kwart-squat, zwai de armen naar achter.", en: "Quickly dip into a quarter squat, swinging arms back." },
      { nl: "Explosief springen: duw af via de hielen, zwai armen naar voren en omhoog, en land zacht op de box met gebogen knieën.", en: "Explode up: push through your heels, swing arms forward and up, and land softly on the box with bent knees." },
      { nl: "Stap rustig terug naar de beginsituatie. Springt niet naar beneden (blessurerisico).", en: "Step back down carefully. Do not jump back down (injury risk)." },
    ],
    tips: [
      { nl: "Land zacht — prioriteer een stille landing boven hoogte.", en: "Land softly — prioritize a quiet landing over height." },
      { nl: "Begin laag en bouw hoogte op naarmate de techniek verbetert.", en: "Start low and build height as technique improves." },
    ],
    commonMistakes: [
      { nl: "Terugspringen van de box — leidt tot achilles-tendinopathie.", en: "Jumping back down off the box — leads to Achilles tendinopathy." },
      { nl: "Knieën naar binnen zakken bij landing.", en: "Knees caving inward upon landing." },
    ],
    variants: [
      { name: "Broad Jump", difference: { nl: "Sprong naar voren voor horizontale power", en: "Jump forward for horizontal power" } },
      { name: "Depth Drop", difference: { nl: "Vallen van box en land absorptie oefenen", en: "Drop off box and practice landing absorption" } },
    ],
    repRanges: [
      { goal: { nl: "Power / explosiviteit", en: "Power / explosiveness" }, sets: "3–5", reps: "3–6", rest: "2–3 min" },
    ],
    youtubeId: "52lowBDS4dA",
    youtubeCreator: "Jeff Nippard",
  },

  {
    id: "battle-ropes",
    name: "Battle Ropes",
    category: "Cardio",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["core", "back"],
    equipment: "Battle Ropes",
    difficulty: "Beginner",
    description: {
      nl: "Battle Ropes zijn dikke touwen die aan een anker bevestigd zijn en die intensief worden bewogen om golven te creëren. Ze combineren kracht, uithoudingsvermogen en coördinatie in één oefening.",
      en: "Battle Ropes are thick ropes anchored at one end and moved intensively to create waves. They combine strength, endurance, and coordination in one exercise.",
    },
    scienceNote: {
      nl: "Battle Rope-training behaalt hoge hartfrequenties (85–95% HFmax) met gelijktijdige activatie van bovenlichaam, core en onderlichaam. Als HIIT-tool zijn ze vergelijkbaar effectief met sprint-HIIT voor VO2max-verbetering terwijl de gewrichtsbelasting lager is.",
      en: "Battle rope training achieves high heart rates (85–95% HRmax) with simultaneous activation of the upper body, core, and lower body. As a HIIT tool, they are comparably effective to sprint-HIIT for VO2max improvement while joint loading is lower.",
    },
    steps: [
      { nl: "Pak een touwuiteinde in elke hand. Sta in een atletische houding met gebogen knieën, 1–2 m van het anker.", en: "Hold one rope end in each hand. Stand in an athletic stance with bent knees, 1–2 m from the anchor." },
      { nl: "Beweeg de armen afwisselend snel op en neer om golven te creëren die tot het anker reiken.", en: "Alternately move arms quickly up and down to create waves that reach the anchor." },
      { nl: "Houd de core strak en de rug recht gedurende de oefening.", en: "Keep your core braced and back straight throughout the exercise." },
      { nl: "Wissel patronen af: alternating waves, simultaneous waves, slams voor afwisseling.", en: "Alternate patterns: alternating waves, simultaneous waves, slams for variety." },
    ],
    tips: [
      { nl: "Focus op het bereiken van het anker met de golf — dit garandeert intensity.", en: "Focus on having the wave reach the anchor — this ensures sufficient intensity." },
      { nl: "Gebruik intervals (bijv. 30 sec werk / 30 sec rust) voor conditioning.", en: "Use intervals (e.g. 30 sec work / 30 sec rest) for conditioning." },
    ],
    commonMistakes: [
      { nl: "Armen te veel gebruiken, weinig lichaamsgewicht — vermindert het metabole effect.", en: "Over-using the arms with little body involvement — reduces the metabolic effect." },
      { nl: "Rugronding — houd een neutrale ruggengraat.", en: "Rounding the back — maintain a neutral spine." },
    ],
    variants: [
      { name: "Battle Rope Slams", difference: { nl: "Beide touwen tegelijk omhoog en neerslaan voor meer power", en: "Both ropes raised and slammed simultaneously for more power" } },
      { name: "Lateral Waves", difference: { nl: "Horizontale golfbeweging voor meer schouderfocus", en: "Horizontal wave motion for more shoulder focus" } },
    ],
    repRanges: [
      { goal: { nl: "Cardiovasculair / conditioning", en: "Cardiovascular / conditioning" }, sets: "4–6 rondes", reps: "20–40 sec werk", rest: "20–40 sec rust" },
    ],
    youtubeId: "roEnHPsyFRY",
    youtubeCreator: "Jeff Nippard",
  },

];

export function getExerciseDetail(slug: string): ExerciseDetail | undefined {
  return EXERCISE_DETAILS.find((e) => e.id === slug);
}

export function getAllExerciseDetails(): ExerciseDetail[] {
  return EXERCISE_DETAILS;
}
