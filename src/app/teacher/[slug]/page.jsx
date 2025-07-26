'use client'
import Image from "next/image";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { Users, Wifi, WifiOff, Calendar, Play, MessageSquare, Send, Plus, FileText, MessageCircle, Monitor, Settings, LogOut } from "lucide-react";
// import QuestionsInput from "@/components/QuestionsInput";
import CreateRoomModal from "@/components/TeacherInterface/CreateRoomModal";
import CreateTestModal from "@/components/TeacherInterface/CreateTestModal";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggler";
import { useSocket } from "@/Contexts/SocketContexts";


export default function Teacher({ params }) {
  const router = useRouter();
  const teacherId = params.slug;
  const socketRef = useRef();

  const settingsRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [fetchedTest, setFetchedTest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [roomId, setRoomId] = useState("");

  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openCreateTestModal, setOpenCreateTestModal] = useState(false);
  const [allStudentsReady, setAllStudentsReady] = useState()
  const [liveStudentList, setLiveStudentList] = useState([])
  const [roomCreated, setRoomCreated] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""]
    }
  ]);

  const [testMeta, setTestMeta] = useState({
    title: "",
    description: "",
    teacherId: teacherId
  });

  const socket = useSocket();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setOpenSettingsModal(false);
      }
    };

    if (openSettingsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSettingsModal]);
  // Fetch teacher data when component mounts
  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/teacher/${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.teacher) {
        setTeacherData(data.teacher);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };


  useEffect(() => {
    if (teacherId) {
      fetchTests();
      fetchTeacherData();
    }
  }, [teacherId]);

  useEffect(() => {
    const storedRoomId = localStorage.getItem('roomId');
    if (storedRoomId) {
      setRoomId(storedRoomId);
      console.log("Joined room with ID:", storedRoomId);
    }
  }, []);


  const createTest = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testMeta) // ✅ directly use the object
      });

      const data = await res.json();
      console.log("✅ Test Created:", data);

      await fetchTests();

      setTestMeta({
        title: "",
        description: ""
      });

    } catch (error) {
      console.error("❌ Error creating test:", error);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/get-teacher-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: teacherId }) // ✅ directly use the object
      });

      const data = await res.json();
      console.log("✅ Fetched data:", data);

      setFetchedTest(data);

    } catch (error) {
      console.error("❌ Error creating test:", error);
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
    } catch (err) {
      console.error("❌ Failed to start test:", err);
    }
  };


  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/get-leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ testid: "0046b553-a37f-4145-9105-65ddfcb90ae6" }) // ✅ directly use the object
      });
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard", error);
    }
  };

  useEffect(() => {
    setInterval(function () {

    }, 5000);
  })

  useEffect(() => {
    console.log(leaderboard)
  }, [leaderboard])




  // ----------------------SOCKET IO------------------------------------------------------
  const sendQuestions = () => {
    if (!fetchedTest || fetchedTest.length === 0) {
      console.error('No test selected');
      return;
    }
    const currentTestId = fetchedTest[0].id;

    // Add testId to each question before sending
    const questionsWithTestId = questions.map(q => ({
      ...q,
      testId: currentTestId
    }));

    socket.emit('send-questions', {
      roomId: roomId,
      questions: questionsWithTestId
    });

    console.log('Sent questions with testId:', currentTestId);
  }

  useEffect(() => {
    if (!socket) return;
    // const socket = io();
    // socketRef.current = socket;

    socket.on('connect', () => {
      console.log('connected from frontend', socket.id);
      // Join the room immediately after connection
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
      // Update your state here if needed
      setLiveStudentList(data)
    });

    socket.on('all-students-ready', (data) => {
      console.log("all students ready", data);
      setAllStudentsReady(true);
    })

    // Handle reconnection
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
    console.log("CREATING THE ROOM BROOOOOOOOOO", roomId);
    socket.emit('join-room', roomId, teacherId, 'teacher');
    socket.emit('send-message', {
      roomId: roomId,
      message: 'Hello quiz team'
    });
    localStorage.setItem('roomId', roomId);
    setRoomCreated(true);
  };

  const leaveRoom = () => {
    console.log("LEAVING THE ROOM BROOOOOOOOOO", roomId);
    if (!roomId || !socket) return;

    socket.emit('leave-room', { roomId });

    localStorage.removeItem('roomId');
    setRoomId('');
    setRoomCreated(false);
    setLiveStudentList({});
    setAllStudentsReady(false);
    console.log("🚪 Left room:", roomId);
  };


  const sendMessage = () => {
    console.log("Sending message")
    socket.emit('send-message', {
      roomId: roomId,
      message: message
    })

  }

  useEffect(() => {
    console.log("hiii")
    console.log(messages)
  }, [messages])



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Teacher Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!roomId ? (
                <button
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  onClick={() => setOpenCreateRoomModal(true)}
                >
                  <Plus size={16} />
                  Create Room
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2 dark:bg-red-500 dark:hover:bg-red-400"
                  onClick={() => {

                    leaveRoom()

                  }}
                >
                  <LogOut size={16} />
                  Leave Room
                </button>
              )}
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={() => setOpenCreateTestModal(true)}
              >
                <Plus size={16} />
                Create Test
              </button>

              {/* Settings dropdown container with relative positioning and ref */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setOpenSettingsModal(!openSettingsModal)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Settings dropdown menu */}
                {openSettingsModal && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                    {/* Logout option */}
                    <button
                      className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                      onClick={() => {
                        setOpenSettingsModal(false);
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                    {/* Theme toggle section */}
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Theme
                        </span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Details */}
            <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor size={20} className="text-gray-600 dark:text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room Management</h2>
                  </div>
                  {/* Room Status moved here */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${roomId ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                      {roomId ? <Wifi size={20} className="text-green-600 dark:text-green-400" /> : <WifiOff size={20} className="text-red-600 dark:text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {roomId ? "Connected" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Room ID</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                      {roomId || "No active room"}
                    </code>
                  </div>
                </div>

                {/* Student List */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Connected Students</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Object.values(liveStudentList).filter(Boolean).length} online
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(liveStudentList).map(([key, value]) => (
                      value ? (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center dark:bg-gray-700">
                              <User size={14} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{key}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
                          </div>
                        </div>
                      ) : null
                    ))}

                    {Object.values(liveStudentList).filter(Boolean).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No students connected</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`p-4 rounded-lg border ${allStudentsReady ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${allStudentsReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {allStudentsReady ? "All students ready" : "Waiting for students"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Panel - Only when room exists */}
            {roomId && (
              <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Class Communication</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message to the class..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
                    />
                    <button
                      onClick={() => sendMessage()}
                      className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-64 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                    <div className="space-y-3">
                      {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border-l-4 border-black dark:bg-gray-700 dark:border-white">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center dark:bg-white">
                                <span className="text-white text-xs font-bold dark:text-black">T</span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200">{msg}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                          <div className="text-center">
                            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No messages yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tests */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-600 dark:text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Tests</h2>
                  </div>
                  {/* Test count moved here */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                      <FileText size={16} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      {/* <p className="text-xs text-gray-600 dark:text-gray-400">Total</p> */}
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {fetchedTest ? fetchedTest.length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {fetchedTest && fetchedTest.length > 0 ? (
                  <div className="space-y-3">
                    {fetchedTest.map((test) => (
                      <div
                        key={test.id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:border-gray-700 dark:hover:bg-gray-800"
                        onClick={() => { router.push(`/teacher/test/${test.id}`) }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-gray-800">
                            <FileText size={16} className="text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                              {test.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                              {test.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                                <Calendar size={10} />
                                <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText size={32} className="mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">No tests created yet</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Create your first test to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {openCreateRoomModal && (
          <CreateRoomModal
            onCreateRoom={() => {
              createRoom();
              // setOpenCreateRoomModal(false);
            }}
            roomId={roomId}
            setRoomId={setRoomId}
            onClose={() => setOpenCreateRoomModal(false)}
            roomCreated={roomCreated}
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
      </div>
    </div>
  );
}