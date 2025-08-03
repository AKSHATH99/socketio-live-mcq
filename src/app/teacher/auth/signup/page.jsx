'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"
import { set } from "@/lib/nodemailer"

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const verifyEmail = searchParams.get("verify")

    useEffect(() => {
        if (verifyEmail) setEmail(verifyEmail)
    }, [verifyEmail])

    const handleSignup = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/teacher/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Signed up successfully")
                setIsSuccess(true)
                setTimeout(() => {
                    router.push("/teacher/auth/signin")
                }, 2000)
            } else {
                toast.error(data.error || "Signup failed")
                setError(data.error)
                setIsLoading(false)
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred while signing up")
            setError("An unexpected error occurred")
            setIsLoading(false)
        } finally {
            // setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-8 w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-white text-center mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm text-center">Please fill in your details to sign up</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            disabled={verifyEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Create a secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Spinner /> : 'Create Account'}
                    </button>

                    <div className="text-center pt-4 border-t border-gray-600">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/teacher/auth/signin" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
