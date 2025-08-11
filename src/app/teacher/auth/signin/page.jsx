
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"

export default function Signin() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { error, isSuccess } = useState(false)
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
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await res.json()
            console.log(data);
            if (data.error) {
                toast.error(data.error)
                setIsLoading(false)
            } else {
                toast.success("Signed in successfully");
                const teacherId = data.teacher?.id;
                if (!teacherId) {
                    console.error('No teacher ID found in response');
                    setIsLoading(false);
                    return;
                }
                localStorage.setItem('teacherId', teacherId);
                // Store the token in localStorage or context as needed
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                setTimeout(() => {
                    router.push(`/teacher/${teacherId}`)
                }, 2000);
            }
        } catch (error) {
            setIsLoading(false)
            console.error(error)
            toast.error("Error occured while signing in")
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-8 w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-white text-center mb-2">Welcome Back</h1>
                    <p className="text-gray-400 text-sm text-center">Please sign in to your account</p>
                </div>

                <form onSubmit={Signin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
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
                        {isLoading ? <Spinner /> : 'Sign In'}
                    </button>
                    <a href="/api/auth/google?role=teacher"
                        class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </a>

                    <div className="text-center pt-4 border-t border-gray-600">
                        <p className="text-gray-400 text-sm">
                            Don't have an account? {' '}
                            <Link href="/teacher/auth/signup" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}