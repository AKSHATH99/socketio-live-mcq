// this page will redirect to respective signup pages of teacher and student
'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from 'react-toastify'

export default function Auth() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const userType = searchParams.get("type");

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const sendOTP = async () => {
        if (!email) {
            toast.error("Email is required")
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/send-otp', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            })
            const data = await res.json()
            console.log(data);

            if (data.success) {
                console.log("siccess sending OTP")
                toast.success("OTP sent successfully")
                setOtpSent(true)
            }
            if (data.error) {
                setError(data.error)
                toast.error(data.error)
            } else {
                setError("")
                toast.error("An error occurred while sending OTP")
            }
        } catch (error) {
            console.error(error)
            setError("Error occured while sending OTP")
            toast.error("An error occurred while sending OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const verifyOTP = async () => {
           if (!otp || otp.length !== 6) {
            toast.error("Enter a valid 6-digit OTP")
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/verify-otp', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    otp
                })
            })
            const data = await res.json()
            console.log(data);

            if (data.success) {
                console.log("siccess verifying OTP")
                toast.success("OTP verified")
                router.push(`/${userType}/auth/signup?verify=${email}`)
            }
            if (data.error) {
                setError(data.error)
                  toast.error(data.error)
            } else {
                setError("")
                toast.error("An error occurred while verifying OTP")
            }
        } catch (error) {
            console.error(error)
            setError("Error occured while verifying OTP")
            toast.error("An error occurred while verifying OTP")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-8 w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white mb-2 text-center">Email Verification</h1>
                    <p className="text-gray-400 text-sm text-center mb-6">Enter your email address to receive a verification code</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={sendOTP}
                            disabled={isLoading}
                            className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </div>

                    <div className="text-gray-500 text-center mt-6">
                        <p>Already a member? <span onClick={() => router.push(`/${userType}/auth/signin`)} className="text-white cursor-pointer hover:underline">Login</span></p>
                    </div>
                </div>

                {otpSent && (
                    <div className="border-t border-gray-600 pt-6">
                        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-green-400 text-sm font-medium">Verification code sent successfully</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>

                            <button
                                onClick={verifyOTP}
                                disabled={isLoading}
                                className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}