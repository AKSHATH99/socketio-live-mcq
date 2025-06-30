'use client'
import { useState } from "react";

const CreateRoomModal = ({ onCreateRoom, roomId, setRoomId, onClose }) => {
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
            </div>
        </div>
    )
}

export default CreateRoomModal;