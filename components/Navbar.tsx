"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, History, LayoutDashboard, Plus, BookOpen, Users, LogOut, User, CheckCircle, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { useUser } from "@/lib/useUser";
import { useWorkout } from "@/lib/workoutContext";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", labelNl: "Home", labelEn: "Home", icon: Dumbbell },
  { href: "/dashboard", labelNl: "Dashboard", labelEn: "Dashboard", icon: LayoutDashboard },
  { href: "/history", labelNl: "Geschiedenis", labelEn: "History", icon: History },
  { href: "/exercises", labelNl: "Oefeningen", labelEn: "Exercises", icon: BookOpen },
  { href: "/community", labelNl: "Community", labelEn: "Community", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLanguage } = useLanguage();
  const { user } = useUser();
  const { activeWorkout } = useWorkout();

  // Don't show navbar on auth pages
  if (pathname === "/login" || pathname === "/register") return null;

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Profiel";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-green-500 w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">FitTrack</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              title={lang === "nl" ? "Switch to English" : "Schakel naar Nederlands"}
            >
              {lang === "nl" ? "🇳🇱 NL" : "🇬🇧 EN"}
            </button>

            {/* User menu */}
            {user && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="hidden sm:inline">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Uitloggen"
                  className="flex items-center gap-1 border border-gray-700 hover:border-red-500/50 text-gray-400 hover:text-red-400 px-2 py-1.5 rounded-lg text-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <Link
              href={activeWorkout ? "/workout?save=1" : "/workout"}
              className={`flex items-center gap-1.5 transition-colors text-white text-sm font-semibold px-3 py-1.5 rounded-lg ${
                activeWorkout
                  ? "bg-green-600 hover:bg-green-500 animate-pulse"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {activeWorkout ? (
                <><CheckCircle className="w-4 h-4" /> Opslaan</>
              ) : (
                <><Plus className="w-4 h-4" /> {lang === "nl" ? "Training" : "Workout"}</>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 sm:hidden">
        <div className="flex">
          {links.map(({ href, labelNl, labelEn, icon: Icon }) => {
            const active = pathname === href;
            const label = lang === "nl" ? labelNl : labelEn;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  active ? "text-green-500" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side nav (desktop) */}
      <aside className="hidden sm:flex fixed left-0 top-14 bottom-0 w-52 bg-gray-900 border-r border-gray-800 flex-col gap-1 p-3">
        {links.map(({ href, labelNl, labelEn, icon: Icon }) => {
          const active = pathname === href;
          const label = lang === "nl" ? labelNl : labelEn;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-green-600/20 text-green-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
        {/* Privacy link at bottom */}
        <div className="mt-auto">
          <Link
            href="/privacy"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/privacy"
                ? "bg-green-600/20 text-green-400"
                : "text-gray-600 hover:bg-gray-800 hover:text-gray-400"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {lang === "nl" ? "Privacy" : "Privacy"}
          </Link>
        </div>
      </aside>
    </>
  );
}
