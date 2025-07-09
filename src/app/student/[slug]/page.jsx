'use client'
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LiveQuestion from "@/controllers/DisplayQuestionBox";
import JoinRoomModal from "@/components/StudentInterface/JoinRoom";
import Dashboard from "@/components/StudentInterface/Dashboard";
import { Trophy, Target, BookOpen, Calendar, User, Award } from "lucide-react";

export default function Student({ params }) {

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
    const [TestEnded, setTestEnded] = useState(false);
    const [studentTests, setStudentTests] = useState([]);
    const [studentTestsWithPerformance, setStudentTestsWithPerformance] = useState([]);
    const [openLiveTestModal, setOpenLiveTestModal] = useState(false);

    useEffect(() => {
        console.log(studentData)
    }, [studentData])

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

            // Fetch student tests
            await fetchStudentTests(data.student.id);
            // Fetch student tests with performance
            await fetchStudentTestsWithPerformance(data.student.id);
        } catch (error) {
            console.error("❌ Error fetching student details:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const [currentRoomID, setCurrentRoomID] = useState("");

    const fetchStudentTests = async (studentId) => {
        try {
            const response = await fetch('http://localhost:3000/api/get-student-tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: studentId }),
            });
            const data = await response.json();
            console.log('Student Tests:', data);
            setStudentTests(data);
        } catch (error) {
            console.error('Error fetching student tests:', error);
        }
    };

    const fetchStudentTestsWithPerformance = async (studentId) => {
        try {
            const response = await fetch('http://localhost:3000/api/get-student-tests-with-performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: studentId }),
            });
            const data = await response.json();
            console.log('Student Tests with Performance:', data);
            setStudentTestsWithPerformance(data);
        } catch (error) {
            console.error('Error fetching student tests with performance:', error);
        }
    };

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
                setOpenLiveTestModal(true);
            } else {
                console.warn("⚠️ No questions received");
            }
        })

        socket.on("test-ended", (roomId, testId) => {
            console.log("Test ended for room:", roomId);
            console.log("Test ID:", testId);
            // setIsTestLive(false);
            setTestEnded(true);
        });
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
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
                            <p className="text-slate-600 mt-1">Track your learning progress and performance</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full">
                            <User className="w-5 h-5 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">Welcome {studentData?.name}!</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Status and Join Room Section */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Room Status Badge */}
                            <div className="flex items-center">
                                {currentRoomID ? (
                                    <div className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
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
                            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                        >
                            {currentRoomID ? 'Change Room' : 'Join Room'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <Dashboard studentTestData={studentTests} studentPerformanceData={studentTestsWithPerformance} />

            {/* Main Content - Questions */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="min-h-[70vh]">
                    {openLiveTestModal && questions.length > 0 && questions[currentIndex] ? (
                        <div className="bg-white rounded-lg shadow-lg h-full">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Question {currentIndex + 1}
                                    </h2>
                                    <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {questions.length - currentIndex - 1 > 0
                                            ? `${questions.length - currentIndex - 1} remaining`
                                            : 'Last question'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <LiveQuestion
                                    question={questions[currentIndex]}
                                    onAnswer={(data) => {
                                        console.log("✅ Parent received answer", data);
                                        socketRef.current.emit("answer-validate", data);

                                        // Move to next question if available
                                        if (currentIndex + 1 < questions.length) {
                                            setCurrentIndex(currentIndex + 1);
                                        } else {
                                            console.log("✅ All questions completed");
                                        }
                                    }}
                                    studentId={studentId}
                                    studentName={studentName}
                                    TestEnded={TestEnded}
                                    openLiveTestModal={openLiveTestModal}
                                    setOpenLiveTestModal={setOpenLiveTestModal}
                                />
                            </div>
                        </div>
                    ) : null}
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