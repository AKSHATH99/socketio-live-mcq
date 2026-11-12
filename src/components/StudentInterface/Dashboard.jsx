import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  ListChecks,
  User,
} from "lucide-react";
import LeaderBoard from "../TestInterface/LeaderBoard";
import SingleStudentTestResultDetails from "./DetailedResult";
import { getTestVisual } from "@/lib/testVisuals";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const scoreStroke = (score) => {
  const num = Number(score) || 0;
  if (num >= 80) return "stroke-emerald-500";
  if (num >= 60) return "stroke-amber-500";
  return "stroke-red-500";
};

function ScoreRing({ score }) {
  const value = Math.min(Math.max(Number(score) || 0, 0), 100);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-16 w-16 flex-none">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          className="stroke-slate-100 dark:stroke-gray-800"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${scoreStroke(score)} transition-all duration-500`}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-slate-900 dark:text-white">
        {value}%
      </span>
    </div>
  );
}

export default function Dashboard({ studentTestData, studentPerformanceData, studentId }) {
  const testData = studentTestData;
  const performanceData = studentPerformanceData;

  const [selectedTestId, setSelectedTestId] = useState(null);

  useEffect(() => {
    if (!selectedTestId && performanceData?.tests?.length) {
      const latest = performanceData.tests[performanceData.tests.length - 1];
      setSelectedTestId(latest.id);
    }
  }, [performanceData, selectedTestId]);

  const selectedTest = selectedTestId
    ? performanceData?.tests?.find((test) => test.id === selectedTestId)
    : null;

  const SelectedIcon = selectedTest ? getTestVisual(selectedTest) : BarChart3;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Recent tests */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent tests
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-gray-800 dark:text-gray-400">
            {testData?.count || 0} total
          </span>
        </div>

        {testData?.tests?.length ? (
          <div className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto dark:divide-gray-800">
            {testData.tests.map((test) => {
              const active = selectedTestId === test.id;
              const TestIcon = getTestVisual(test);

              return (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => setSelectedTestId(test.id)}
                  className={`group flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${
                    active
                      ? "bg-emerald-50/60 dark:bg-emerald-500/5"
                      : "hover:bg-slate-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 flex-none place-items-center rounded-lg border transition-colors ${
                      active
                        ? "border-emerald-200 bg-white text-emerald-600 dark:border-emerald-500/30 dark:bg-gray-900 dark:text-emerald-400"
                        : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300 group-hover:text-slate-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200"
                    }`}
                  >
                    <TestIcon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm font-medium ${
                        active
                          ? "text-emerald-800 dark:text-emerald-300"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {test.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(test.createdAt)}
                      </span>
                    </span>
                  </span>
                  <ChevronRight
                    className={`mt-1 h-4 w-4 flex-none transition-colors ${
                      active
                        ? "text-emerald-500"
                        : "text-slate-300 group-hover:text-slate-400 dark:text-gray-600 dark:group-hover:text-gray-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-500 dark:text-gray-400">No tests yet</p>
          </div>
        )}
      </div>

      {/* Performance */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:col-span-3">
        {!selectedTest ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-gray-800 dark:text-gray-500">
              <BarChart3 className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
              No test selected
            </p>
            <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-gray-400">
              Choose a test from the list to review your score and answers.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-gray-800 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-sm dark:border-emerald-500/20 dark:bg-gray-900 dark:text-emerald-400">
                    <SelectedIcon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                      {selectedTest.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-gray-400">
                      {selectedTest.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedTest.teacher.name}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(selectedTest.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ScoreRing score={selectedTest.performance.score} />
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 dark:divide-gray-800 dark:border-gray-800">
              {[
                { label: "Questions", value: selectedTest.performance.questionsAttempted },
                {
                  label: "Correct",
                  value: selectedTest.performance.correctAnswers,
                  tone: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "Incorrect",
                  value:
                    selectedTest.performance.questionsAttempted -
                    selectedTest.performance.correctAnswers,
                  tone: "text-red-600 dark:text-red-400",
                },
              ].map((stat) => (
                <div key={stat.label} className="px-5 py-4 text-center">
                  <p
                    className={`text-lg font-semibold tabular-nums ${
                      stat.tone || "text-slate-900 dark:text-white"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 px-5">
              <LeaderBoard testId={selectedTest.id} />
            </div>

            <details className="group mt-5 border-t border-slate-100 dark:border-gray-800">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-gray-300">
                  <ListChecks className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                  Detailed answers
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180 dark:text-gray-500" />
              </summary>

              <div className="px-5 pb-5">
                <SingleStudentTestResultDetails
                  testId={selectedTest.id}
                  studentId={studentId}
                />
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
