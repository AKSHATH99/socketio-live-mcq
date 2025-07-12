
'use client'
import Image from "next/image";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
// import QuestionsInput from "@/components/QuestionsInput";
import CreateRoomModal from "@/components/TeacherInterface/CreateRoomModal";
import CreateTestModal from "@/components/TeacherInterface/CreateTestModal";
import { useRouter } from "next/navigation";

export default function Teacher({ params }) {
  const router = useRouter();
  const teacherId = params.slug;
  const socketRef = useRef();

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

    socketRef.current.emit('send-questions', {
      roomId: roomId,
      questions: questionsWithTestId
    });

    console.log('Sent questions with testId:', currentTestId);
  }

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

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
      socket.disconnect()
    }
  }, []);

  const createRoom = () => {
    console.log("CREATING THE ROOM BROOOOOOOOOO", roomId);
    socketRef.current.emit('join-room', roomId, teacherId, 'teacher');
    socketRef.current.emit('send-message', {
      roomId: roomId,
      message: 'Hello quiz team'
    });
    localStorage.setItem('roomId', roomId);
  };

  const sendMessage = () => {
    console.log("Sedinign message")
    socketRef.current.emit('send-message', {
      roomId: roomId,
      message: message
    })

  }

  useEffect(() => {
    console.log("hiii")
    console.log(messages)
  }, [messages])



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Hey Teacher, Welcome!
              </h1>
              <p className="text-gray-600">Manage your classroom and assignments</p>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setOpenCreateRoomModal(true)}
              >
                + Create Room
              </button>
              <button
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setOpenCreateTestModal(true)}
              >
                + Create Test
              </button>
            </div>
          </div>
        </div>

        {/* Room Management */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${allStudentsReady ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">Student Status</span>
              </div>
              <div>
                {Object.entries(liveStudentList).map(([key, value]) => (
                  value ? (
                    <li key={key}>
                      <p className={`text-sm font-medium text-gray-700 ${value ? 'text-green-500' : 'text-yellow-500'}`}>{key}</p>
                    </li>
                  ) : null
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {allStudentsReady ? "All students are ready" : "Waiting for students"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${roomId ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">Room Status</span>
              </div>
              <p className="text-sm text-gray-600">
                {roomId ? `Joined: ${roomId}` : "Not Joined"}
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        {openCreateRoomModal && (
          <CreateRoomModal
            onCreateRoom={() => {
              createRoom();
              setOpenCreateRoomModal(false);
            }}
            roomId={roomId}
            setRoomId={setRoomId}
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

        {/* Tests Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Tests</h2>

          {fetchedTest && fetchedTest.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fetchedTest.map((test) => (
                <div
                  key={test.id}
                  className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => { router.push(`/teacher/test/${test.id}`) }}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                      {test.description}
                    </p>
                    <div className="mt-auto">
                      <p className="text-xs text-gray-500 mb-3">
                        Created: {new Date(test.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        className="w-full bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          startTest(test.id);
                        }}
                      >
                        ▶ Start Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No tests created yet</p>
              <p className="text-sm text-gray-400">Create your first test to get started</p>
            </div>
          )}
        </div>

        {/* Communication Panel */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Class Communication</h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">Type your message here to send to the group</p>

            {/* Message Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <button
                onClick={() => sendMessage()}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Send
              </button>
            </div>

            {/* Messages Display */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-medium text-gray-900 mb-3">Messages:</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border-l-4 border-black">
                      <p className="text-sm text-gray-800">{msg}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No messages yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
