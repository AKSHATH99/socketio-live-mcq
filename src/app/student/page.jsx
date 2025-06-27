'use client'
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LiveQuestion from "@/controllers/DisplayQuestionBox";

export default function Student() {
    const [roomId, setRoomId] = useState("");
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
const [question, setQuestion] = useState(null);

    const [currentRoomID, setCurrentRoomID] = useState("")

    useEffect(() => {
        const alreadyjoined = localStorage.getItem("roomid");

        if (alreadyjoined) {
            setCurrentRoomID(alreadyjoined);
            return;
        }
        const socket = io();
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('connected from frontend', socket.id)
        })

        socket.on('receive-message', (data) => {
            console.log("📥 New message", data);
            setMessages((prev) => [...prev, data.message]);

        });

        socket.on("recieve-questions", (questions) => {
            console.log("📬 Received questions in student end:", questions);
            
            const receivedQuestions = Array.isArray(questions) ? questions : [questions];
            
            if (receivedQuestions.length > 0) {
                const firstQuestion = receivedQuestions[0];
                setQuestion(firstQuestion);
                console.log("📝 Set question with testId:", firstQuestion.testId);
            } else {
                console.warn("⚠️ No questions received");
            }
        })

        return () => {
            socket.disconnect()
        }

    }, [])

    const joinRoom = async () => {
        console.log("Student joining the room ", roomId)
        const joined = await socketRef.current.emit('join-room', roomId);
        if (joined) {
            // localStorage.setItem("roomid", roomId);
            setCurrentRoomID(roomId);
            console.log("Joined hahaha")
        }
    }


    useEffect(() => {
        console.log("new question questions  ",question)
    }, [question])


    return (
        <div>
            <p className="text-black">
                Hi srudent , welsome to platfrom
            </p>

            <p className="text-green-600 font-bold text-xl ">
                Curently in the room : {currentRoomID}

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

            <div className="text-red-700">

                <p className="text-xl">Your questions goes here</p>
                {question && <LiveQuestion question={question} socket={socketRef.current} />}

            </div>
        </div>


    )
}