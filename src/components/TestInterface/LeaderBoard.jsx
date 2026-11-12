import { useEffect, useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";

const LeaderBoard = ({ testId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/get-leaderboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ testid: testId })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
            setError("Could not load the leaderboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [testId]);

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                        <Trophy className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                        Leaderboard
                    </h3>
                </div>
                <div className="mt-3 animate-pulse space-y-2">
                    {[0, 1, 2].map((row) => (
                        <div
                            key={row}
                            className="h-10 rounded-lg bg-slate-100 dark:bg-gray-800"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-gray-800">
                <p className="text-xs text-slate-500 dark:text-gray-400">{error}</p>
                <button
                    type="button"
                    onClick={fetchLeaderboard}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Trophy className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                    Leaderboard
                </h3>
                <button
                    type="button"
                    onClick={fetchLeaderboard}
                    aria-label="Refresh leaderboard"
                    className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                </button>
            </div>

            {leaderboard.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-gray-800 dark:text-gray-500">
                    No results yet.
                </p>
            ) : (
                <div className="mt-3 space-y-1">
                    {leaderboard.map((student, index) => {
                        const rank = index + 1;

                        return (
                            <div
                                key={student.studentId || index}
                                className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${
                                    rank === 1 ? "bg-slate-50 dark:bg-gray-800/50" : ""
                                }`}
                            >
                                <span
                                    className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] font-semibold ${
                                        rank === 1
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                >
                                    {rank}
                                </span>

                                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                    <span className="truncate text-sm font-medium text-slate-800 dark:text-gray-100">
                                        {student.studentName}
                                    </span>
                                    <span className="tabular-nums text-sm font-semibold text-slate-900 dark:text-white">
                                        {student.score}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-3 text-xs text-slate-400 dark:text-gray-500">
                {leaderboard.length} {leaderboard.length === 1 ? "result" : "results"}
            </p>
        </div>
    );
};

export default LeaderBoard;
