"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, History, LayoutDashboard, Plus, BookOpen } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Dumbbell },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
  { href: "/exercises", label: "Exercises", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-green-500 w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">FitTrack</span>
          </div>
          <Link
            href="/workout"
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 transition-colors text-white text-sm font-semibold px-3 py-1.5 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            New Workout
          </Link>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 sm:hidden">
        <div className="flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
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
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
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
      </aside>
    </>
  );
}
