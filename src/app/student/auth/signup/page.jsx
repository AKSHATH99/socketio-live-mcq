'use client'

import { useEffect , useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useSearchParams } from "next/navigation";

export default function StudentSignup() {

    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const {error , isLoading , isSuccess} = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const verifyEmail = searchParams.get("verify");
    useEffect(() => {
        if(verifyEmail){
            setEmail(verifyEmail)
        }
    }, [])

    const Signup=async(e)=>{
        e.preventDefault()
        try {
            const res = await fetch('/api/student/signup' , {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await res.json()
            if (data.error) {
                toast.error(data.error)
            } else {
                toast.success("Signed up successfully")
                setTimeout(() => {
                    router.push("/student/auth/signin")
                }, 2000);
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while signing up")
        }
    }


    return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
    <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white text-center mb-2">Student Registration</h1>
            <p className="text-gray-400 text-sm text-center">Create your student account to get started</p>
        </div>

        <form onSubmit={Signup} className="space-y-6">
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center pt-4 border-t border-gray-600">
                <p className="text-gray-400 text-sm">
                    Already have an account? {' '}
                    <Link href="/student/auth/signin" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">
                        Sign In
                    </Link>
                </p>
            </div>
        </form>
    </div>
</div>
    )
}