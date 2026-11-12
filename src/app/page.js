'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  GraduationCap,
  LayoutGrid,
  ListChecks,
  Menu,
  MonitorSmartphone,
  Moon,
  Radio,
  Sun,
  Timer,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useTheme } from '@/Contexts/Themecontext'

/* Subtle fade-up on scroll */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For students', href: '#students' },
]

const features = [
  {
    icon: ListChecks,
    title: 'Build a test in minutes',
    description:
      'Add questions, options and timers in a clean editor. Duplicate a test and reuse it for every class.',
  },
  {
    icon: Radio,
    title: 'Run it live',
    description:
      'Start a session and watch answers arrive in real time. No refresh, no waiting for submissions.',
  },
  {
    icon: BarChart3,
    title: 'See results instantly',
    description:
      'Every response is graded the moment it is submitted, with per-question insights and a live leaderboard.',
  },
]

const steps = [
  {
    title: 'Create your test',
    description: 'Write questions, set a timer, and preview the student experience before you go live.',
  },
  {
    title: 'Share the room code',
    description: 'Students open the site, enter a short code, and join from any phone, tablet or laptop.',
  },
  {
    title: 'Go live',
    description: 'Start the test and follow participation, scores and rankings as they update in real time.',
  },
]

const studentBenefits = [
  'Join with a short room code from any browser',
  'See each question with a clear, fair countdown',
  'Get your score and rank the moment the test ends',
]

function Logo({ className = '' }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
        <Radio className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
        MCQ<span className="text-emerald-600 dark:text-emerald-400">Live</span>
      </span>
    </Link>
  )
}

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      {/* ---------- Navigation ---------- */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              href="/student/auth/signin"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
            >
              Student login
            </Link>

            <Link
              href="/teacher/auth/signin"
              className="hidden items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:inline-flex"
            >
              Teacher login
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300 md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <Link
                  href="/student/auth/signin"
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  Student login
                </Link>
                <Link
                  href="/teacher/auth/signin"
                  className="rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                >
                  Teacher login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.10),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)]"
          />

          <div className="mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-28">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Real-time classroom assessments
              </span>

              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Run live MCQ tests your class actually enjoys
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                MCQLive turns a set of questions into a live, timed quiz. Students join with a
                room code, answers are graded instantly, and rankings update while the test is
                still running.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/teacher/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                >
                  Create a test
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/student/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Join a live test
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                {['Free to start', 'No student downloads', 'Works on any device'].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Product mock */}
            <Reveal delay={120} className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-emerald-200/40 via-slate-100 to-transparent blur-2xl dark:from-emerald-500/10 dark:via-slate-800/40"
              />

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="ml-3 flex-1 rounded-md bg-slate-50 px-3 py-1 text-center text-[11px] font-medium text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
                    mcqlive.app/room/8F2K
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        Live
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        Grade 10 · Science
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                      <Timer className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      00:18
                    </div>
                  </div>

                  <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Question 3 of 10
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold leading-snug text-slate-900 dark:text-white">
                    Which data structure follows First-In, First-Out ordering?
                  </h3>

                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Queue', selected: true },
                      { label: 'Stack', selected: false },
                      { label: 'Binary tree', selected: false },
                      { label: 'Hash map', selected: false },
                    ].map((option) => (
                      <div
                        key={option.label}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm ${
                          option.selected
                            ? 'border-emerald-500 bg-emerald-50 font-medium text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {option.label}
                        {option.selected && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      12 of 14 answered
                    </span>
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full w-[86%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating leaderboard chip */}
              <div className="absolute -bottom-7 -left-3 hidden w-52 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 sm:block">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Leaderboard
                  <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="mt-2.5 space-y-2">
                  {[
                    { name: 'Aisha', score: 920 },
                    { name: 'Rohan', score: 880 },
                    { name: 'Maya', score: 850 },
                  ].map((player, index) => (
                    <div key={player.name} className="flex items-center gap-2 text-xs">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {index + 1}
                      </span>
                      <span className="flex-1 font-medium text-slate-700 dark:text-slate-200">
                        {player.name}
                      </span>
                      <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                        {player.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Stats strip ---------- */}
        <section className="border-y border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { icon: CheckCircle2, label: 'Auto-graded', detail: 'Scored the instant a timer ends' },
              { icon: Radio, label: 'Real-time', detail: 'Watch answers arrive live' },
              { icon: Zap, label: 'Zero setup', detail: 'Students join from a browser' },
              { icon: MonitorSmartphone, label: 'Any device', detail: 'Phones, tablets and laptops' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-start gap-3 px-4 py-2 lg:px-6">
                <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-emerald-400 dark:ring-slate-800">
                  <stat.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{stat.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {stat.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Everything you need
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Built for live assessment, not paperwork
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                The whole workflow lives in one place: authoring, running the session, and
                understanding the results.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delay={index * 60}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Room code banner */}
            <Reveal delay={80} className="mt-5">
              <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <LayoutGrid className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    One code, everyone in
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Start a session, project the room code, and students are in within seconds. No
                    accounts to chase, no links to paste.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-3 text-center dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                      Room code
                    </p>
                    <p className="mt-0.5 text-xl font-semibold tracking-[0.2em] text-slate-900 dark:text-white">
                      8F2K
                    </p>
                  </div>
                  <div className="hidden items-center gap-1 text-xs font-medium text-slate-400 sm:flex dark:text-slate-500">
                    <Users className="h-4 w-4" />
                    14 joined
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                From question bank to live results in three steps
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal
                  key={step.title}
                  delay={index * 70}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- For students ---------- */}
        <section id="students" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
            <Reveal className="order-2 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                For students
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                A test that feels like a game, without losing the rigour
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                Students stay focused on the question in front of them, with a visible timer and
                instant feedback. The competitive edge comes from the live leaderboard, not from
                confusing UI.
              </p>

              <ul className="mt-8 space-y-3.5">
                {studentBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600 dark:text-emerald-400" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link
                href="/student/auth/signin"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Student login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={100} className="order-1 lg:order-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Session finished
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      Science · Quiz 4
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Trophy className="h-3.5 w-3.5" />
                    Rank 2
                  </span>
                </div>

                <div className="mt-5 space-y-2.5">
                  {[
                    { name: 'Aisha', score: 920, you: false },
                    { name: 'You', score: 880, you: true },
                    { name: 'Maya', score: 850, you: false },
                    { name: 'Rohan', score: 810, you: false },
                  ].map((player, index) => (
                    <div
                      key={player.name}
                      className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm ${
                        player.you
                          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {index + 1}
                      </span>
                      <span
                        className={`flex-1 font-medium ${
                          player.you
                            ? 'text-emerald-800 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {player.name}
                      </span>
                      <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                        {player.score}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  {[
                    { label: 'Correct', value: '8/10' },
                    { label: 'Accuracy', value: '80%' },
                    { label: 'Time', value: '4m 12s' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center dark:bg-slate-900 sm:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(16,185,129,0.22),transparent_70%)]"
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Ready to run your first live test?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
                  Set up a quiz, share the room code, and get results before the bell.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/teacher/auth/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                  >
                    <Zap className="h-4 w-4" />
                    Create your first test
                  </Link>
                  <Link
                    href="/student/auth/signin"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Join as a student
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Live multiple-choice assessments with instant grading, real-time participation and
                leaderboards — built for classrooms that move fast.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Product
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Get started
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/teacher/auth/signup"
                    className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Teacher sign up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/teacher/auth/signin"
                    className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Teacher login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student/auth/signin"
                    className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Student login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} MCQLive. All rights reserved.</p>
            <p>Built with Next.js and Socket.IO</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
