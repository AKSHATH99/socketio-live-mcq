'use client'
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LiveQuestion from "@/controllers/DisplayQuestionBox";
import JoinRoomModal from "@/components/StudentInterface/JoinRoom";
import Dashboard from "@/components/StudentInterface/Dashboard";
import { Trophy, Target, BookOpen, Calendar, User, Award, Megaphone, Clock, FileText, Loader2, Users } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import ThemeToggle from "@/components/ThemeToggler";
import { useSocket } from "@/Contexts/SocketContexts";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function Student({ params }) {
    const router = useRouter();
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
    const [studentStatus, setStudentStatus] = useState(false)
    const [openLobby, setOpenLobby] = useState(false);
    const [lobbyData, setLobbyData] = useState(null);

    const socket = useSocket();

    const searchParams = useSearchParams();

    useEffect(() => {
        const roomIdFromParams = searchParams.get('joinRoom');

        if (roomIdFromParams) {
            setRoomId(roomIdFromParams);
            setShowJoinModal(true);
        }
    }, []);

    useEffect(() => {
        console.log("reloading the mf page")
        getStudentDetailsById();
    }, [])

    const getStudentDetailsById = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/get-student-detail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
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


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const fetchStudentTests = async (studentId) => {
        try {
            const response = await fetch('/api/get-student-tests', {
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
            const response = await fetch('/api/get-student-tests-with-performance', {
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

    const logoutStudent = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/student/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            console.log('Logout response:', data);
            if (response.ok) {
                // Handle successful logout
                localStorage.removeItem("roomId");
                router.push("/");
            }
        } catch (error) {
            console.error('Error logging out student:', error);
            setIsLoading(false);
        }
    };

    //SOCKET IO 
    useEffect(() => {
        if (!socket) return;

        getStudentDetailsById();
        const alreadyjoined = localStorage.getItem("roomid");

        if (alreadyjoined) {
            setCurrentRoomID(alreadyjoined);
            return;
        }
        // const socket = io();
        // socketRef.current = socket;

        socket.on('connect', () => {
            console.log('connected from frontend', socket.id)
        })

        socket.on('receive-message', (data) => {
            console.log("📥 New message", data);
            setMessages((prev) => [...prev, data.message]);
        });

        socket.on('open-student-lobby', (testData) => {
            setOpenLobby(true);
            console.log(`🔵 Student lobby opened for room with data of question ${testData}`);
            setLobbyData(testData);
        })

        socket.on('close-student-lobby', () => {
            setOpenLobby(false);
            console.log(`🔴 Student lobby closed`);
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
        // socket.onAny((event, ...args) => {
        //     console.log("📡 Received event:", event, args);
        // });

        socket.on("test-ended", (roomId, testId) => {
            console.log("Test ended for room:", roomId);
            console.log("Test ID:", testId);
            // setIsTestLive(false);
            setTestEnded(true);
        });

        return () => {
            // socket.disconnect()
            socket.off("receive-message");
            socket.off("recieve-questions");
            socket.off("test-ended");
        }

    }, [socket])

    const joinRoom = async (roomCode) => {
        console.log("Student joining the room ", roomCode)
        setIsJoining(true);
        try {
            const joined = await socket.emit('join-room', roomCode, studentId, 'student');
            if (joined) {
                setCurrentRoomID(roomCode);
                setShowJoinModal(false);
                console.log("Joined hahaha")

                //adding to list of students
                socket.emit('student-ready', { roomId: roomCode, studentName: studentName });
                setStudentStatus(true)


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
        socket.emit("answer-validate", data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Student Dashboard</h1>
                        <p className="text-slate-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Track your learning progress and performance</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                            <User className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                            <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Welcome {studentData?.name}!</span>
                        </div>
                        <ThemeToggle />

                        <div>
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <button onClick={logoutStudent} className="text-sm font-medium text-slate-700 dark:text-gray-200">Logout</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ROOM MANAGEMENT CARD NEW */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-lg">
                        Room Management
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                        <div className={`w-3 h-3 rounded-full ${currentRoomID ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className="font-medium text-slate-900 dark:text-gray-200">
                            {currentRoomID ? "Connected" : "Not in room"}
                        </span>
                    </div>
                </div>

                {!currentRoomID && (
                    <div className="flex justify-center py-16">
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-lg font-semibold hover:opacity-90 transition"
                        >
                            Join Room
                        </button>
                    </div>
                )}

                {currentRoomID && (
                    <>
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">Room ID</h3>
                            <div className="px-4 py-3 border border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-base text-slate-900 dark:text-white font-medium">
                                {currentRoomID}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">Room Announcements</h3>

                            <div className="max-h-40 overflow-y-auto space-y-3 border border-slate-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                                {messages.length === 0 && (
                                    <p className="text-sm text-slate-400 dark:text-gray-500 text-center">
                                        No announcements yet
                                    </p>
                                )}

                                {messages.map((msg, idx) => (
                                    <div key={idx} className="text-sm text-slate-800 dark:text-gray-200">
                                        • {msg}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Dashboard */}
        <div className="mt-8">
            <Dashboard studentTestData={studentTests} studentPerformanceData={studentTestsWithPerformance} studentId={studentId} />
        </div>

        {/* Main Content - Questions */}
        {openLiveTestModal && questions.length > 0 && questions[currentIndex] && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-gray-600">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                Question {currentIndex + 1}
                            </h2>
                            <div className="bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-gray-200 px-3 py-2 rounded-full text-sm font-medium self-start sm:self-center">
                                {questions.length - currentIndex - 1 > 0
                                    ? `${questions.length - currentIndex - 1} remaining`
                                    : 'Last question'}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <LiveQuestion
                            question={questions[currentIndex]}
                            onAnswer={(data) => {
                                console.log("✅ Parent received answer", data);
                                socket.emit("answer-validate", data);

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
                            fetchStudentDetailsById={getStudentDetailsById}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Join Room Modal */}
        <JoinRoomModal
            isOpen={showJoinModal}
            onClose={() => setShowJoinModal(false)}
            onJoinRoom={joinRoom}
            isJoining={isJoining}
            joinRoomFromParams={roomId}
        />

        {openLobby && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 border border-gray-200">

                    <div className="bg-gray-900 text-white rounded-t-xl px-6 sm:px-8 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-900 p-2 rounded-lg"></div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-4 px-4 sm:px-6 mb-6">
                            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                            <span className="text-gray-700 font-medium text-center text-sm sm:text-base">
                                Waiting for administrator to start the test
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                            <div className="flex items-center gap-3 p-3 sm:p-0">
                                <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                                    <FileText className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 text-sm">Test Title</h3>
                                    <p className="text-gray-700 text-sm truncate">{lobbyData?.title}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-0">
                                <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 text-sm">Created</h3>
                                    <p className="text-gray-700 text-sm">{formatDate(lobbyData?.createdAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-0 sm:col-span-2 lg:col-span-1">
                                <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                                    <Users className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 text-sm">Status</h3>
                                    <p className="text-gray-700 text-sm">Connected</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm mb-1">Description</h4>
                                    <p className="text-gray-700 text-sm break-words">{lobbyData?.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                            <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm mb-1">Instructions</h4>
                                <p className="text-sm text-gray-700">
                                    Stay on this page • Ensure stable connection • Close other tabs • Have materials ready
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-b-xl px-4 sm:px-6 py-3 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            The test will begin automatically once started by your administrator
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
);


}