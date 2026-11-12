'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Moon, Radio, Sun } from 'lucide-react'
import { useTheme } from '@/Contexts/Themecontext'

function getInitials(name) {
  const parts = (name || 'Teacher').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'T'
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('')
}

export default function TeacherHeader({ teacherId, teacherName = 'Teacher', activeNav = true }) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const homeHref = teacherId ? `/teacher/${teacherId}` : '/teacher/auth/signin'

  const navLinkClass = (active) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-slate-100 text-slate-900 dark:bg-gray-800 dark:text-white'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
    }`

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/teacher/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error logging out teacher:', error)
    } finally {
      localStorage.removeItem('teacherId')
      localStorage.removeItem('teacherName')
      localStorage.removeItem('token')
      localStorage.removeItem('roomId')
      router.push('/')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <Link href={homeHref} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <Radio className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              MCQ<span className="text-emerald-600 dark:text-emerald-400">Live</span>
            </span>
          </Link>

          <span className="hidden h-5 w-px bg-slate-200 dark:bg-gray-700 sm:block" />

          <nav className="hidden items-center gap-1 sm:flex">
            <Link href={homeHref} className={navLinkClass(activeNav)}>
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 dark:border-gray-800">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
              {getInitials(teacherName)}
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm font-medium text-slate-700 dark:text-gray-200 sm:block">
              {teacherName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log out"
            title="Log out"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            {isLoggingOut ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-gray-600 dark:border-t-gray-200" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
