'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  Fingerprint,
  GraduationCap,
  LogOut,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react'
import StudentHeader from '@/components/StudentInterface/StudentHeader'

function getInitials(name) {
  const parts = (name || 'Student').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'S'
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('')
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function StudentAccount({ params }) {
  const studentId = params.slug
  const router = useRouter()

  const [student, setStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadStudent = async () => {
      try {
        const res = await fetch('/api/get-student-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: studentId }),
        })
        const data = await res.json()

        if (cancelled) return

        if (data.student) {
          setStudent(data.student)
        } else {
          setError(data.message || 'Unable to load your account details.')
        }
      } catch (err) {
        console.error('Error fetching student account:', err)
        if (!cancelled) setError('Unable to load your account details.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadStudent()
    return () => {
      cancelled = true
    }
  }, [studentId])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/student/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    } catch (err) {
      console.error('Error logging out student:', err)
    } finally {
      localStorage.removeItem('studentId')
      localStorage.removeItem('token')
      localStorage.removeItem('roomId')
      localStorage.removeItem('roomid')
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <StudentHeader studentId={studentId} studentName={student?.name} />

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/student/${studentId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Account
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Your account
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
            Profile and session details for your student account.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 py-20 dark:border-gray-800">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600 dark:border-gray-800 dark:border-t-emerald-400" />
            <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">Loading your account...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-slate-600 dark:text-gray-300">{error}</p>
            <Link
              href={`/student/${studentId}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-xl font-semibold text-white shadow-sm shadow-emerald-600/20">
                  {getInitials(student?.name)}
                </span>
                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {student?.name}
                </h2>
                <p className="mt-0.5 break-all text-sm text-slate-500 dark:text-gray-400">
                  {student?.email}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Student account
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                  <CalendarDays className="h-4 w-4" />
                  Member since {formatDate(student?.createdAt)}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              {/* Profile details */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-slate-100 px-6 py-4 dark:border-gray-800">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Profile details
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
                    Information attached to your student account.
                  </p>
                </div>

                <dl className="divide-y divide-slate-100 dark:divide-gray-800">
                  {[
                    { icon: User, label: 'Full name', value: student?.name },
                    { icon: Mail, label: 'Email address', value: student?.email },
                    { icon: Fingerprint, label: 'Student ID', value: student?.id, mono: true },
                    { icon: CalendarDays, label: 'Joined', value: formatDate(student?.createdAt) },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:items-center sm:gap-4"
                    >
                      <dt className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                        <row.icon className="h-4 w-4" />
                        {row.label}
                      </dt>
                      <dd
                        className={`break-all text-sm font-medium text-slate-900 dark:text-white sm:col-span-2 ${
                          row.mono ? 'font-mono text-xs sm:text-xs' : ''
                        }`}
                      >
                        {row.value || '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Session */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      Session
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-gray-400">
                      You are signed in as{' '}
                      <span className="font-medium text-slate-700 dark:text-gray-200">
                        {student?.email}
                      </span>
                      . Logging out ends this session on this device.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  {isLoggingOut ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600 dark:border-red-500/30 dark:border-t-red-400" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
