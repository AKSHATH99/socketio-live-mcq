
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
        <div>
            <h1>Student Signin</h1>
            <form onSubmit={Signin}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type="submit" disabled={isLoading}>Signin</button>

                <p>Dont have a account ? <Link href="/student/auth/signup">Sign Up</Link></p>
            </form>
        </div>
    )
}