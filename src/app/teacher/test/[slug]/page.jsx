'use client'
import { useEffect, useState } from "react";
import { use } from "react";
import { Plus, Play, FileText, Trophy, BarChart3, Calendar, Hash, ChevronDown, ChevronUp, HomeIcon } from "lucide-react";
import AddQuestionModal from "@/components/TestInterface/AddQuestionModal";
import LiveTest from "@/components/TestInterface/LiveTest";
import LeaderBoard from "@/components/TestInterface/LeaderBoard";
import TestResult from "@/components/TestInterface/TestResult";

import CreateRoomModal from "@/components/TeacherInterface/CreateRoomModal";
export default function Test({ params }) {
    const unwrappedParams = use(params);
    const testId = unwrappedParams.slug;
    const [testdata, setTestdata] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);
    const [activeTab, setActiveTab] = useState("questions");
    const [isTestLive, setIsTestLive] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [testEnded, setTestEnded] = useState(false);
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    const fetchTestDetails = async () => {
        try {
            const res = await fetch(`/api/get-test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: testId })
            });
            const data = await res.json();
            console.log(data);
            setTestdata(data);
        } catch (error) {
            console.error("Error fetching test details:", error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`/api/fetch-test-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ testId })
            });
            const data = await res.json();
            console.log(data);
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const startTest = async (testId) => {
        try {
            if (!roomId) {
                setOpenCreateRoomModal(true);
                return;
            }
            const res = await fetch("http://localhost:3000/api/live-test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    testid: testId,
                    roomId: roomId // or whatever variable you're using
                })
            });

            const data = await res.json();
            console.log("🚀 Test Started:", data);
            setIsTestLive(true);
        } catch (err) {
            console.error("❌ Failed to start test:", err);
        }
    };
    useEffect(() => {
        setRoomId(localStorage.getItem('roomId'));
        fetchQuestions();
        fetchTestDetails();
    }, [testId]);

    useEffect(() => {
        if (testEnded) {
            setActiveTab("Test Results");
        }
    }, [testEnded])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading test...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "questions", label: "Questions", icon: FileText },
        { id: "Live Test", label: "Start Test", icon: Play },
        { id: "Test Results", label: "Results", icon: BarChart3 },
        { id: "Leaderboard", label: "Leaderboard", icon: Trophy }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Fixed Header - Compact */}
                {testdata && (
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 py-4 dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            {/* Left side - Test info */}
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-black rounded-full dark:bg-white"></div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Test Management</span>
                                    </div>
                                    <h1 className="text-xl font-bold text-black dark:text-white">{testdata.title}</h1>
                                </div>

                                {/* Meta Information - Horizontal */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-black dark:bg-gray-800 dark:text-white">{testdata.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-black font-medium dark:text-white">{new Date(testdata.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-black font-bold dark:text-white">{questions.length} Questions</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Action buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setOpenQuestionModal(true)}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-black px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                </button>

                                <button
                                    disabled={questions.length === 0}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${questions.length === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                        : 'bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200'
                                        }`}
                                    onClick={() => startTest(testId)}
                                >
                                    <Play className="w-4 h-4" />
                                    Start Test
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Layout with Fixed Sidebar */}
                <div className="flex">
                    {/* Fixed Sidebar Navigation */}
                    <div className="w-64 min-h-screen bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-green-50 to-emerald-50  rounded-xl p-4 shadow-sm dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-800/50">
                                        <HomeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-green-800 dark:text-green-200">Room: {roomId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <nav className="p-4">
                            <div className="space-y-2">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${activeTab === tab.id
                                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span>{tab.label}</span>
                                            {activeTab === tab.id && (
                                                <div className="ml-auto w-2 h-2 bg-current rounded-full"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                            {/* Content Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const currentTab = tabs.find(tab => tab.id === activeTab);
                                        if (currentTab) {
                                            const IconComponent = currentTab.icon;
                                            return (
                                                <>
                                                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        {currentTab.label}
                                                    </h2>
                                                </>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === "questions" && (
                                    <div>
                                        {/* Questions Preview */}
                                        {questions.length > 0 && (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-black dark:text-white">Questions Overview</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage your test questions</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
                                                    >
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                            {showQuestionsPreview ? 'Collapse' : 'Expand'}
                                                        </span>
                                                        {showQuestionsPreview ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                {showQuestionsPreview && (
                                                    <div className="space-y-4">
                                                        {questions.map((question, index) => (
                                                            <div key={question.id || index} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm dark:bg-white dark:text-black">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-gray-800 leading-relaxed dark:text-gray-200">
                                                                            {question.question || question.text || 'Question text not available'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* No Questions State */}
                                        {questions.length === 0 && !loading && (
                                            <div className="text-center py-16">
                                                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 dark:bg-gray-800">
                                                    <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-black mb-2 dark:text-white">No Questions Added</h3>
                                                <p className="text-gray-500 text-base mb-8 max-w-md mx-auto dark:text-gray-400">
                                                    Start building your test by adding questions. Questions will appear here once added.
                                                </p>
                                                <button
                                                    onClick={() => setOpenQuestionModal(true)}
                                                    className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    Add First Question
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "Live Test" && <LiveTest testEnded={testEnded} setTestEnded={setTestEnded} testid={testId} setIsTestLive={setIsTestLive} isTestLive={isTestLive} startTest={startTest} />}
                                {activeTab === "Test Results" && <TestResult testId={testId} />}
                                {activeTab === "Leaderboard" && <LeaderBoard testId={testId} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {openQuestionModal && (
                <AddQuestionModal onClose={() => setOpenQuestionModal(false)} testid={testId} />
            )}
            {openCreateRoomModal && (
                <CreateRoomModal onClose={() => setOpenCreateRoomModal(false)} />
            )}
        </div>
    );
}