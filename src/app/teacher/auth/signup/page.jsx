'use client'

import { useEffect , useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useSearchParams } from "next/navigation";

export default function Signup() {

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
            const res = await fetch('/api/teacher/signup' , {
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
                    router.push("/teacher/auth/signin")
                }, 2000);
            }
        } catch (error) {
            console.error(error)
            toast.error("Error occured while signing up")
        }
    }


    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={Signup}>
                <input type="text" placeholder="Name" value={name}  onChange={(e)=>setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} disabled={verifyEmail} onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type="submit" disabled={isLoading}>Signup</button>

                <p>Already have a account ? <Link href="/teacher/auth/signin">Login</Link></p>
            </form>
        </div>
    )
}