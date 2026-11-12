'use client'

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  DoorOpen,
  FileText,
  HomeIcon,
  Link2,
  Loader2,
  LogOut,
  MessageCircle,
  MessageSquare,
  Play,
  Plus,
  Send,
  Share2,
  Trophy,
  User,
  Users,
} from "lucide-react";
import LiveTest from "@/components/TestInterface/LiveTest";
import LeaderBoard from "@/components/TestInterface/LeaderBoard";
import TestResult from "@/components/TestInterface/TestResult";
import QuestionsPreview from "@/components/TestInterface/QuestionsPreview";
import CreateRoomModal from "@/components/TeacherInterface/CreateRoomModal";
import TeacherHeader from "@/components/TeacherInterface/TeacherHeader";
import { generateRoomCode } from "@/lib/roomCode";
import { useSocket } from "@/Contexts/SocketContexts";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TABS = [
  { id: "start", label: "Start test", icon: Play },
  { id: "questions", label: "Questions", icon: FileText },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Test({ params }) {
  const unwrappedParams = use(params);
  const testId = unwrappedParams.slug;
  const router = useRouter();
  const socket = useSocket();

  const [testdata, setTestdata] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("start");
  const [isTestLive, setIsTestLive] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  const [roomId, setRoomId] = useState("");
  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareMenuRef = useRef(null);
  const [liveStudentList, setLiveStudentList] = useState([]);
  const [allStudentsReady, setAllStudentsReady] = useState(false);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Teacher");

  const onlineStudents = Object.entries(liveStudentList || {}).filter(([, value]) => value);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId") || "");
    setTeacherName(localStorage.getItem("teacherName") || "Teacher");
    setRoomId(localStorage.getItem("roomId") || "");
  }, []);

  const fetchTestDetails = async () => {
    try {
      const res = await fetch(`/api/get-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: testId }),
      });
      const data = await res.json();
      setTestdata(data);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const fetchQuestions = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const res = await fetch(`/api/fetch-test-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId }),
      });
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testId) {
      fetchQuestions();
      fetchTestDetails();
    }
  }, [testId]);

  useEffect(() => {
    if (testEnded) {
      setActiveTab("results");
    }
  }, [testEnded]);

  useEffect(() => {
    if (testdata?.teacherId) {
      setTeacherId((prev) => prev || testdata.teacherId);
      if (!localStorage.getItem("teacherId")) {
        localStorage.setItem("teacherId", testdata.teacherId);
      }
    }
  }, [testdata]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data.message]);
    };
    const handleLobbyStatus = (data) => {
      setLiveStudentList(data);
    };
    const handleAllReady = () => {
      setAllStudentsReady(true);
    };

    socket.on("receive-message", handleMessage);
    socket.on("lobby-status", handleLobbyStatus);
    socket.on("all-students-ready", handleAllReady);

    return () => {
      socket.off("receive-message", handleMessage);
      socket.off("lobby-status", handleLobbyStatus);
      socket.off("all-students-ready", handleAllReady);
    };
  }, [socket]);

  useEffect(() => {
    if (!shareMenuOpen) return;

    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShareMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setShareMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [shareMenuOpen]);

  const startTest = async (id) => {
    try {
      if (!roomId) {
        createRoom();
        return;
      }

      const res = await fetch("/api/live-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testid: id,
          roomId: roomId,
        }),
      });

      await res.json();
      setIsTestLive(true);
    } catch (err) {
      console.error("❌ Failed to start test:", err);
    }
  };

  const createRoom = () => {
    const roomCode = generateRoomCode();

    if (roomId && roomId !== roomCode) {
      socket?.emit("leave-room", { roomId });
    }

    setRoomId(roomCode);
    socket?.emit("join-room", roomCode, teacherId, "teacher");
    socket?.emit("send-message", {
      roomId: roomCode,
      message: "Welcome! We will start the test shortly.",
    });
    localStorage.setItem("roomId", roomCode);
    setOpenCreateRoomModal(true);
  };

  const leaveRoom = () => {
    socket?.emit("leave-room", { roomId });

    localStorage.removeItem("roomId");
    setRoomId("");
    setLiveStudentList({});
    setAllStudentsReady(false);
  };

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    socket.emit("send-message", {
      roomId: roomId,
      message: message,
    });
    setMessage("");
  };

  const getInviteLink = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    return `${baseUrl}/student/joinRoom?roomId=${roomId}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getInviteLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleShare = async () => {
    const link = getInviteLink();
    setShareMenuOpen(false);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Join ${roomId}`,
          text: `Join my live test room ${roomId}`,
          url: link,
        });
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Share failed", err);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <TeacherHeader teacherId={teacherId} teacherName={teacherName} activeNav={false} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-3 w-28 rounded bg-slate-100 dark:bg-gray-800" />
            <div className="h-8 w-64 rounded bg-slate-100 dark:bg-gray-800" />
            <div className="h-4 w-64 rounded bg-slate-100 dark:bg-gray-800" />
            <div className="h-10 w-full max-w-md rounded bg-slate-100 dark:bg-gray-800" />
            <div className="h-72 rounded-2xl bg-slate-100 dark:bg-gray-800" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <TeacherHeader teacherId={teacherId} teacherName={teacherName} activeNav={false} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </button>

        <div className="mt-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {testdata?.title || "Untitled test"}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {testdata?.createdAt ? formatDate(testdata.createdAt) : "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {questions.length} {questions.length === 1 ? "question" : "questions"}
            </span>
          </div>
        </div>

        <div className="mt-4 border-b border-slate-200 dark:border-gray-800">
          <nav className="-mb-px flex gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex flex-none items-center gap-2.5 border-b-2 px-4 py-3.5 text-[15px] font-medium transition-colors ${
                    active
                      ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {tab.label}
                  {tab.id === "questions" && questions.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {questions.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-5">
          {activeTab === "start" && (
            roomId ? (
              <div>
                <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-slate-200 bg-slate-50/80 px-5 py-5 dark:border-gray-800 dark:bg-gray-800/40 sm:px-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-emerald-100 bg-emerald-50/50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <DoorOpen className="h-4 w-4" />
                      </span>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                        {roomId}
                      </h2>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        aria-label="Copy room code"
                        title="Copy room code"
                        className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                      >
                        {copiedCode ? (
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                      <div className="relative" ref={shareMenuRef}>
                        <button
                          type="button"
                          onClick={() => setShareMenuOpen((open) => !open)}
                          aria-haspopup="menu"
                          aria-expanded={shareMenuOpen}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                        >
                          {copied ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Share2 className="h-3.5 w-3.5" />
                          )}
                          {copied ? "Link copied" : "Share"}
                          <ChevronDown
                            className={`h-3 w-3 transition-transform ${
                              shareMenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {shareMenuOpen && (
                          <div
                            role="menu"
                            className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                handleCopy();
                                setShareMenuOpen(false);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              <Link2 className="h-3.5 w-3.5 text-slate-400 dark:text-gray-500" />
                              Copy link
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={handleShare}
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              <Share2 className="h-3.5 w-3.5 text-slate-400 dark:text-gray-500" />
                              Share via apps
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={leaveRoom}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Leave room
                      </button>
                    </div>
                  </div>

                  <div className="border-b border-slate-200 px-5 py-5 dark:border-gray-800 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-sm dark:border-emerald-500/20 dark:bg-gray-900 dark:text-emerald-400">
                          <Play className="h-4 w-4" />
                        </span>
                        <div>
                          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Live test
                          </h2>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                            Questions and scores update in real time
                          </p>
                        </div>
                      </div>
                      {isTestLive && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Live
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <LiveTest
                        testEnded={testEnded}
                        setTestEnded={setTestEnded}
                        testid={testId}
                        testData={testdata}
                        setIsTestLive={setIsTestLive}
                        isTestLive={isTestLive}
                        startTest={startTest}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-slate-200 bg-white text-emerald-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-400">
                            <MessageSquare className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              Class chat
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                              Message everyone in the room
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 min-h-[9rem] max-h-56 overflow-y-auto">
                        {messages.length > 0 ? (
                          <div className="divide-y divide-slate-100 dark:divide-gray-800">
                            {messages.map((msg, idx) => (
                              <div key={idx} className="flex items-start gap-3 py-3">
                                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
                                  T
                                </span>
                                <p className="text-sm text-slate-700 dark:text-gray-200">{msg}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex h-[9rem] flex-col items-center justify-center px-4 text-center">
                            <MessageCircle className="h-5 w-5 text-slate-300 dark:text-gray-600" />
                            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                              No messages yet
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-gray-500">
                              Start the conversation with your class.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Message your class..."
                          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                        />
                        <button
                          type="button"
                          onClick={sendMessage}
                          disabled={!message.trim()}
                          aria-label="Send message"
                          className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-8 dark:lg:border-gray-800">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-slate-200 bg-white text-emerald-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-400">
                            <Users className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              Connected students
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                              Students in this room
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            <Users className="h-3 w-3 text-slate-400 dark:text-gray-500" />
                            {onlineStudents.length} online
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              allStudentsReady
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "border-slate-200 bg-white text-slate-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                allStudentsReady
                                  ? "bg-emerald-500"
                                  : "bg-slate-400 dark:bg-gray-500"
                              }`}
                            />
                            {allStudentsReady ? "All ready" : "Waiting"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 min-h-[9rem] max-h-56 divide-y divide-slate-100 overflow-y-auto dark:divide-gray-800">
                        {onlineStudents.length > 0 ? (
                          onlineStudents.map(([key]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between gap-3 py-2.5"
                            >
                              <div className="flex min-w-0 items-center gap-2.5">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400">
                                  <User className="h-3.5 w-3.5" />
                                </span>
                                <span className="truncate text-sm text-slate-800 dark:text-gray-100">
                                  {key}
                                </span>
                              </div>
                              <span className="inline-flex flex-none items-center gap-1.5 text-xs text-slate-400 dark:text-gray-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Online
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex h-[9rem] flex-col items-center justify-center px-4 text-center">
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                              Waiting for students
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-gray-500">
                              They&apos;ll appear here as they join.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live session
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      Start test and create room
                    </h2>
                    <p className="mt-2 max-w-lg text-sm text-slate-500 dark:text-gray-400">
                      Create a room, share the invite link with your class, then start the
                      test when everyone has joined.
                    </p>

                    <ol className="mt-5 space-y-3">
                      {[
                        "Create a room for this test session.",
                        "Share the room code or invite link with your students.",
                        "Start the test once your students are online and ready.",
                      ].map((step, index) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 text-sm text-slate-600 dark:text-gray-300"
                        >
                          <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 dark:bg-gray-800 dark:text-gray-400">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {questions.length === 0 && (
                      <p className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        <FileText className="h-3.5 w-3.5" />
                        Add at least one question before starting the test.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-100 bg-white text-emerald-600 shadow-sm dark:border-emerald-500/20 dark:bg-gray-900 dark:text-emerald-400">
                      <HomeIcon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                      No active room
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                      Create a room to get a code and an invite link for your students.
                    </p>
                    <button
                      type="button"
                      onClick={createRoom}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                      Create room
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {activeTab === "questions" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <QuestionsPreview
                questions={questions}
                testId={testId}
                onRefresh={() => fetchQuestions(true)}
              />
            </div>
          )}

          {activeTab === "results" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <TestResult testId={testId} />
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
              <LeaderBoard testId={testId} />
            </div>
          )}
        </div>
      </main>

      {openCreateRoomModal && (
        <CreateRoomModal
          roomId={roomId}
          onClose={() => setOpenCreateRoomModal(false)}
        />
      )}
    </div>
  );
}
