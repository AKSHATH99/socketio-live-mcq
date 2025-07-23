import { useEffect, useState } from "react";
import { Trophy, Target, BookOpen, Calendar, User, Award } from "lucide-react";

export default function Dashboard({ studentTestData, studentPerformanceData }) {

  const testData = studentTestData || sampleTestData;
  const performanceData = studentPerformanceData || samplePerformanceData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'text-emerald-600 bg-emerald-50';
    if (numScore >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getProgressColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'bg-emerald-500';
    if (numScore >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const averageScore = performanceData?.tests?.length > 0
    ? (performanceData.tests.reduce((sum, test) => sum + parseFloat(test.performance.score), 0) / performanceData.tests.length).toFixed(1)
    : 0;

  const totalQuestions = performanceData?.tests?.reduce((sum, test) => sum + test.performance.questionsAttempted, 0);

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black mt-10">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Tests Completed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{testData.count}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Average Score</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{averageScore}%</p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Questions Solved</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalQuestions}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tests */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Tests</h2>
                <span className="bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                  {testData.count} total
                </span>
              </div>

              <div className="space-y-4">
                {testData?.tests?.map((test) => (
                  <div key={test.id} className="group border border-slate-200 dark:border-gray-600 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {test.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {test.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                            <span className="text-sm text-slate-600 dark:text-gray-400">{test.teacher.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                            <span className="text-sm text-slate-600 dark:text-gray-400">{formatDate(test.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Results */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Performance Results</h2>
                <Award className="w-6 h-6 text-slate-600 dark:text-gray-400" />
              </div>

              <div className="space-y-6">
                {performanceData?.tests?.map((test) => (
                  <div key={test.id} className="border border-slate-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{test.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{test.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-slate-500 dark:text-gray-400">By {test.teacher.name}</span>
                          <span className="text-sm text-slate-500 dark:text-gray-400">•</span>
                          <span className="text-sm text-slate-500 dark:text-gray-400">{formatDate(test.createdAt)}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(test.performance.score)}`}>
                        {test.performance.score}%
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center bg-slate-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{test.performance.questionsAttempted}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Questions</p>
                      </div>
                      <div className="text-center bg-emerald-50 dark:bg-emerald-900 rounded-lg p-3">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{test.performance.correctAnswers}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Correct</p>
                      </div>
                      <div className="text-center bg-red-50 dark:bg-red-900 rounded-lg p-3">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                          {test.performance.questionsAttempted - test.performance.correctAnswers}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Incorrect</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Accuracy</span>
                        <span className="text-sm text-slate-600 dark:text-gray-400">
                          {test.performance.correctAnswers}/{test.performance.questionsAttempted}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(test.performance.score)}`}
                          style={{ width: `${test.performance.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}