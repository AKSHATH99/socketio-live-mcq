"use client";

import { useState } from "react";
import { Check, Loader2, Pencil, Plus, Timer, X } from "lucide-react";

const TIMER_VALUES = [5, 10, 15, 20];

const createEmptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  timer: 10,
  answerIndex: null,
});

const buildInitialDraft = (question) => {
  if (!question) return createEmptyQuestion();

  const options = [...(question.options || [])];
  while (options.length < 4) options.push("");

  const answerIndex = options.findIndex(
    (option) => option.trim() === (question.answer || "").trim()
  );

  return {
    question: question.question || "",
    options,
    timer: question.timer || 10,
    answerIndex: answerIndex === -1 ? null : answerIndex,
  };
};

const QuestionForm = ({ testid, question = null, onClose, onSaved }) => {
  const isEdit = Boolean(question);
  const [draft, setDraft] = useState(() => buildInitialDraft(question));
  const [customTimer, setCustomTimer] = useState(
    Boolean(question) && !TIMER_VALUES.includes(question.timer)
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const clearError = () => {
    if (error) setError("");
  };

  const handleQuestionChange = (value) => {
    setDraft((prev) => ({ ...prev, question: value }));
    clearError();
  };

  const handleOptionChange = (index, value) => {
    setDraft((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return {
        ...prev,
        options,
        answerIndex:
          prev.answerIndex === index && !value.trim() ? null : prev.answerIndex,
      };
    });
    clearError();
  };

  const handleAnswerSelect = (index) => {
    if (!draft.options[index].trim()) return;
    setDraft((prev) => ({ ...prev, answerIndex: index }));
    clearError();
  };

  const handleTimerSelect = (time) => {
    setCustomTimer(false);
    setDraft((prev) => ({ ...prev, timer: time }));
  };

  const handleCustomTimer = () => {
    setCustomTimer(true);
    setDraft((prev) => ({ ...prev, timer: "" }));
  };

  const handleSave = async () => {
    const questionText = draft.question.trim();
    const filledOptions = draft.options
      .map((option) => option.trim())
      .filter(Boolean);
    const answer = draft.options[draft.answerIndex]?.trim();

    if (!questionText) {
      setError("Enter the question text.");
      return;
    }

    if (filledOptions.length < 2) {
      setError("Add at least two answer options.");
      return;
    }

    if (!answer) {
      setError("Select the correct answer.");
      return;
    }

    const normalizedOptions = filledOptions.map((option) => option.toLowerCase());
    if (new Set(normalizedOptions).size !== normalizedOptions.length) {
      setError("Answer options must be unique.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        isEdit ? "/api/update-question" : "/api/add-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(isEdit ? { id: question.id } : { testId: testid }),
            question: questionText,
            options: filledOptions,
            answer,
            timer: draft.timer || 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save question");
      }

      if (onSaved) {
        onSaved();
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Error saving question:", err);
      setError("Couldn't save the question. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-500/20 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            {isEdit ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isEdit ? "Edit question" : "New question"}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
              {isEdit
                ? "Update the question, options or timer."
                : "This will be added directly to the test."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close question form"
          className="grid h-8 w-8 flex-none place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div>
          <label
            htmlFor="question-text"
            className="text-xs font-semibold text-slate-700 dark:text-gray-300"
          >
            Question
          </label>
          <input
            id="question-text"
            autoFocus
            value={draft.question}
            onChange={(event) => handleQuestionChange(event.target.value)}
            placeholder="Type your question..."
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
            Time limit
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIMER_VALUES.map((time) => {
              const selected = !customTimer && draft.timer === time;

              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimerSelect(time)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Timer className="h-3 w-3" />
                  {time}s
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleCustomTimer}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                customTimer
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Timer className="h-3 w-3" />
              Custom
            </button>
          </div>

          {customTimer && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={draft.timer || ""}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    timer: event.target.value ? Number(event.target.value) : "",
                  }))
                }
                placeholder="30"
                className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <span className="text-xs text-slate-500 dark:text-gray-400">
                seconds
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              Answer options
            </span>
            <span className="text-[11px] text-slate-400 dark:text-gray-500">
              Select the correct answer
            </span>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {draft.options.map((option, index) => {
              const selected = draft.answerIndex === index;
              const letter = String.fromCharCode(65 + index);

              return (
                <div
                  key={letter}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${
                    selected
                      ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                      : "border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] font-semibold ${
                      selected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {letter}
                  </span>
                  <input
                    value={option}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                    placeholder={`Option ${letter}`}
                    aria-label={`Option ${letter}`}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={!option.trim()}
                    aria-label={`Mark option ${letter} as correct`}
                    title={`Mark option ${letter} as correct`}
                    className={`grid h-6 w-6 flex-none place-items-center rounded-full border transition-colors ${
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : option.trim()
                          ? "border-slate-300 text-transparent hover:border-emerald-400 hover:text-emerald-500 dark:border-gray-600"
                          : "cursor-not-allowed border-slate-200 text-transparent dark:border-gray-700"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-gray-800 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isEdit ? (
            <Pencil className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {saving ? "Saving..." : isEdit ? "Save changes" : "Add question"}
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
