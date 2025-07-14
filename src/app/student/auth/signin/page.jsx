
'use client'

import { useEffect , useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function Signin() {

    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const {error , isLoading , isSuccess} = useState(false)

    const router = useRouter()

    const Signin=async(e)=>{
        e.preventDefault()
        try {
            const res = await fetch('/api/student/login' , {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,
                    password
                })
            })
            const data = await res.json()
            console.log(data);
            if (data.error) {
                toast.error(data.error)
            } else {
                toast.success("Signed in successfully");
                const studentId = data.student?.id;
                if (!studentId) {
                    console.error('No student ID found in response');
                    return;
                }
                localStorage.setItem('studentId', studentId);
                // Store the token in localStorage or context as needed
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                setTimeout(() => {
                    router.push(`/student/${studentId}`)
                }, 2000);
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while signing in")
        }
    }


    return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
    <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white text-center mb-2">Student Sign In</h1>
            <p className="text-gray-400 text-sm text-center">Sign in to access your account</p>
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
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center pt-4 border-t border-gray-600">
                <p className="text-gray-400 text-sm">
                    Don't have an account? {' '}
                    <Link href="/student/auth/signup" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">
                        Sign Up
                    </Link>
                </p>
            </div>
        </form>
    </div>
</div>
    )
}