'use client'
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LiveQuestion from "@/controllers/DisplayQuestionBox";
import JoinRoomModal from "@/components/StudentInterface/JoinRoom";

export default function Student({params}) {

    const studentId = params.slug;
    const [roomId, setRoomId] = useState("");
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState(null);
    const [pendingAnswer, setPendingAnswer] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [studentName, setStudentName] = useState("");

    useEffect(()=>{
        console.log(studentData)
    },[studentData])

    const getStudentDetailsById = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("http://localhost:3000/api/get-student-detail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: studentId })
            });
            const data = await res.json();

            console.log("✅ Fetched student data:", data);
            console.log("✅ Fetched student data:", data.student.name);
            console.log("✅ Fetched student data:", data.student.id);
            setStudentData(data.student);
            setStudentName(data.student.name);
        } catch (error) {
            console.error("❌ Error fetching student details:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const [currentRoomID, setCurrentRoomID] = useState("")

    useEffect(() => {
        getStudentDetailsById();
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
                setQuestions(receivedQuestions);
                setCurrentIndex(0);
            } else {
                console.warn("⚠️ No questions received");
            }
        })

        return () => {
            socket.disconnect()
        }

    }, [])

    const joinRoom = async (roomCode) => {
        console.log("Student joining the room ", roomCode)
        setIsJoining(true);
        try {
            const joined = await socketRef.current.emit('join-room', roomCode);
            if (joined) {
                setCurrentRoomID(roomCode);
                setShowJoinModal(false);
                console.log("Joined hahaha")
            }
        } catch (error) {
            console.error("Failed to join room:", error);
        } finally {
            setIsJoining(false);
        }
    }

    useEffect(() => {
        console.log("new question questions  ", question)
    }, [question])

    function handleAnswer(data) {
        console.log("✅ Parent received answer", data);
        socketRef.current.emit("answer-validate", data);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading student data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header with Room Status */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-800 mr-6">
                                Welcome, {studentData?.name}! 👋
                            </h1>
                            {/* Room Status Badge */}
                            <div className="flex items-center">
                                {currentRoomID ? (
                                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        Room: {currentRoomID}
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                        Not in room
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Join Room Button */}
                        <button 
                            onClick={() => setShowJoinModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                        >
                            {currentRoomID ? 'Change Room' : 'Join Room'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Questions Take Center Stage */}
            <div className="container mx-auto px-4 py-8">
                
              

                {/* Main Question Area - Takes up most of the screen */}
                <div className="min-h-[70vh]">
                    {questions.length > 0 && questions[currentIndex] ? (
                        <div className="bg-white rounded-lg shadow-lg h-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Question {currentIndex + 1}
                                    </h2>
                                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {questions.length > 1 ? `${questions.length - currentIndex - 1} remaining` : 'Last question'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <LiveQuestion
                                    question={questions[currentIndex]}
                                    onAnswer={(data) => {
                                        console.log("✅ Parent received answer", data);
                                        socketRef.current.emit("answer-validate", data);
                                        // advance to next question
                                        if (currentIndex + 1 < questions.length) {
                                            setCurrentIndex(currentIndex + 1);
                                        } else {
                                            console.log("✅ All questions completed");
                                        }
                                        
                                    }}
                                    studentId = {studentId}
                                    studentName = {studentName}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg h-full flex items-center justify-center">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">📚</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {currentRoomID ? "Ready to Learn!" : "Join a Room to Get Started"}
                                </h3>
                                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                    {currentRoomID ? 
                                        "You're all set! Your instructor will send questions when the session begins." : 
                                        "Connect to your learning session by joining a room with the code provided by your instructor."
                                    }
                                </p>
                                {!currentRoomID && (
                                    <button 
                                        onClick={() => setShowJoinModal(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
                                    >
                                        Join Room Now
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Join Room Modal */}
            <JoinRoomModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onJoinRoom={joinRoom}
                isJoining={isJoining}
            />
        </div>
    );
}