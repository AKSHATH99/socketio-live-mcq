import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Loader2, Clock, Trophy, Users, Play, User , Shield ,FileText, Calendar, X} from "lucide-react";
import { useSocket } from "@/Contexts/SocketContexts";

const LiveTest = ({ testid, isTestLive, startTest, setIsTestLive, testEnded, setTestEnded, testData }) => {
    // const socketRef = useRef();
    const [roomId, setRoomId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [testId, setTestId] = useState(testid);
    const [showLobby, setShowLobby] = useState(false);
    const [liveStudentList, setLiveStudentList] = useState([])
    const socket = useSocket();

    useEffect(() => {
        if (testData) {
            console.log("Test data received:", testData);
        };
    }, []);

    useEffect(() => {
        setTestId(testid);
        // const socket = io();
        // socketRef.current = socket;
        const currentRoom = localStorage.getItem('roomId');

        socket.emit('join-room', currentRoom);

        socket.emit('lobby-status-update', currentRoom);

        socket.on('connect', () => {
            console.log('connected from teacher side', socket.id);
        });

        socket.on("recieve-questions", (newQuestion) => {
            console.log("📬 Received question:", newQuestion);

            const questionToAdd = Array.isArray(newQuestion) ? newQuestion[0] : newQuestion;

            setQuestions(prev => [...prev, questionToAdd]);

            // Start timer for the new question
            if (questionToAdd.timer) {
                setTimeLeft(questionToAdd.timer);

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }

                timerRef.current = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        });

        socket.on("test-ended", (roomId, testId) => {
            console.log("Test ended for room:", roomId);
            console.log("Test ID:", testId);
            // setIsTestLive(false);
            setTestEnded(true);
        });

        socket.on('lobby-status', (data) => {
            console.log("lobby status", data);
            // Update your state here if needed
            setLiveStudentList(data)
        });

        setRoomId(currentRoom);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            // socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        if (showLobby && testData) {
            console.log("showing lobby");
            console.log("test data in lobby", testData);
            socket.emit('open-student-lobby', { testData, roomId: roomId });
        }
        if(showLobby=== false) {
            socket.emit('close-student-lobby', { roomId: roomId });
        }
    }, [showLobby, testData]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getCurrentQuestion = () => {
        return questions[currentQuestionIndex];
    };

    const fetchLeaderboard = async () => {
        console.log("fetching leaderboard")
        try {
            const res = await fetch("http://localhost:3000/api/get-live-leaderboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ testId: testId }) // ✅ directly use the object
            });
            const data = await res.json();
            console.log(data)
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Room: {roomId}</span>
                        <span className={`px-2 py-1 rounded text-sm ${isTestLive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {isTestLive ? 'Live' : 'Ready'}
                        </span>
                    </div>
                </div>

                {/* Split Layout - Always rendered */}
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${!isTestLive ? 'blur-sm' : ''}`}>
                    <div className="flex min-h-[600px]">
                        {/* Left Section - Questions */}
                        <div className="flex-1 p-6">
                            {/* Questions Header with Timer */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                                        <Clock className="w-5 h-5 mr-2" />
                                        Questions
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" >Here you can view live questions as it is sent to students in  your room</p>
                                </div>
                                {/* Timer Display - Fixed Position */}
                                {isTestLive && getCurrentQuestion() && timeLeft > 0 && (
                                    <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {isTestLive ? (
                                    questions.map((question, index) => (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800 dark:text-gray-100">
                                                        Q{index + 1}: {question.question}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        Answer: {question.answer}
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-3 ml-4">
                                                    {/* Current question indicator */}
                                                    {index === currentQuestionIndex && (
                                                        <div className="flex items-center space-x-2">
                                                            {timeLeft > 0 ? (
                                                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                                                            ) : (
                                                                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                                                            )}
                                                            {/* <span className="text-xs text-blue-600 font-medium">
                                                                {timeLeft > 0 ? 'Active' : 'Processing...'}
                                                            </span> */}
                                                        </div>
                                                    )}

                                                    {/* Completed question indicator */}
                                                    {index < currentQuestionIndex && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                                                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                                Completed
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : null}

                                {/* Waiting for first question - only show when live */}
                                {isTestLive && questions.length === 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                                        <p className="text-gray-600 dark:text-gray-400">Waiting for questions...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vertical Border */}
                        <div className="w-px bg-gray-200 dark:bg-gray-700"></div>

                        {/* Right Section - Leaderboard */}
                        <div className="flex-1 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                                <Trophy className="w-5 h-5 mr-2" />
                                Live Leaderboard
                            </h2>


                            <button
                                className="border border-black dark:border-gray-600 rounded-lg px-4 py-2 mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-black dark:text-white"
                                onClick={() => { fetchLeaderboard() }}
                            >
                                Refresh Leaderboard
                            </button>
                            <div className="space-y-3">
                                {isTestLive ? (
                                    leaderboard.length > 0 ? (
                                        <table className="min-w-full border border-gray-300 dark:border-gray-600">
                                            <thead>
                                                <tr className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                                                    <th className="text-left p-2 border-r dark:border-gray-600 text-gray-800 dark:text-gray-100">#</th>
                                                    <th className="text-left p-2 border-r dark:border-gray-600 text-gray-800 dark:text-gray-100">Student ID</th>
                                                    <th className="text-left p-2 text-gray-800 dark:text-gray-100">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaderboard.map((entry, index) => (
                                                    <tr className="border-b dark:border-gray-600">
                                                        <td className="p-2 border-r dark:border-gray-600 text-gray-800 dark:text-gray-200">{index + 1}</td>
                                                        <td className="p-2 border-r dark:border-gray-600 text-gray-800 dark:text-gray-200">{entry.studentId}</td>
                                                        <td className="p-2 text-gray-800 dark:text-gray-200">{entry.score}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                                            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                            <p className="text-gray-500 dark:text-gray-400">No leaderboard data available</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click refresh to update</p>
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay Start Test Button */}
                {!isTestLive && !testEnded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-50 rounded-lg">
                        <div className="text-center">
                            <button
                                // onClick={() => startTest(testid)}
                                onClick={() => { setShowLobby(true); }}

                                className="px-8 py-4 bg-black dark:bg-gray-700 text-white rounded-xl shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition transform hover:scale-105 text-lg font-medium"
                            >
                                <Play className="inline-block mr-2" />
                                Start Test
                            </button>
                            <p className="text-white mt-3 text-sm">Click to begin the live test session</p>
                        </div>
                    </div>
                )}
                {
                    showLobby && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200">
                                {/* Header */}
                                <div className="bg-gray-900 text-white rounded-t-xl px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <X onClick={() => setShowLobby(false)} className="w-5 h-5 text-gray-400 hover:text-gray-200 cursor-pointer" />
                                        {/* <div className="flex items-center gap-3">
                                            <div className="bg-gray-700 p-2 rounded-lg">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-semibold">Admin Lobby</h2>
                                        </div> */}
                                        <div className="flex items-center gap-2 text-sm">
                                            {/* <Clock className="w-4 h-4" /> */}
                                            {/* <span>Ready to start</span> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Status and Action */}
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                            <span className="text-gray-700 font-medium">
                                                You are about to start the test. Please ensure all students are ready.
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowLobby(false);
                                                startTest(testid);
                                            }}
                                            className="px-6 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start Test
                                        </button>
                                    </div>

                                    {/* Test Details Grid */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <FileText className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm">Test Title</h3>
                                                <p className="text-gray-700 text-sm">{testData?.title}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm">Created</h3>
                                                <p className="text-gray-700 text-sm">{formatDate(testData?.createdAt)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <Users className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm">Students Online</h3>
                                                <p className="text-gray-700 text-sm">
                                                    {Object.values(liveStudentList).filter(Boolean).length} connected
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Description */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm mb-1">Description</h4>
                                                    <p className="text-gray-700 text-sm">{testData?.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connected Students */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-600" />
                                                    <h4 className="font-medium text-gray-900 text-sm">Connected Students</h4>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {Object.values(liveStudentList).filter(Boolean).length} online
                                                </span>
                                            </div>

                                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                                {Object.entries(liveStudentList).map(([key, value]) => (
                                                    value ? (
                                                        <div key={key} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                                                    <User size={12} className="text-gray-600" />
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">{key}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <span className="text-xs text-gray-600">Online</span>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                ))}

                                                {Object.values(liveStudentList).filter(Boolean).length === 0 && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        <Users size={24} className="mx-auto mb-1 opacity-50" />
                                                        <p className="text-xs">No students connected</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 rounded-b-xl px-6 py-3 border-t border-gray-200">
                                    <p className="text-center text-sm text-gray-600">
                                        Click "Start Test" when all students are ready and connected
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
                {testEnded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 dark:bg-black dark:bg-opacity-80 rounded-lg">
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
                            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Test Completed!</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">You've successfully completed the test. Redirecting to results...</p>
                            <div className="flex justify-center items-center space-x-2">
                                <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Preparing your results</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTest;