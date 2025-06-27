
'use client'
import Image from "next/image";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import QuestionsInput from "@/components/QuestionsInput";

export default function Teacher() {
  const socketRef = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""]
    }
  ]);

  const [testMeta, setTestMeta] = useState({
    title: "",
    description: ""
  });
  const [fetchedTest, setFetchedTest] = useState(null);




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
      const res = await fetch("http://localhost:3000/api/fetchTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testMeta) // ✅ directly use the object
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
        roomId: "quiz-123" // or whatever variable you're using
      })
    });

    const data = await res.json();
    console.log("🚀 Test Started:", data);
  } catch (err) {
    console.error("❌ Failed to start test:", err);
  }
};




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
      roomId: "quiz-123",
      questions: questionsWithTestId
    });
    
    console.log('Sent questions with testId:', currentTestId);
  }

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('connected from frontend', socket.id)
    })



    socket.on('receive-message', (data) => {
      console.log("📥 New message", data);
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.disconnect()
    }
  }, []);

  const createRoom = () => {
    console.log("CREATING THE ROOM BROOOOOOOOOO");
    socketRef.current.emit('join-room', 'quiz-123');
    socketRef.current.emit('send-message', {
      roomId: 'quiz-123',
      message: 'Hello quiz team'
    });
  };

  const sendMessage = () => {
    console.log("Sedinign message")
    socketRef.current.emit('send-message', {
      roomId: "quiz-123",
      message: message
    })

  }

  useEffect(() => {
    console.log("hiii")
    console.log(messages)
  }, [messages])



  return (
    <div className="text-red-700">
      <p > Hey Teacher , Welcome ! </p>
      <br />
      <button onClick={() => { createRoom() }} >
        Create
      </button>

      <p>Type you message here to send to the group</p>

      <input value={message} type="text" onChange={(e) => { setMessage(e.target.value) }} />


      <button onClick={() => { sendMessage() }} >
        Send message
      </button>

      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>

      <div>
        Create new test
        <input
          type="text"
          placeholder="Test Title"
          value={testMeta.title}
          onChange={(e) => setTestMeta({ ...testMeta, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Test Description"
          value={testMeta.description}
          onChange={(e) => setTestMeta({ ...testMeta, description: e.target.value })}
        />

        <div className="mt-10 p-4 border border-gray-500 rounded">
  <h2 className="text-black font-bold text-lg mb-4">Fetched Test Data:</h2>

  {fetchedTest && fetchedTest.length > 0 ? (
    <div className="space-y-4">
      {fetchedTest.map((test) => (
        <div key={test.id} className="p-4 border border-gray-300 rounded text-black">
          <h3 className="font-semibold text-lg">{test.title}</h3>
          <p className="text-sm text-gray-700">{test.description}</p>
          <p className="text-xs text-gray-500 mt-1">Created At: {new Date(test.createdAt).toLocaleString()}</p>

          <button
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={() => startTest(test.id)}
          >
            ▶ Start Test
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-700">No test fetched yet.</p>
  )}
</div>



        <button className="border border-black" onClick={() => { createTest() }}>
          Create test
        </button>

      </div>



      <QuestionsInput questions={questions} setQuestions={setQuestions} />


      <button onClick={() => { sendQuestions() }} className="border border-green-600 bg-green-500 text-white m-10 p-3">
        Send qustions
      </button>
    </div>
  );
}
