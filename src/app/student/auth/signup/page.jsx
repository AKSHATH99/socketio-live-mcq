'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"
import AuthShell, { Field, GoogleButton } from "@/components/AuthShell"

export default function StudentSignup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const verifyEmail = searchParams.get("verify")
    const roomId = searchParams.get('roomId')

    useEffect(() => {
        if (verifyEmail) {
            setEmail(verifyEmail)
        }
    }, [verifyEmail])

    const Signup = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const res = await fetch('/api/student/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            const data = await res.json()
            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            } else {
                toast.success("Signed up successfully")
                setTimeout(() => {
                    router.push(
                        roomId
                            ? `/student/auth/signin?redirect=joinRoom&roomId=${roomId}`
                            : `/student/auth/signin`
                    )
                }, 2000)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while signing up")
            setLoading(false)
        }
    }

    return (
        <AuthShell
            role="student"
            mode="signup"
            title="Create your student account"
            subtitle="Join live tests, keep track of your scores, and see where you rank."
        >
            <form onSubmit={Signup} className="space-y-5">
                <Field
                    label="Full name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                />

                <Field
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={Boolean(verifyEmail)}
                    autoComplete="email"
                />

                <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? <Spinner size={18} color="#ffffff" /> : 'Create account'}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <GoogleButton role="student" />

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                    href="/student/auth/signin"
                    className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Sign in
                </Link>
            </p>
        </AuthShell>
    )
}
