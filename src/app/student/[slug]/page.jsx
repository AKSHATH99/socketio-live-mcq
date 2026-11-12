'use client'
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LiveQuestion from "@/controllers/DisplayQuestionBox";
import Dashboard from "@/components/StudentInterface/Dashboard";
import StatsCards from "@/components/StudentInterface/StatsCards";
import StudentHeader from "@/components/StudentInterface/StudentHeader";
import { Calendar, User, Clock, FileText, Loader2, Users, DoorOpen, QrCode } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSocket } from "@/Contexts/SocketContexts";
import { normalizeRoomCode } from "@/lib/roomCode";

export default function Student({ params }) {
    const studentId = params.slug;
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState(null);
    const [pendingAnswer, setPendingAnswer] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [roomCodeInput, setRoomCodeInput] = useState("");
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
            setRoomCodeInput(roomIdFromParams);
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
    const autoJoinedRef = useRef(false);


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
        const normalizedCode = normalizeRoomCode(roomCode);
        console.log("Student joining the room ", normalizedCode)
        setIsJoining(true);
        try {
            // emit() returns the socket instance, not the server's response, so
            // an acknowledgement is required to know the join actually worked.
            const response = await socket.timeout(5000).emitWithAck(
                'join-room',
                normalizedCode,
                studentId,
                'student'
            );

            if (!response?.ok) {
                console.error("Failed to join room:", response?.error || 'unknown error');
                toast.error(response?.error || "Could not join the room. Check the code and try again.");
                return;
            }

            setCurrentRoomID(normalizedCode);
            console.log("Joined room", normalizedCode)

            //adding to list of students
            socket.emit('student-ready', { roomId: normalizedCode, studentName: studentName });
            setStudentStatus(true)
        } catch (error) {
            console.error("Failed to join room:", error);
            toast.error("Could not join the room. Check the code and try again.");
        } finally {
            setIsJoining(false);
        }
    }

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        const code = roomCodeInput.trim();
        if (!code) return;
        await joinRoom(code);
    }

    // Students arriving through an invite link are joined automatically, since
    // the room code is already known.
    useEffect(() => {
        const roomIdFromParams = searchParams.get('joinRoom');

        if (!roomIdFromParams || !socket || !studentName) return;
        if (autoJoinedRef.current) return;

        autoJoinedRef.current = true;
        joinRoom(roomIdFromParams);
    }, [socket, studentName, searchParams]);

    useEffect(() => {
        console.log("new question questions  ", question)
    }, [question])

    function handleAnswer(data) {
        console.log("✅ Parent received answer", data);
        socket.emit("answer-validate", data);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="h-16 border-b border-slate-200 dark:border-gray-800" />
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-slate-100 dark:bg-gray-800" />
                            <div className="h-7 w-64 rounded bg-slate-100 dark:bg-gray-800" />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[0, 1, 2].map((card) => (
                                <div
                                    key={card}
                                    className="h-28 rounded-2xl bg-slate-100 dark:bg-gray-800"
                                />
                            ))}
                        </div>
                        <div className="h-48 rounded-2xl bg-slate-100 dark:bg-gray-800" />
                    </div>
                </main>
            </div>
        );
    }

return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
        <StudentHeader studentId={studentId} studentName={studentData?.name} />

        <main className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
            {/* Section 1: overview */}
            <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Welcome back, {studentData?.name || 'Student'}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                    Here&apos;s a quick look at your progress.
                </p>

                <div className="mt-6">
                    <StatsCards studentTestData={studentTests} studentPerformanceData={studentTestsWithPerformance} />
                </div>
            </section>

            {/* Section 2: join a room */}
            <section className="mt-12">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Live session
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                            Join a room
                        </h2>
                    </div>
                    <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                            currentRoomID
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${currentRoomID ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {currentRoomID ? 'Connected' : 'Not in a room'}
                    </span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                    {!currentRoomID ? (
                        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                            <div>
                                <div className="flex items-start gap-3">
                                    <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                                        <DoorOpen className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                            Enter your room code
                                        </h3>
                                        <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
                                            Your teacher will share a short code for the live session.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleJoinRoom} className="mt-6">
                                    <label htmlFor="room-code" className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                                        Room code
                                    </label>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <input
                                            id="room-code"
                                            type="text"
                                            value={roomCodeInput}
                                            onChange={(e) => setRoomCodeInput(e.target.value)}
                                            placeholder="ENTER CODE"
                                            disabled={isJoining}
                                            autoComplete="off"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-center text-lg font-semibold uppercase tracking-[0.25em] text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!roomCodeInput.trim() || isJoining}
                                            className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isJoining ? (
                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                    Joining...
                                                </>
                                            ) : (
                                                'Join room'
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-400 dark:text-gray-500">
                                        Codes are not case sensitive.
                                    </p>
                                </form>
                            </div>

                            <div className="hidden w-44 flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center dark:border-gray-700 dark:bg-gray-800/40 md:flex">
                                <QrCode className="h-20 w-20 text-slate-800 dark:text-gray-200" strokeWidth={1.25} />
                                <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-gray-200">Scan to join</p>
                                <p className="mt-1 text-[11px] leading-4 text-slate-400 dark:text-gray-500">
                                    Point your camera at the QR shared by your teacher
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400">Room code</h3>
                                <p className="mt-2 inline-flex rounded-xl border border-dashed border-slate-300 px-4 py-3 text-lg font-semibold tracking-[0.2em] text-slate-900 dark:border-gray-600 dark:text-white">
                                    {currentRoomID}
                                </p>
                                <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">
                                    You&apos;re connected. The test will start when your teacher begins the session.
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-gray-400">Room announcements</h3>
                                <div className="max-h-40 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-gray-700 dark:bg-gray-800/60">
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
                        </div>
                    )}
                </div>
            </section>

            {/* Section 3: activity */}
            <section className="mt-12 border-t border-slate-200 pt-10 dark:border-gray-800">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        Your activity
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        Recent tests &amp; performance
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                        Pick a test to review your score and answers.
                    </p>
                </div>

                <Dashboard studentTestData={studentTests} studentPerformanceData={studentTestsWithPerformance} studentId={studentId} />
            </section>
        </main>

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