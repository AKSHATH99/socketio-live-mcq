'use client';
import { useEffect, useState } from "react";
import { Loader2, LogIn, Users } from "lucide-react";

const JoinRoomPage = () => {
    const [roomId, setRoomId] = useState("");
    const [status, setStatus] = useState("checking"); // checking, redirectingToLogin, redirectingToRoom
    const [message, setMessage] = useState("Checking authentication status...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("roomId");
        setRoomId(id || "");

        // Simulate checking authentication
        setTimeout(() => {
            const isStudentLoggedIn = localStorage?.getItem("studentId");

            if (!isStudentLoggedIn) {
                setStatus("redirectingToLogin");
                setMessage("Authentication required. Redirecting to login...");

                // Simulate redirect delay
                setTimeout(() => {
                    window.location.href = `/student/auth/signin?redirect=joinRoom&roomId=${id}`;
                    console.log(`Redirecting to: /student/auth/signin?redirect=joinRoom&roomId=${id}`);
                }, 2000);
            } else {
                setStatus("redirectingToRoom");
                setMessage("Let's get you aboard! Joining the room...");

                // Simulate redirect delay
                setTimeout(() => {
                    window.location.href = `/student/${isStudentLoggedIn}?joinRoom=${id}`;
                    console.log(`Redirecting to: /student/${isStudentLoggedIn}?joinRoom=${id}`);
                }, 2000);
            }
        }, 1000);
    }, []);

    const getIcon = () => {
        switch (status) {
            case "checking":
                return <Loader2 className="w-8 h-8 animate-spin text-gray-600" />;
            case "redirectingToLogin":
                return <LogIn className="w-8 h-8 text-gray-600" />;
            case "redirectingToRoom":
                return <Users className="w-8 h-8 text-gray-600" />;
            default:
                return <Loader2 className="w-8 h-8 animate-spin text-gray-600" />;
        }
    };

    const getSubMessage = () => {
        switch (status) {
            case "checking":
                return "Verifying your session and room details";
            case "redirectingToLogin":
                return "You'll be redirected to sign in to continue";
            case "redirectingToRoom":
                return "Taking you to your dashboard";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* Main Icon */}
                    <div className="flex justify-center">
                        {getIcon()}
                    </div>
                    {/* Main Message */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {message}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {getSubMessage()}
                        </p>
                    </div>
                    {/* Room ID Display */}
                    {roomId && (
                        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Room ID:</span>
                                <code className="text-sm font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                    {roomId}
                                </code>
                            </div>
                        </div>
                    )}
                    {/* Footer */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please wait while we process your request
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomPage;