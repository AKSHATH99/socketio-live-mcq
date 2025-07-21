'use client'
import { useState } from "react";
import { Copy } from "lucide-react";

const CreateRoomModal = ({ onCreateRoom, roomId, setRoomId, onClose, roomCreated }) => {
    const [copied, setCopied] = useState(false);
    const link = `http://localhost:3000/student/joinRoom?roomId=${roomId}`

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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white border-2 border- rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-xl text-black">Create your custom room</p>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-black hover:text-gray-600 text-xl font-bold"
                        >
                            ×
                        </button>
                    )}
                </div>
                <p className="text-slate-600 text-sm mb-6">Create your room and invite participants using id or share the link</p>
                <input
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full border-2 border-black px-3 py-2 mb-4 focus:outline-none focus:border-gray-600"
                />
                <button
                    className="w-full bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
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
                        <div className="p-4 bg-green-100 rounded-lg">
                            <p className="font-semibold mb-2">Room created successfully!</p>

                            <div className="flex items-center gap-2 bg-white p-2 rounded border">
                                <span className="text-sm text-gray-700 truncate">{link}</span>
                                <button onClick={handleCopy} className="hover:text-blue-600">
                                    <Copy size={18} />
                                </button>
                                {copied && <span className="text-green-500 text-sm">Copied!</span>}
                            </div>

                            <div className="text-sm mt-2 text-gray-600">
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