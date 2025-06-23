
'use client'
import Image from "next/image";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import QuestionsInput from "@/components/QuestionsInput";

export default function Teacher() {
  const socketRef = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [questions, setQuestions] = useState([
    {
      question: "Who is akshath",
      options: ["a", "b", "c", "d"]
    }
  ]);

  const sendQuestions=()=>{
    socketRef.current.emit('send-questions',{
      roomId:"quiz-123",
      questions
    })
  }
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

    return () => {
      socket.disconnect()
    }
  }, []);

  const createRoom = () => {
    console.log("CREATING THE ROOM BROOOOOOOOOO");
    socketRef.current.emit('join-room', 'quiz-123');
    socketRef.current.emit('send-message', {
      roomId: 'quiz-123',
      message: 'Hello quiz team'
    });
  };

  const sendMessage = () => {
    console.log("Sedinign message")
    socketRef.current.emit('send-message', {
      roomId: "quiz-123",
      message: message
    })

  }

  useEffect(() => {
    console.log("hiii")
    console.log(messages)
  }, [messages])



  return (
    <div className="text-red-700">
      <p > Hey Teacher , Welcome ! </p>
      <br />
      <button onClick={() => { createRoom() }} >
        Create
      </button>

      <p>Type you message here to send to the group</p>

      <input value={message} type="text" onChange={(e) => { setMessage(e.target.value) }} />


      <button onClick={() => { sendMessage() }} >
        Send message
      </button>

      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>

      <QuestionsInput />

      <button onClick={()=>{sendQuestions()}} className="border border-green-600 bg-green-500 text-white m-10 p-3">
        Send qustions
      </button>
    </div>
  );
}
