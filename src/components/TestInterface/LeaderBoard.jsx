import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Users, RefreshCw } from "lucide-react";

const LeaderBoard = ({ testId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);
        console.log("fetching leaderboard");
        
        try {
            const res = await fetch("http://localhost:3000/api/get-leaderboard", {
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
            console.log(data);
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
            setError("Failed to load leaderboard. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [testId]);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
            case 3:
                return <Award className="w-5 h-5 text-amber-600" />;
            default:
                return <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-400">#{rank}</span>;
        }
    };

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700";
            case 2:
                return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600";
            case 3:
                return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700";
            default:
                return "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600";
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Loading Leaderboard...</h1>
                </div>
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 dark:bg-gray-600 rounded mb-2"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="text-red-500 dark:text-red-400 mb-4">
                        <Users className="w-12 h-12 mx-auto mb-2" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Leaderboard</h1>
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={fetchLeaderboard}
                        className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Retry</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Leaderboard</h1>
                </div>
                <button
                    onClick={fetchLeaderboard}
                    className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No results yet. Be the first to take the test!</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {leaderboard.map((student, index) => {
                                const rank = index + 1;
                                return (
                                    <tr 
                                        key={student.studentId}
                                        className={`border-l-4 transition-all duration-200 ${getRankStyle(rank)}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                {getRankIcon(rank)}
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {rank === 1 && "🥇"}
                                                    {rank === 2 && "🥈"}
                                                    {rank === 3 && "🥉"}
                                                    {rank > 3 && `#${rank}`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {student.studentName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 mr-2">
                                                    {student.score}
                                                </span>
                                                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ 
                                                            width: `${Math.min((student.score / (leaderboard[0]?.score || 100)) * 100, 100)}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Showing {leaderboard.length} {leaderboard.length === 1 ? 'result' : 'results'}
            </div>
        </div>
    );
};

export default LeaderBoard;