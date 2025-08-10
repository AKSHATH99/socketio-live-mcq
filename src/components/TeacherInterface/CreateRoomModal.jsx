'use client'
import { useState } from "react";
import { Copy } from "lucide-react";

const CreateRoomModal = ({ onCreateRoom, roomId, setRoomId, onClose, roomCreated }) => {
    const [copied, setCopied] = useState(false);
    const link = `/student/joinRoom?roomId=${roomId}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // reset after 2s
        } catch (err) {
            console.error("Copy failed", err);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 border-2 border- rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-xl text-black dark:text-white">Create your custom room</p>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
                        >
                            ×
                        </button>
                    )}
                </div>
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">Create your room and invite participants using id or share the link</p>
                <input
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full border-2 border-black dark:border-gray-600 px-3 py-2 mb-4 focus:outline-none focus:border-gray-600 dark:focus:border-gray-400 bg-white dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <button
                    className="w-full bg-black dark:bg-gray-700 text-white px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => {
                        if (onCreateRoom) {
                            onCreateRoom();
                        }
                    }}
                >
                    Create Room
                </button>
                <div className="mt-10">
                    {roomCreated && (
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <p className="font-semibold mb-2 text-black dark:text-white">Room created successfully!</p>
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded border dark:border-gray-600">
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{link}</span>
                                <button onClick={handleCopy} className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300">
                                    <Copy size={18} />
                                </button>
                                {copied && <span className="text-green-500 dark:text-green-400 text-sm">Copied!</span>}
                            </div>
                            <div className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                                Share this link with participants to join the room.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateRoomModal;