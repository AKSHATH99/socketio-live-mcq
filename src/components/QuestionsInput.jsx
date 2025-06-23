'use client'
import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import InputBox from "./QuestionInputBox"

export default function QuestionsInput() {
    return (
        <div className="text-black mt-20">
            Create your quiz


            <p>Type your question here</p>
            <div>
                <InputBox />
            </div>


        </div>
    )
}