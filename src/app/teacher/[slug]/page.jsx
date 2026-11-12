'use client'

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  DoorOpen,
  FileText,
  Link2,
  Loader2,
  LogOut,
  MessageCircle,
  MessageSquare,
  Monitor,
  Plus,
  Send,
  Share2,
  User,
  Users,
} from "lucide-react";
import CreateRoomModal from "@/components/TeacherInterface/CreateRoomModal";
import CreateTestModal from "@/components/TeacherInterface/CreateTestModal";
import TeacherHeader from "@/components/TeacherInterface/TeacherHeader";
import { generateRoomCode } from "@/lib/roomCode";
import { getTestVisual } from "@/lib/testVisuals";
import { useSocket } from "@/Contexts/SocketContexts";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Teacher({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const teacherId = resolvedParams.slug;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [fetchedTest, setFetchedTest] = useState(null);
  const [roomId, setRoomId] = useState("");

  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openCreateTestModal, setOpenCreateTestModal] = useState(false);
  const [allStudentsReady, setAllStudentsReady] = useState(false);
  const [liveStudentList, setLiveStudentList] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareMenuRef = useRef(null);

  const [testMeta, setTestMeta] = useState({
    title: "",
    description: "",
    teacherId: teacherId,
  });

  const socket = useSocket();
  const onlineStudents = Object.entries(liveStudentList || {}).filter(([, value]) => value);

  useEffect(() => {
    if (teacherId) {
      fetchTests();
    }
  }, [teacherId]);

  useEffect(() => {
    if (!teacherId) {
      router.push("teacher/auth/signin");
      return;
    }

    const storedRoomId = localStorage.getItem("roomId");
    if (storedRoomId) {
      setRoomId(storedRoomId);
    }

    const storedName = localStorage.getItem("teacherName");
    if (storedName) {
      setTeacherName(storedName);
    }
  }, []);

  const createTest = async () => {
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testMeta),
      });

      const data = await res.json();
      console.log("✅ Test Created:", data);

      await fetchTests();

      setTestMeta({
        title: "",
        description: "",
        teacherId: teacherId,
      });
    } catch (error) {
      console.error("❌ Error creating test:", error);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await fetch("/api/get-teacher-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: teacherId }),
      });

      const data = await res.json();
      setFetchedTest(data);
    } catch (error) {
      console.error("❌ Error fetching tests:", error);
    }
  };

  // ----------------------SOCKET IO------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('connected from frontend', socket.id);
      if (roomId) {
        socket.emit('join-room', roomId, teacherId, 'teacher');
      }
    });

    socket.on('receive-message', (data) => {
      console.log("📥 New message", data);
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on('lobby-status', (data) => {
      console.log("lobby status", data);
      setLiveStudentList(data);
    });

    socket.on('all-students-ready', (data) => {
      console.log("all students ready", data);
      setAllStudentsReady(true);
    });

    socket.on('reconnect', () => {
      console.log('Reconnected to server');
      if (roomId) {
        socket.emit('join-room', roomId, teacherId, 'teacher');
      }
    });

    return () => {
      // socket.disconnect()
    }
  }, [socket]);

  const createRoom = () => {
    const roomCode = generateRoomCode();

    if (roomId && roomId !== roomCode) {
      socket?.emit('leave-room', { roomId });
    }

    setRoomId(roomCode);
    socket?.emit('join-room', roomCode, teacherId, 'teacher');
    socket?.emit('send-message', {
      roomId: roomCode,
      message: 'Hello quiz team'
    });
    localStorage.setItem('roomId', roomCode);
    setOpenCreateRoomModal(true);
  };

  const leaveRoom = () => {
    if (!roomId || !socket) return;

    socket.emit('leave-room', { roomId });

    localStorage.removeItem('roomId');
    setRoomId('');
    setLiveStudentList({});
    setAllStudentsReady(false);
    console.log("🚪 Left room:", roomId);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('send-message', {
      roomId: roomId,
      message: message,
    });
    setMessage("");
  };

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

  const sortedTests = [...(fetchedTest || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <TeacherHeader teacherId={teacherId} teacherName={teacherName} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Teacher dashboard
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome back{teacherName && teacherName !== "Teacher" ? `, ${teacherName}` : ""}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
              Start a live session, add a test, and keep an eye on your class in real time.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-none">
            <button
              type="button"
              onClick={createRoom}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <Monitor className="h-4 w-4" />
              Create room
            </button>
          </div>
        </section>

        {/* Active room */}
        {roomId && (
          <section className="mt-10">
            <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-t-2xl border-b border-slate-200 bg-slate-50/80 px-5 py-5 dark:border-gray-800 dark:bg-gray-800/40 sm:px-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-sm dark:border-emerald-500/20 dark:bg-gray-900 dark:text-emerald-400">
                    <DoorOpen className="h-5 w-5" />
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
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
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
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Leave room
                  </button>
                </div>
              </div>

              <div className="grid divide-y divide-slate-200 dark:divide-gray-800 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
                {/* Connected students */}
                <div className="bg-slate-50/70 p-5 dark:bg-gray-800/30 sm:p-6 lg:col-span-2">
                  <div className="flex items-start justify-between gap-3">
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
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      {onlineStudents.length} online
                    </span>
                  </div>

                  <div className="mt-4 min-h-[9rem] max-h-56 space-y-2 overflow-y-auto pr-1">
                    {onlineStudents.length > 0 ? (
                      onlineStudents.map(([key]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900"
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
                      <div className="flex h-[9rem] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
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

                  {onlineStudents.length > 0 && (
                    <div
                      className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
                        allStudentsReady
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-slate-200 bg-white text-slate-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          allStudentsReady ? "bg-emerald-500" : "bg-slate-400 dark:bg-gray-500"
                        }`}
                      />
                      {allStudentsReady ? "All students ready" : "Waiting for students"}
                    </div>
                  )}
                </div>

                {/* Live chat */}
                <div className="flex flex-col p-5 sm:p-6 lg:col-span-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-slate-200 bg-white text-emerald-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-400">
                        <MessageSquare className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Live chat
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                          Message everyone in the room
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <div className="mt-4 min-h-[9rem] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/80 dark:border-gray-700 dark:bg-gray-800/40">
                    {messages.length > 0 ? (
                      <div className="divide-y divide-slate-200 dark:divide-gray-700">
                        {messages.map((msg, idx) => (
                          <div key={idx} className="flex items-start gap-3 px-4 py-3">
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
                      aria-label="Send message"
                      className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Your tests */}
        <section className={roomId ? "mt-10 border-t border-slate-200 pt-10 dark:border-gray-800" : "mt-10"}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Select a test to start
                </h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-gray-800 dark:text-gray-400">
                  {sortedTests.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Pick a test to add questions and start it live for your class.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenCreateTestModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              New test
            </button>
          </div>

          {sortedTests.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedTests.map((test, index) => {
                const ThumbnailIcon = getTestVisual(test);

                return (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => router.push(`/teacher/test/${test.id}`)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-black/20"
                  >
                    <div className="relative h-16 overflow-hidden border-b border-slate-100 bg-slate-50 dark:border-gray-800 dark:bg-gray-800/40">
                      <span className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-slate-100 dark:bg-gray-800" />
                      <span className="absolute -bottom-8 -left-3 h-20 w-20 rounded-full bg-slate-100/70 dark:bg-gray-800/70" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-100 bg-white text-emerald-600 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-emerald-500/20 dark:bg-gray-900 dark:text-emerald-400">
                          <ThumbnailIcon className="h-4 w-4" strokeWidth={1.6} />
                        </span>
                      </span>
                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full border border-emerald-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/30 dark:bg-gray-900 dark:text-emerald-400">
                          Recent
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                        {test.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-gray-400">
                        {test.description || "No description added yet."}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(test.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          Start test
                          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-gray-800 dark:text-gray-500">
                <FileText className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                No tests yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-gray-400">
                Create your first test to add questions and start a live session.
              </p>
              <button
                type="button"
                onClick={() => setOpenCreateTestModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Create test
              </button>
            </div>
          )}
        </section>

        {/* Modals */}
        {openCreateRoomModal && (
          <CreateRoomModal
            roomId={roomId}
            onClose={() => setOpenCreateRoomModal(false)}
          />
        )}

        {openCreateTestModal && (
          <CreateTestModal
            onCreateTest={() => {
              createTest();
              setOpenCreateTestModal(false);
            }}
            testMeta={testMeta}
            setTestMeta={setTestMeta}
            onClose={() => setOpenCreateTestModal(false)}
          />
        )}
      </main>
    </div>
  );
}
