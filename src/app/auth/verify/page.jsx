// this page will redirect to respective signup pages of teacher and student
'use client'
import { useState , useEffect } from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Auth() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const userType = searchParams.get("type");

    const [email , setEmail] = useState("");
    const [error , setError] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const [otpSent , setOtpSent] = useState(false);
    const [otp , setOtp] = useState("");

    const sendOTP = async()=>{
        setIsLoading(true)
        try {
            const res = await fetch('/api/send-otp' , {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email
                })
            })
            const data = await res.json()
            console.log(data);

            if(data.success){
                console.log("siccess sending OTP")
                setOtpSent(true)
            }
            if (data.error) {
                setError(data.error)
            } else {
                setError("")
            }
        } catch (error) {
            console.error(error)
            setError("Error occured while sending OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const verifyOTP = async()=>{
        setIsLoading(true)
        try {
            const res = await fetch('/api/verify-otp' , {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,
                    otp
                })
            })
            const data = await res.json()
            console.log(data);

            if(data.success){
                console.log("siccess verifying OTP")
                router.push(`/${userType}/auth/signup?verify=${email}`)
            }
            if (data.error) {
                setError(data.error)
            } else {
                setError("")
            }
        } catch (error) {
            console.error(error)
            setError("Error occured while verifying OTP")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <h1>Enter your mail id here </h1>
            <input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} />
            <button onClick={sendOTP} disabled={isLoading}>Submit</button>
            {otpSent && 
            <div>
                <h1>OTP sent successfully</h1>
                <input type="text" placeholder="Enter your OTP" onChange={(e)=>{setOtp(e.target.value)}} />
                <button onClick={verifyOTP} disabled={isLoading}>Verify</button>
            </div>
            }
        </div>
    )
}   