'use client'
import { useEffect, useState } from "react";
import { use } from "react";
import { Plus, Play, FileText, Trophy, BarChart3, Calendar, Hash, ChevronDown, ChevronUp } from "lucide-react";
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
    const [isTestLive , setIsTestLive] = useState(false);
    const [roomId , setRoomId] = useState("");
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
        if(!roomId) {
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

    useEffect(()=>{
        if(testEnded){
            setActiveTab("Test Results"); 
        }
    },[testEnded])

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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Test Header */}
                {testdata && (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
                        {/* Header Section */}
                        <div className="border-b border-gray-200 pb-8 mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Test Dashboard</span>
                                    </div>
                                    <h1 className="text-4xl font-bold text-black mb-4 leading-tight">{testdata.title}</h1>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">{testdata.description}</p>
                                </div>
                            </div>
                            
                            {/* Meta Information */}
                            <div className="flex items-center gap-8 text-sm">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Hash className="w-4 h-4 text-black" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-400 block">Test ID</span>
                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-md text-xs font-semibold text-black">{testdata.id}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-black" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-400 block">Created</span>
                                        <span className="text-black font-medium">{new Date(testdata.createdAt).toLocaleDateString('en-US', { 
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
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-4">
                                    <div className="flex items-center gap-3 text-black">
                                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {questions.length}
                                        </div>
                                        <div>
                                            <span className="font-bold text-lg block">
                                                {questions.length === 1 ? 'Question' : 'Questions'}
                                            </span>
                                            <span className="text-gray-600 text-sm">Total available</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setOpenQuestionModal(true)} 
                                    className="flex items-center gap-3 bg-white hover:bg-gray-50 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Question
                                </button>
                                
                                <button 
                                    disabled={questions.length === 0} 
                                    className={`flex items-center gap-3 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                        questions.length === 0 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-black hover:bg-gray-800 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                                    }`}
                                    onClick={() => startTest(testId)}
                                >
                                    <Play className="w-5 h-5" />
                                    Start Test
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-black">Test Management</h2>
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-white text-black shadow-md'
                                                : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                        }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
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
                                            <h3 className="text-lg font-semibold text-black">Questions Preview</h3>
                                            <button
                                                onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <span className="text-sm font-medium text-gray-600">
                                                    {showQuestionsPreview ? 'Hide' : 'Show'} Questions
                                                </span>
                                                {showQuestionsPreview ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        
                                        {showQuestionsPreview && (
                                            <div className="space-y-3">
                                                {questions.map((question, index) => (
                                                    <div key={question.id || index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-black hover:shadow-md transition-shadow">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <span className="text-black font-bold text-sm">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-800 flex-1 leading-relaxed">
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
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FileText className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-black mb-2">No Questions Available</h3>
                                        <p className="text-gray-500 text-lg mb-6">Questions will appear here once they are added to this test</p>
                                        <button 
                                            onClick={() => setOpenQuestionModal(true)} 
                                            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add Your First Question
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

            {/* Modal - Render at top level */}
            {openQuestionModal && (
                <AddQuestionModal onClose={() => setOpenQuestionModal(false)} testid={testId} />
            )}
            {openCreateRoomModal && (
                <CreateRoomModal onClose={() => setOpenCreateRoomModal(false)} />
            )}
        </div>
    );
}