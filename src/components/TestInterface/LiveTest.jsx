import { useEffect, useRef, useState } from "react";
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    Play,
    RefreshCw,
    Trophy,
    User,
    Users,
    X,
} from "lucide-react";
import { useSocket } from "@/Contexts/SocketContexts";

const LiveTest = ({ testid, isTestLive, startTest, testEnded, setTestEnded, testData }) => {
    const [roomId, setRoomId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [testId, setTestId] = useState(testid);
    const [showLobby, setShowLobby] = useState(false);
    const [liveStudentList, setLiveStudentList] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        setTestId(testid);

        if (!socket) return;

        const currentRoom = localStorage.getItem("roomId");

        if (currentRoom) {
            socket.emit("join-room", currentRoom);
            socket.emit("lobby-status-update", currentRoom);
        }

        const handleConnect = () => {
            console.log("connected from teacher side", socket.id);
        };

        const handleQuestion = (newQuestion) => {
            const questionToAdd = Array.isArray(newQuestion) ? newQuestion[0] : newQuestion;

            setQuestions((prev) => [...prev, questionToAdd]);

            if (questionToAdd?.timer) {
                setTimeLeft(questionToAdd.timer);

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }

                timerRef.current = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        };

        const handleTestEnded = () => {
            setTestEnded(true);
        };

        const handleLobbyStatus = (data) => {
            setLiveStudentList(data);
        };

        socket.on("connect", handleConnect);
        socket.on("recieve-questions", handleQuestion);
        socket.on("test-ended", handleTestEnded);
        socket.on("lobby-status", handleLobbyStatus);

        setRoomId(currentRoom);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            socket.off("connect", handleConnect);
            socket.off("recieve-questions", handleQuestion);
            socket.off("test-ended", handleTestEnded);
            socket.off("lobby-status", handleLobbyStatus);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        if (showLobby && testData) {
            socket.emit("open-student-lobby", { testData, roomId: roomId });
        }
        if (showLobby === false) {
            socket.emit("close-student-lobby", { roomId: roomId });
        }
    }, [showLobby, testData]);

    const formatDate = (dateString) => {
        if (!dateString) return "—";

        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getCurrentQuestion = () => questions[currentQuestionIndex];

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch("/api/get-live-leaderboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testId: testId }),
            });
            const data = await res.json();
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
        }
    };

    const onlineStudents = Object.entries(liveStudentList || {}).filter(([, value]) => value);

    return (
        <div>
            {isTestLive || testEnded ? (
            <div className="relative">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="grid lg:grid-cols-2">
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                        <Clock className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                                        Live questions
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                                        Questions appear here as they are sent to students.
                                    </p>
                                </div>

                                {isTestLive && getCurrentQuestion() && timeLeft > 0 && (
                                    <span className="inline-flex flex-none items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatTime(timeLeft)}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 space-y-2.5">
                                {isTestLive &&
                                    questions.map((question, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-3 dark:border-gray-800 dark:bg-gray-800/50"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-gray-100">
                                                        Q{index + 1}: {question.question}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                                                        Answer: {question.answer}
                                                    </p>
                                                </div>

                                                <div className="flex flex-none items-center gap-2">
                                                    {index === currentQuestionIndex && (
                                                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                                            {timeLeft > 0 ? (
                                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            ) : (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            )}
                                                            Active
                                                        </span>
                                                    )}
                                                    {index < currentQuestionIndex && (
                                                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-500">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-gray-600" />
                                                            Done
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                {isTestLive && questions.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center dark:border-gray-800">
                                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-emerald-500" />
                                        <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
                                            Waiting for questions...
                                        </p>
                                    </div>
                                )}

                                {!isTestLive && (
                                    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center dark:border-gray-800">
                                        <Play className="mx-auto h-5 w-5 text-slate-300 dark:text-gray-600" />
                                        <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
                                            Questions will appear once the test starts.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 p-5 dark:border-gray-800 lg:border-l lg:border-t-0">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                    <Trophy className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                                    Live leaderboard
                                </h2>
                                <button
                                    type="button"
                                    onClick={fetchLeaderboard}
                                    aria-label="Refresh leaderboard"
                                    className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="mt-3">
                                {isTestLive ? (
                                    leaderboard.length > 0 ? (
                                        <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 dark:divide-gray-800 dark:border-gray-800">
                                            {leaderboard.map((entry, index) => (
                                                <div
                                                    key={`${entry.studentId}-${index}`}
                                                    className="flex items-center gap-3 px-3 py-2.5"
                                                >
                                                    <span
                                                        className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] font-semibold ${
                                                            index === 0
                                                                ? "bg-emerald-600 text-white"
                                                                : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                                        }`}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-gray-200">
                                                        {entry.studentId}
                                                    </span>
                                                    <span className="tabular-nums text-sm font-semibold text-slate-900 dark:text-white">
                                                        {entry.score}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center dark:border-gray-800">
                                            <Users className="mx-auto h-5 w-5 text-slate-300 dark:text-gray-600" />
                                            <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
                                                No leaderboard data yet. Refresh to update.
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center dark:border-gray-800">
                                        <Trophy className="mx-auto h-5 w-5 text-slate-300 dark:text-gray-600" />
                                        <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
                                            Scores will appear here while the test is live.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {testEnded && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-slate-900/40 px-4">
                        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-xl dark:border-gray-700 dark:bg-gray-900">
                            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </span>
                            <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                                Test completed
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                                Great work. Your results are ready.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            ) : (
                <div className="flex min-h-[14rem] flex-col items-center justify-center px-6 py-8 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-600 shadow-sm dark:border-emerald-500/20 dark:bg-gray-900 dark:text-emerald-400">
                        <Play className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                        Ready to begin?
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-gray-400">
                        Make sure your students have joined the room, then start the test when everyone is ready.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowLobby(true)}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                    >
                        <Play className="h-4 w-4" />
                        Start test
                    </button>
                </div>
            )}

            {showLobby && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-gray-800">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Start live test
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
                                    Check that your class is ready before you begin.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLobby(false)}
                                aria-label="Close"
                                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
                                <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                    Start when all students have joined.
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLobby(false);
                                        startTest(testid);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                                >
                                    <Play className="h-4 w-4" />
                                    Start test
                                </button>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-200 p-3.5 dark:border-gray-800">
                                    <FileText className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                        Test
                                    </p>
                                    <p className="mt-0.5 truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {testData?.title}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-3.5 dark:border-gray-800">
                                    <Calendar className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                        Created
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
                                        {formatDate(testData?.createdAt)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-3.5 dark:border-gray-800">
                                    <Users className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                        Students online
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
                                        {onlineStudents.length} connected
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 p-3.5 dark:border-gray-800">
                                    <div className="flex items-start gap-2">
                                        <FileText className="mt-0.5 h-4 w-4 flex-none text-slate-400 dark:text-gray-500" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-700 dark:text-gray-200">
                                                Description
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                                                {testData?.description || "No description added."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-3.5 dark:border-gray-800">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                                            <p className="text-xs font-medium text-slate-700 dark:text-gray-200">
                                                Connected students
                                            </p>
                                        </div>
                                        <span className="text-[11px] text-slate-400 dark:text-gray-500">
                                            {onlineStudents.length} online
                                        </span>
                                    </div>

                                    <div className="mt-2 max-h-28 space-y-1.5 overflow-y-auto">
                                        {onlineStudents.length > 0 ? (
                                            onlineStudents.map(([key]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5 dark:bg-gray-800/50"
                                                >
                                                    <span className="flex min-w-0 items-center gap-2">
                                                        <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-slate-200 text-slate-500 dark:bg-gray-700 dark:text-gray-400">
                                                            <User className="h-2.5 w-2.5" />
                                                        </span>
                                                        <span className="truncate text-xs text-slate-700 dark:text-gray-200">
                                                            {key}
                                                        </span>
                                                    </span>
                                                    <span className="flex flex-none items-center gap-1 text-[11px] text-slate-400 dark:text-gray-500">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Online
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="py-3 text-center text-xs text-slate-400 dark:text-gray-500">
                                                No students connected yet.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveTest;
