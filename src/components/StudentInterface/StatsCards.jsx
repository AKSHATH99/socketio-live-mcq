import { ClipboardCheck, ListChecks, TrendingUp } from "lucide-react";

export default function StatsCards({ studentTestData, studentPerformanceData }) {
  const tests = studentPerformanceData?.tests || [];

  const testsCompleted =
    studentTestData?.count ?? studentTestData?.tests?.length ?? 0;

  const averageScore = tests.length
    ? (
        tests.reduce(
          (sum, test) => sum + parseFloat(test.performance?.score || 0),
          0
        ) / tests.length
      ).toFixed(1)
    : null;

  const questionsSolved = tests.reduce(
    (sum, test) => sum + (test.performance?.questionsAttempted || 0),
    0
  );

  const stats = [
    {
      label: "Tests Completed",
      value: testsCompleted,
      hint: "Finished assessments",
      icon: ClipboardCheck,
      tone: "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
    },
    {
      label: "Average Score",
      value: averageScore !== null ? `${averageScore}%` : "0%",
      hint: "Across all tests",
      icon: TrendingUp,
      tone: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
    },
    {
      label: "Questions Solved",
      value: questionsSolved,
      hint: "Across all attempts",
      icon: ListChecks,
      tone: "bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                {stat.hint}
              </p>
            </div>
            <span
              className={`grid h-11 w-11 flex-none place-items-center rounded-xl ring-1 ring-inset ${stat.tone}`}
            >
              <stat.icon className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
