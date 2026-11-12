'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Plus,
  Presentation,
  Radio,
  Timer,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Role themes + copy                                                 */
/* ------------------------------------------------------------------ */

const ROLES = {
  student: {
    portal: 'Student portal',
    Icon: GraduationCap,
    gradient: 'from-emerald-600 via-emerald-700 to-teal-900',
    primary:
      'bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600',
    link: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300',
    ring: 'focus:border-emerald-500 focus:ring-emerald-500/20',
    artAccent: 'text-emerald-700',
    chipIcon: 'text-emerald-600',
  },
  teacher: {
    portal: 'Teacher portal',
    Icon: Presentation,
    gradient: 'from-emerald-600 via-emerald-700 to-teal-900',
    primary:
      'bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600',
    link: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300',
    ring: 'focus:border-emerald-500 focus:ring-emerald-500/20',
    artAccent: 'text-emerald-700',
    chipIcon: 'text-emerald-600',
  },
}

const COPY = {
  student: {
    signin: {
      eyebrow: 'Student access',
      heading: 'Pick up right where you left off.',
      body: 'Sign in to join a live test, review your results, and see how you rank against the rest of the class.',
      bullets: ['Join with a room code', 'Track every score', 'Climb the leaderboard'],
    },
    signup: {
      eyebrow: 'New student',
      heading: 'Your next quiz starts here.',
      body: 'One account for every live test. Get instant feedback, keep a record of your scores, and watch your progress build.',
      bullets: ['Free to create', 'No downloads needed', 'Results in real time'],
    },
  },
  teacher: {
    signin: {
      eyebrow: 'Teacher access',
      heading: 'Welcome back to the front of the class.',
      body: 'Sign in to launch live tests, follow participation as it happens, and review results the moment the timer ends.',
      bullets: ['Reuse your question banks', 'Live participation', 'Instant analytics'],
    },
    signup: {
      eyebrow: 'New teacher',
      heading: 'Your first live test is minutes away.',
      body: 'Create an account, add your questions, and share a room code. Everything else — grading and rankings — happens automatically.',
      bullets: ['Free to start', 'No grading overhead', 'Works on any device'],
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Illustrations                                                      */
/* ------------------------------------------------------------------ */

const cardClass =
  'rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm'

function LivePill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      Live
    </span>
  )
}

function FloatChip({ icon: Icon, label, value, iconClass, className = '' }) {
  return (
    <div
      className={`absolute rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-black/10 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <Icon className={`h-3.5 w-3.5 ${iconClass}`} />
        {label}
      </div>
      <p className="mt-0.5 text-sm font-semibold leading-none text-slate-900">{value}</p>
    </div>
  )
}

function StudentSigninArt({ theme }) {
  return (
    <div className="relative mt-8 max-w-md">
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <LivePill />
          <span className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-white">
            <Timer className="h-3.5 w-3.5 text-white/60" />
            00:18
          </span>
        </div>

        <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-white/60">
          Question 3 of 10
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug">
          Which data structure follows First-In, First-Out ordering?
        </p>

        <div className="mt-3 space-y-2 text-xs">
          {['Queue', 'Stack', 'Binary tree', 'Hash map'].map((option, index) => (
            <div
              key={option}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                index === 0
                  ? `border-white/60 bg-white font-medium ${theme.artAccent}`
                  : 'border-white/15 text-white/80'
              }`}
            >
              {option}
              {index === 0 && <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
          ))}
        </div>
      </div>

      <FloatChip
        icon={Trophy}
        label="Your rank"
        value="#2 of 14"
        iconClass={theme.chipIcon}
        className="-right-3 -top-4"
      />
    </div>
  )
}

function StudentSignupArt({ theme }) {
  return (
    <div className="relative mt-8 max-w-md">
      <div className={cardClass}>
        <div className="flex items-center justify-between text-xs font-medium text-white/70">
          Join a live test
          <Users className="h-4 w-4" />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {['8', 'F', '2', 'K'].map((char) => (
            <span
              key={char}
              className={`grid h-11 w-10 place-items-center rounded-lg bg-white text-lg font-semibold ${theme.artAccent}`}
            >
              {char}
            </span>
          ))}
        </div>

        <div
          className={`mt-4 rounded-lg bg-white py-2 text-center text-xs font-semibold ${theme.artAccent}`}
        >
          Join room
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-white/70">
          <div className="flex -space-x-1.5">
            {['A', 'R', 'M'].map((initial) => (
              <span
                key={initial}
                className="grid h-5 w-5 place-items-center rounded-full border border-white/30 bg-white/20 text-[9px] font-semibold text-white"
              >
                {initial}
              </span>
            ))}
          </div>
          14 students already in
        </div>
      </div>

      <FloatChip
        icon={Zap}
        label="Setup"
        value="No downloads"
        iconClass={theme.chipIcon}
        className="-right-3 -top-4"
      />
    </div>
  )
}

