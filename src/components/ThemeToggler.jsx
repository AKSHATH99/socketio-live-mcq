"use client";
import { useTheme } from "@/Contexts/Themecontext";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 bg-slate-300 dark:bg-slate-700 rounded-full p-1 transition-all duration-500 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-500 ease-in-out flex items-center justify-center ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        <div className={`transition-all duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}>
          {isDark ? (
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-4 7a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05a1 1 0 10-1.414 1.414L4.343 7.17a1 1 0 001.414-1.414L5.05 5.05zM16.95 5.05a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM17 10a1 1 0 100 2h1a1 1 0 100-2h-1zM3 10a1 1 0 100 2H2a1 1 0 100-2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
