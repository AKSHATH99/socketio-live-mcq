import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Loader2, Clock, Trophy, Users } from "lucide-react";

const LiveTest = ({ testid, isTestLive, startTest }) => {
    const socketRef = useRef();
    const [roomId, setRoomId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [testId, setTestId] = useState(testid);

    useEffect(() => {
        setTestId(testid);
        const socket = io();
        socketRef.current = socket;
        const currentRoom = localStorage.getItem('roomId');

        socket.emit('join-room', currentRoom);

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

        setRoomId(currentRoom);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            socket.disconnect();
        };
    }, []);

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Room: {roomId}</span>
                        <span className={`px-2 py-1 rounded text-sm ${isTestLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isTestLive ? 'Live' : 'Ready'}
                        </span>
                    </div>
                </div>

                {/* Split Layout - Always rendered */}
                <div className={`bg-white rounded-lg shadow overflow-hidden ${!isTestLive ? 'blur-sm' : ''}`}>
                    <div className="flex min-h-[600px]">
                        {/* Left Section - Questions */}
                        <div className="flex-1 p-6">
                            {/* Questions Header with Timer */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <Clock className="w-5 h-5 mr-2" />
                                        Questions
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1" >Here you can view live questions as it is sent to students in  your room</p>
                                </div>
                                {/* Timer Display - Fixed Position */}
                                {isTestLive && getCurrentQuestion() && timeLeft > 0 && (
                                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-600">
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {isTestLive ? (
                                    questions.map((question, index) => (
                                        <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800">
                                                        Q{index + 1}: {question.question}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Answer: {question.answer}
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-3 ml-4">
                                                    {/* Current question indicator */}
                                                    {index === currentQuestionIndex && (
                                                        <div className="flex items-center space-x-2">
                                                            {timeLeft > 0 ? (
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                                            ) : (
                                                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                            )}
                                                            {/* <span className="text-xs text-blue-600 font-medium">
                                                                {timeLeft > 0 ? 'Active' : 'Processing...'}
                                                            </span> */}
                                                        </div>
                                                    )}

                                                    {/* Completed question indicator */}
                                                    {index < currentQuestionIndex && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                            <span className="text-xs text-green-600 font-medium">
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
                                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                                        <p className="text-gray-600">Waiting for questions...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vertical Border */}
                        <div className="w-px bg-gray-200"></div>

                        {/* Right Section - Leaderboard */}
                        <div className="flex-1 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Trophy className="w-5 h-5 mr-2" />
                                Live Leaderboard
                            </h2>


                            <button 
                                className="border border-black rounded-lg px-4 py-2 mb-4 hover:bg-gray-100 transition-colors" 
                                onClick={() => { fetchLeaderboard() }}
                            >
                                Refresh Leaderboard
                            </button>
                            <div className="space-y-3">
                                {isTestLive ? (
                                    leaderboard.length > 0 ? (
                                        <table className="min-w-full border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100 border-b">
                                                    <th className="text-left p-2 border-r">#</th>
                                                    <th className="text-left p-2 border-r">Student ID</th>
                                                    <th className="text-left p-2">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaderboard.map((entry, index) => (
                                                    <tr key={entry.studentId} className="border-b">
                                                        <td className="p-2 border-r">{index + 1}</td>
                                                        <td className="p-2 border-r">{entry.studentId}</td>
                                                        <td className="p-2">{entry.score}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No leaderboard data available</p>
                                            <p className="text-sm text-gray-400 mt-1">Click refresh to update</p>
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay Start Test Button */}
                {!isTestLive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <div className="text-center">
                            <button
                                onClick={() => startTest(testid)}
                                className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105 text-lg font-medium"
                            >
                                Start Test
                            </button>
                            <p className="text-white mt-3 text-sm">Click to begin the live test session</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTest;