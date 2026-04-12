# FitTrack — Fitness App

A clean, modern fitness tracking app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Features

- 🏠 **Home** — recent workouts + quick stats
- 💪 **Workout Tracker** — add exercises, sets, reps & weight
- 📋 **History** — full workout log with expandable detail
- 📊 **Dashboard** — weekly volume chart, streaks, top exercises

## Getting Started

### 1. Install dependencies

```bash
cd fitness-app
npm install
```

### 2. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production

```bash
npm run build
npm start
```

## Exercise Database — the core differentiator

Most fitness apps have incomplete or incorrectly named exercise libraries. FitTrack solves this three ways:

1. **wger REST API** — pulls a live database of hundreds of real exercises on first load, cached for 24h
2. **Built-in fallback** — ~40 common exercises so the app works fully offline too
3. **Add anything instantly** — if your exercise isn't in the list, type its name and hit Enter. It's saved permanently to your personal library. Your gym calls it something different? No problem — you name it.
4. **Fuzzy search** — "benchpres", "rdl", "ohp" all find the right exercise. Typos don't matter.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Fuse.js (fuzzy search)
- localStorage for data persistence (no backend needed)
- wger REST API for exercise database

## Project Structure

```
app/
  page.tsx            # Home screen
  workout/page.tsx    # Workout logging
  history/page.tsx    # Workout history
  dashboard/page.tsx  # Stats & charts
components/
  Navbar.tsx          # Navigation (top + bottom/side)
  ExercisePicker.tsx  # Exercise search & browse UI
lib/
  store.ts            # Workout data layer (localStorage)
  exercises.ts        # Exercise library (API + cache + fuzzy search)
```
