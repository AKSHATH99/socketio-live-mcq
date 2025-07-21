import { useEffect, useState } from "react";
import { Trophy, Target, BookOpen, Calendar, User, Award } from "lucide-react";

export default function Dashboard({ studentTestData, studentPerformanceData }) {
  // Sample data for demonstration
//   const sampleTestData = {
//     "message": "Tests fetched successfully",
//     "tests": [
//       {
//         "id": "1d3dd96c-5cb5-46fe-b734-983e44247e3a",
//         "title": "JavaScript Fundamentals",
//         "description": "Basic JavaScript concepts and syntax",
//         "createdAt": "2025-07-05T04:33:44.587Z",
//         "teacherId": "8f4a0efa-ac91-4da0-a63f-9e3604ce9294",
//         "teacher": {
//           "name": "Akshath",
//           "email": "akshathpkk@gmail.com"
//         }
//       },
//       {
//         "id": "2d3dd96c-5cb5-46fe-b734-983e44247e3b",
//         "title": "React Basics",
//         "description": "Introduction to React components and hooks",
//         "createdAt": "2025-07-03T04:33:44.587Z",
//         "teacherId": "8f4a0efa-ac91-4da0-a63f-9e3604ce9294",
//         "teacher": {
//           "name": "Sarah Wilson",
//           "email": "sarah@example.com"
//         }
//       }
//     ],
//     "count": 2
//   };

//   const samplePerformanceData = {
//     "message": "Tests fetched successfully",
//     "tests": [
//       {
//         "id": "1d3dd96c-5cb5-46fe-b734-983e44247e3a",
//         "title": "JavaScript Fundamentals",
//         "description": "Basic JavaScript concepts and syntax",
//         "createdAt": "2025-07-05T04:33:44.587Z",
//         "teacherId": "8f4a0efa-ac91-4da0-a63f-9e3604ce9294",
//         "teacher": {
//           "name": "Akshath",
//           "email": "akshathpkk@gmail.com"
//         },
//         "questions": [
//           {"id": "c10028e7-6b63-4efa-834e-fbe86d40cc0f"},
//           {"id": "36f3352b-d655-4f9b-8ab1-455aafce2e03"}
//         ],
//         "performance": {
//           "questionsAttempted": 8,
//           "correctAnswers": 7,
//           "totalQuestions": 2,
//           "score": "87.50"
//         }
//       },
//       {
//         "id": "2d3dd96c-5cb5-46fe-b734-983e44247e3b",
//         "title": "React Basics",
//         "description": "Introduction to React components and hooks",
//         "createdAt": "2025-07-03T04:33:44.587Z",
//         "teacherId": "8f4a0efa-ac91-4da0-a63f-9e3604ce9294",
//         "teacher": {
//           "name": "Sarah Wilson",
//           "email": "sarah@example.com"
//         },
//         "questions": [
//           {"id": "q1"}, {"id": "q2"}, {"id": "q3"}
//         ],
//         "performance": {
//           "questionsAttempted": 10,
//           "correctAnswers": 6,
//           "totalQuestions": 3,
//           "score": "60.00"
//         }
//       }
//     ],
//     "count": 2
//   };

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
    <div className=" bg-gradient-to-br from-slate-50 to-slate-100 mt-10">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tests Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{testData.count}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{averageScore}%</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Questions Solved</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalQuestions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tests */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Tests</h2>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                  {testData.count} total
                </span>
              </div>
              
              <div className="space-y-4">
                {testData?.tests?.map((test) => (
                  <div key={test.id} className="group border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {test.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {test.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">{test.teacher.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">{formatDate(test.createdAt)}</span>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Performance Results</h2>
                <Award className="w-6 h-6 text-slate-600" />
              </div>
              
              <div className="space-y-6">
                {performanceData?.tests?.map((test) => (
                  <div key={test.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{test.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{test.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-slate-500">By {test.teacher.name}</span>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-500">{formatDate(test.createdAt)}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(test.performance.score)}`}>
                        {test.performance.score}%
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center bg-slate-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-slate-900">{test.performance.questionsAttempted}</p>
                        <p className="text-sm text-slate-600">Questions</p>
                      </div>
                      <div className="text-center bg-emerald-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-emerald-600">{test.performance.correctAnswers}</p>
                        <p className="text-sm text-slate-600">Correct</p>
                      </div>
                      <div className="text-center bg-red-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-red-600">
                          {test.performance.questionsAttempted - test.performance.correctAnswers}
                        </p>
                        <p className="text-sm text-slate-600">Incorrect</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Accuracy</span>
                        <span className="text-sm text-slate-600">
                          {test.performance.correctAnswers}/{test.performance.questionsAttempted}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
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