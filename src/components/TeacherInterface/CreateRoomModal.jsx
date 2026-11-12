'use client'
import { useState } from "react";
import { Check, Copy, Link2, X } from "lucide-react";

const CreateRoomModal = ({ roomId, onClose }) => {
    const [copied, setCopied] = useState("");
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const link = `${baseUrl}/student/joinRoom?roomId=${roomId}`;

    const handleCopy = async (value, field) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(field);
            setTimeout(() => setCopied(""), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Your room is ready
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                            Share this code or link with your students so they can join.
                        </p>
                    </div>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="mt-5">
                    <p className="text-xs font-medium text-slate-600 dark:text-gray-300">
                        Room code
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                        <code className="min-w-0 flex-1 truncate font-mono text-lg font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">
                            {roomId || "—"}
                        </code>
                        <button
                            type="button"
                            onClick={() => handleCopy(roomId, "code")}
                            aria-label="Copy room code"
                            title="Copy room code"
                            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-emerald-700 transition-colors hover:bg-white dark:text-emerald-400 dark:hover:bg-gray-900"
                        >
                            {copied === "code" ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-gray-500">
                        {copied === "code" ? "Room code copied." : "Students can enter this code to join."}
                    </p>
                </div>

                <div className="mt-3">
                    <p className="text-xs font-medium text-slate-600 dark:text-gray-300">
                        Invite link
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/50">
                        <Link2 className="h-4 w-4 flex-none text-slate-400 dark:text-gray-500" />
                        <span className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-gray-300">
                            {link}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCopy(link, "link")}
                            aria-label="Copy invite link"
                            title="Copy invite link"
                            className="grid h-7 w-7 flex-none place-items-center rounded-md text-slate-500 transition-colors hover:bg-white hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            {copied === "link" ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <Copy className="h-3.5 w-3.5" />
                            )}
                        </button>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-gray-500">
                        {copied === "link" ? "Invite link copied." : "Send this link to your class."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                >
                    Done
                </button>
            </div>
        </div>
    )
}

export default CreateRoomModal;
