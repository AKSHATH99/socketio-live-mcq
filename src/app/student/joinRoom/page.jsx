'use client';
import { useEffect, useState } from "react";

const JoinRoomPage = () => {
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("roomId");


        const isStudentLoggedIn = localStorage.getItem("studentId");
        if (!isStudentLoggedIn) {
            window.location.href = `/student/auth/signin?redirect=joinRoom&roomId=${id}`;
        }

        else {
            window.location.href = `/${isStudentLoggedIn}?joinRoom=${id}`;
        }
    }, []);

    return (
        <div>
            <h1>Join Room</h1>
            <p>Room ID: {roomId}</p>
        </div>
    );
};

export default JoinRoomPage;

