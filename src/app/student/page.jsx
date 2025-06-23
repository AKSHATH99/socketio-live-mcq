'use client'
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Student() {
    const [roomId, setRoomId] = useState("");
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    const [questions , setQuestions] = useState([]);

    useEffect(() => {
        const socket = io();
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('connected from frontend', socket.id)
        })

        socket.on('receive-message', (data) => {
            console.log("📥 New message", data);
            setMessages((prev) => [...prev, data.message]);
        
        });

        socket.on("recieve-questions",(questions)=>{
          console.log("Recieved questions in student end")  
          setQuestions(questions);
          console.log("at student",questions)
        })

        return () => {
            socket.disconnect()
        }

    }, [])

    const joinRoom = async () => {
        console.log("Student joining the room ", roomId)
        const joined = await socketRef.current.emit('join-room', roomId);
        if (joined) {
            console.log("Joined hahaha")
        }
    }


    useEffect(() => {
        console.log(roomId)
    }, [roomId])


    return (
        <div>
            <p className="text-black">
                Hi srudent , welsome to platfrom
            </p>

            <p>
                Join room . Type the room code here !
            </p>

            <input className="border border-black mt-10" value={roomId} onChange={(e) => { setRoomId(e.target.value) }} type="text" />

            <button onClick={() => { joinRoom() }}  >Join room </button>


            <div>
                <h3>Messages:</h3>
                <ul>
                    {messages.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
            </div> 
        </div>


    )
}