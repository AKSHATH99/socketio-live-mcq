'use client'
import { useEffect, useState } from "react";
import { use } from "react";
import AddQuestionModal from "@/components/TestInterface/AddQuestionModal";
import LiveTest from "@/components/TestInterface/LiveTest";
import LeaderBoard from "@/components/TestInterface/LeaderBoard";
import TestResult from "@/components/TestInterface/TestResult";

export default function Test({ params }) {
    const unwrappedParams = use(params);
    const testId = unwrappedParams.slug;
    const [testdata, setTestdata] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);
    const [activeTab, setActiveTab] = useState("questions");
    const [isTestLive , setIsTestLive] = useState(false);
    const [roomId , setRoomId] = useState("");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                    <p className="text-slate-600 text-lg font-medium">Loading test...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "questions", label: "Questions", icon: "📝" },
        { id: "Live Test", label: "Start Test", icon: "🎯" },
        { id: "Test Results", label: "Results", icon: "📊" },
        { id: "Leaderboard", label: "Leaderboard", icon: "🏆" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Test Header */}
                {testdata && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8 backdrop-blur-sm bg-white/80">
                        {/* Header Section */}
                        <div className="border-b border-slate-200 pb-8 mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Test Dashboard</span>
                                    </div>
                                    <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{testdata.title}</h1>
                                    <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">{testdata.description}</p>
                                </div>
                            </div>
                            
                            {/* Meta Information */}
                            <div className="flex items-center gap-8 text-sm">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-xs">ID</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-400 block">Test ID</span>
                                        <span className="font-mono bg-slate-100 px-3 py-1 rounded-md text-xs font-semibold text-slate-700">{testdata.id}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 font-bold text-xs">📅</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-400 block">Created</span>
                                        <span className="text-slate-700 font-medium">{new Date(testdata.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex items-center justify-between">
                            {/* Question Count */}
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-6 py-4">
                                    <div className="flex items-center gap-3 text-blue-700">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {questions.length}
                                        </div>
                                        <div>
                                            <span className="font-bold text-lg block">
                                                {questions.length === 1 ? 'Question' : 'Questions'}
                                            </span>
                                            <span className="text-blue-600 text-sm">Total available</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setOpenQuestionModal(true)} 
                                    className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg border-2 border-slate-200 hover:border-slate-300"
                                >
                                    <div className="w-5 h-5 bg-slate-200 rounded-md flex items-center justify-center">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    Add Question
                                </button>
                                
                                <button 
                                    disabled={questions.length === 0} 
                                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                        questions.length === 0 
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                                    }`}
                                    onClick={() => startTest(testId)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m10 6h1a3 3 0 000-6h-1m-7 10a3 3 0 006 0" />
                                    </svg>
                                    Start Test
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900">Test Management</h2>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="text-sm">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "questions" && (
                            <div>
                                {/* Questions Preview */}
                                {questions.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-slate-900">Questions Preview</h3>
                                            <button
                                                onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                            >
                                                <span className="text-sm font-medium text-slate-600">
                                                    {showQuestionsPreview ? 'Hide' : 'Show'} Questions
                                                </span>
                                                <svg 
                                                    className={`w-4 h-4 transition-transform ${showQuestionsPreview ? 'rotate-180' : ''}`} 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        {showQuestionsPreview && (
                                            <div className="space-y-3">
                                                {questions.map((question, index) => (
                                                    <div key={question.id || index} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <span className="text-blue-600 font-bold text-sm">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-800 flex-1 leading-relaxed">
                                                                {question.question || question.text || 'Question text not available'}
                                                            </p>
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
                                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Questions Available</h3>
                                        <p className="text-slate-500 text-lg mb-6">Questions will appear here once they are added to this test</p>
                                        <button 
                                            onClick={() => setOpenQuestionModal(true)} 
                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Your First Question
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === "Live Test" && <LiveTest testid={testId} isTestLive={isTestLive} startTest={startTest} />}
                        {activeTab === "Test Results" && <TestResult testId={testId} />}
                        {activeTab === "Leaderboard" && <LeaderBoard testId={testId} />}
                    </div>
                </div>
            </div>

            {/* Modal - Render at top level */}
            {openQuestionModal && (
                <AddQuestionModal onClose={() => setOpenQuestionModal(false)} testid={testId} />
            )}
        </div>
    );
}