function TeacherSigninArt({ theme }) {
  return (
    <div className="relative mt-8 max-w-md">
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-white/60">Grade 10 · Science</p>
            <p className="text-sm font-semibold">Quiz 4 · Live session</p>
          </div>
          <LivePill />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { value: '14', label: 'Joined' },
            { value: '82%', label: 'Avg score' },
            { value: '4:12', label: 'Elapsed' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2.5">
              <p className="text-base font-semibold leading-none">{stat.value}</p>
              <p className="mt-1 text-[10px] text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-white/70">
            <span>Responses</span>
            <span className="tabular-nums">12 / 14</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[86%] rounded-full bg-white" />
          </div>
        </div>
      </div>

      <FloatChip
        icon={Zap}
        label="Live results"
        value="Leaderboard updating"
        iconClass={theme.chipIcon}
        className="-bottom-4 -right-3"
      />
    </div>
  )
}

function TeacherSignupArt({ theme }) {
  return (
    <div className="relative mt-8 max-w-md">
      <div className={cardClass}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold">New test</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/80">
            Draft
          </span>
        </div>

        <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-white/50">
            Question 1
          </p>
          <p className="mt-1 text-xs font-medium leading-snug">
            Which planet is known as the Red Planet?
          </p>

          <div className="mt-2 space-y-1.5">
            {['Mars', 'Venus', 'Jupiter'].map((option, index) => (
              <div
                key={option}
                className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] ${
                  index === 0
                    ? `bg-white font-medium ${theme.artAccent}`
                    : 'border border-white/15 text-white/75'
                }`}
              >
                {option}
                {index === 0 && <Check className="h-3 w-3" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-white/70">
            <Plus className="h-3.5 w-3.5" />
            Add question
          </span>
          <span
            className={`rounded-md bg-white px-3 py-1.5 text-[11px] font-semibold ${theme.artAccent}`}
          >
            Publish
          </span>
        </div>
      </div>

      <FloatChip
        icon={Timer}
        label="Setup time"
        value="Under 5 minutes"
        iconClass={theme.chipIcon}
        className="-right-3 -top-4"
      />
    </div>
  )
}

function Art({ role, mode, theme }) {
  if (role === 'student' && mode === 'signin') return <StudentSigninArt theme={theme} />
  if (role === 'student') return <StudentSignupArt theme={theme} />
  if (role === 'teacher' && mode === 'signin') return <TeacherSigninArt theme={theme} />
  return <TeacherSignupArt theme={theme} />
}

/* ------------------------------------------------------------------ */
/*  Shared form pieces                                                 */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = true,
  autoComplete,
  focusClass = 'focus:border-emerald-500 focus:ring-emerald-500/20',
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && visible ? 'text' : type
  const Icon = type === 'email' ? Mail : isPassword ? Lock : User

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 ${
            isPassword ? 'pr-11' : 'pr-3.5'
          } text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 ${focusClass}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

export function GoogleButton({ role }) {
  return (
    <a
      href={`/api/auth/google?role=${role}`}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Continue with Google
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

export default function AuthShell({ role, mode, title, subtitle, children }) {
  const theme = ROLES[role]
  const copy = COPY[role][mode]
  const RoleIcon = theme.Icon
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('error') === 'google') {
      toast.error('Google sign-in failed. Please try again.')
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      {/* ---- Left: illustration panel ---- */}
      <aside
        className={`relative hidden w-[52%] flex-col overflow-hidden bg-gradient-to-br p-10 text-white lg:flex xl:p-14 ${theme.gradient}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse at 30% 20%, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 20%, black, transparent 75%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <Radio className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">MCQLive</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <RoleIcon className="h-3.5 w-3.5" />
              {theme.portal}
            </span>
          </div>

          <div className="max-w-lg py-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              {copy.heading}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/80 xl:text-base">{copy.body}</p>

            <Art role={role} mode={mode} theme={theme} />
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {copy.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-white" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ---- Right: form ---- */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Radio className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              MCQ<span className="text-emerald-600 dark:text-emerald-400">Live</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </main>

        <footer className="px-5 py-5 text-center text-xs text-slate-400 dark:text-slate-500 sm:px-8">
          &copy; {new Date().getFullYear()} MCQLive · {theme.portal}
        </footer>
      </div>
    </div>
  )
}
