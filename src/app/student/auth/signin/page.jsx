'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"
import AuthShell, { Field, GoogleButton } from "@/components/AuthShell"

export default function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const searchParams = useSearchParams()
    const roomId = searchParams.get('roomId')

    const signupurl = roomId
        ? `/student/auth/signup/?redirect=joinRoom&roomId=${roomId}`
        : `/student/auth/signup/`

    const router = useRouter()

    const Signin = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const res = await fetch('/api/student/login', {
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
                const studentId = data.student?.id
                if (!studentId) {
                    console.error('No student ID found in response')
                    setIsLoading(false)
                    return
                }
                localStorage.setItem('studentId', studentId)
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }
                setTimeout(() => {
                    if (roomId) {
                        router.push(`/student/${studentId}?joinRoom=${roomId}`)
                    } else {
                        router.push(`/student/${studentId}`)
                    }
                }, 2000)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while signing in")
            setIsLoading(false)
        }
    }

    return (
        <AuthShell
            role="student"
            mode="signin"
            title="Welcome back"
            subtitle="Sign in to join live tests and pick up where you left off."
        >
            <form onSubmit={Signin} className="space-y-5">
                <Field
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                />

                <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

            <GoogleButton role="student" />

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                New to MCQLive?{' '}
                <Link
                    href={signupurl}
                    className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Create a student account
                </Link>
            </p>
        </AuthShell>
    )
}
