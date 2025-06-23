
'use client'
import { useState, useEffect } from "react"
import { io } from "socket.io-client"


export default function InputBox() {
    return (
        <div className="text-black bg-gray-100 mt-20 w-max p-1 ml-10">

            <div className="mt-10">

                <input className="border w-full h-[40px] border-black" placeholder="Type Question here" />
            </div>

            <div className="mt-10 flex flex-row  gap-3">

                <input placeholder="Options"  className="border border-black " />
                <input placeholder="Options" className="border border-black " />
                <input placeholder="Options" className="border border-black " />
                <input placeholder="Options" className="border border-black " />

            </div>





        </div>
    )
}