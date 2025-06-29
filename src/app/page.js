'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

  return (
    <div className="text-red-700">
    Welcome to our app bro 

    <p>
      Who tf are you ??
      </p> 

      <div>
        <button className="border border-black px-2 py-1 m-10" onClick={()=>{router.push("/auth/verify?type=student")}} >Student</button>
        <button className="border border-black px-2 py-1" onClick={()=>{router.push("/auth/verify?type=teacher")}} >Teacher</button>
      </div>
    </div>
  );
}
