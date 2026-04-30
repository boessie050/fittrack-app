import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ActiveWorkoutBanner from "@/components/ActiveWorkoutBanner";
import { UserProvider } from "@/lib/useUser";
import { WorkoutProvider } from "@/lib/workoutContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitTrack",
  description: "Track your workouts and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <WorkoutProvider>
            <Navbar />
            <ActiveWorkoutBanner />
            <main className="max-w-4xl mx-auto px-4 pb-20 pt-6">{children}</main>
          </WorkoutProvider>
        </UserProvider>
      </body>
    </html>
  );
}
