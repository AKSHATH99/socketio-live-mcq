'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"
import AuthShell, { Field, GoogleButton } from "@/components/AuthShell"

const focusClass = "focus:border-emerald-500 focus:ring-emerald-500/20"

export default function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const Signin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/teacher/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (data.error) {
                toast.error(data.error)
                setIsLoading(false)
            } else {
                toast.success("Signed in successfully")
                const teacherId = data.teacher?.id
                if (!teacherId) {
                    console.error('No teacher ID found in response')
                    setIsLoading(false)
                    return
                }
                localStorage.setItem('teacherId', teacherId)
                if (data.teacher?.name) {
                    localStorage.setItem('teacherName', data.teacher.name)
                }
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }
                setTimeout(() => {
                    router.push(`/teacher/${teacherId}`)
                }, 2000)
            }
        } catch (error) {
            setIsLoading(false)
            console.error(error)
            toast.error("Error occured while signing in")
        }
    }

    return (
        <AuthShell
            role="teacher"
            mode="signin"
            title="Welcome back"
            subtitle="Sign in to launch live tests and follow results as they come in."
        >
            <form onSubmit={Signin} className="space-y-5">
                <Field
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    autoComplete="email"
                    focusClass={focusClass}
                />

                <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    focusClass={focusClass}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? <Spinner size={18} color="#ffffff" /> : 'Sign in'}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <GoogleButton role="teacher" />

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                New to MCQLive?{' '}
                <Link
                    href="/teacher/auth/signup"
                    className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Create a teacher account
                </Link>
            </p>
        </AuthShell>
    )
}
