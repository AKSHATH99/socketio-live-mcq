'use client'
import { useState , useEffect } from 'react';

export default function JoinRoomModal({ isOpen, onClose, onJoinRoom, isJoining, joinRoomFromParams }) {
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        if (joinRoomFromParams) {
            setRoomId(joinRoomFromParams);
        }
    }, [joinRoomFromParams]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            onJoinRoom(roomId.trim());
            setRoomId("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">Join a Room</h2>
                        <button 
                            onClick={onClose}
                            disabled={isJoining}
                            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Code
                        </label>
                        <input 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center text-lg font-mono"
                            value={roomId} 
                            onChange={(e) => setRoomId(e.target.value.toUpperCase())} 
                            type="text" 
                            placeholder="Enter room code..."
                            disabled={isJoining}
                            autoFocus
                        />
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                        Ask your instructor for the room code to join the session.
                    </p>
                </form>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={isJoining}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!roomId.trim() || isJoining}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        {isJoining ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Joining...
                            </>
                        ) : (
                            'Join Room'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}