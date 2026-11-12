"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchAiOptions,
  generateQuestions,
  saveQuestion,
} from "@/lib/aiApi";

const FALLBACK_OPTIONS = {
  topics: [
    { id: "science", label: "General science" },
    { id: "mathematics", label: "Mathematics" },
    { id: "biology", label: "Biology" },
    { id: "physics", label: "Physics" },
    { id: "chemistry", label: "Chemistry" },
    { id: "sports", label: "Sports" },
    { id: "general-knowledge", label: "General knowledge" },
    { id: "history", label: "History" },
    { id: "geography", label: "Geography" },
    { id: "english", label: "English & language" },
    { id: "computer-science", label: "Computer science" },
    { id: "civics", label: "Civics & constitution" },
    { id: "health", label: "Health & hygiene" },
    { id: "current-affairs", label: "Current affairs" },
    { id: "mixed", label: "Mixed topics" },
  ],
  difficulties: [
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
  ],
  audiences: [
    { id: "grade-3", label: "Grade 3" },
    { id: "grade-4", label: "Grade 4" },
    { id: "grade-5", label: "Grade 5" },
    { id: "grade-6", label: "Grade 6" },
    { id: "grade-7", label: "Grade 7" },
    { id: "grade-8", label: "Grade 8" },
    { id: "grade-9", label: "Grade 9" },
    { id: "grade-10", label: "Grade 10" },
    { id: "grade-11", label: "Grade 11" },
    { id: "grade-12", label: "Grade 12" },
    { id: "age-8", label: "Age 8" },
    { id: "age-10", label: "Age 10" },
    { id: "age-12", label: "Age 12" },
    { id: "age-14", label: "Age 14" },
    { id: "age-16", label: "Age 16" },
    { id: "age-18", label: "Age 18" },
    { id: "adult", label: "Adult" },
  ],
  maxQuestions: 25,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700 dark:text-gray-300";

const AiGeneratorModal = ({ testId, onClose, onSaved }) => {
  const [options, setOptions] = useState(FALLBACK_OPTIONS);
  const [audience, setAudience] = useState("grade-6");
  const [topic, setTopic] = useState("general-knowledge");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [instruction, setInstruction] = useState("");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    let active = true;

    fetchAiOptions()
      .then((data) => {
        if (active && data?.topics?.length) setOptions(data);
      })
      .catch(() => {
        // The bundled defaults keep the form usable if the endpoint is down.
      });

    return () => {
      active = false;
    };
  }, []);

  const total = drafts.length;

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    try {
      const questions = await generateQuestions({
        audience,
        topic,
        difficulty,
        count: Number(count),
        instruction,
      });

      setDrafts(
        questions.map((question) => ({
          ...question,
          timer: 10,
        }))
      );

      if (questions.length === 0) {
        setError("Gemini did not return any questions. Try again.");
      }
    } catch (err) {
      setError(err.message || "Could not generate questions.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDraftChange = (index, patch) => {
    setDrafts((prev) =>
      prev.map((draft, i) => (i === index ? { ...draft, ...patch } : draft))
    );
  };

  const handleOptionChange = (index, optionIndex, value) => {
    setDrafts((prev) =>
      prev.map((draft, i) => {
        if (i !== index) return draft;

        const options = [...draft.options];
        const previousAnswer = draft.answer;
        const wasAnswer = options[optionIndex];

        options[optionIndex] = value;

        // Keep the answer pointing at the same option when its text changes.
        const answer =
          previousAnswer === wasAnswer ? value : previousAnswer;

        return { ...draft, options, answer };
      })
    );
  };

  const handleRemove = (index) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    const valid = drafts.filter(
      (draft) =>
        draft.question.trim() &&
        draft.options.filter((option) => option.trim()).length >= 2 &&
        draft.answer.trim()
    );

    if (valid.length === 0) {
      setError("Fix the highlighted questions before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      for (const draft of valid) {
        await saveQuestion({
          testId,
          question: draft.question.trim(),
          options: draft.options.map((option) => option.trim()).filter(Boolean),
          answer: draft.answer.trim(),
          timer: Number(draft.timer) || 10,
        });
      }

      toast.success(`${valid.length} question${valid.length === 1 ? "" : "s"} added to the test.`);
      onSaved?.(valid.length);
    } catch (err) {
      setError(err.message || "Could not save the questions.");
    } finally {
      setSaving(false);
    }
  };

  const reviewMode = drafts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Generate questions with AI
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                Gemini drafts the questions, you review and approve them.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI generator"
            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        {!reviewMode && (
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ai-audience" className={labelClass}>
                  Class / age group
                </label>
                <select
                  id="ai-audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className={inputClass}
                >
                  {options.audiences.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ai-topic" className={labelClass}>
                  Topic
                </label>
                <select
                  id="ai-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={inputClass}
                >
                  {options.topics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ai-difficulty" className={labelClass}>
                  Difficulty
                </label>
                <select
                  id="ai-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={inputClass}
                >
                  {options.difficulties.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ai-count" className={labelClass}>
                  Number of questions
                </label>
                <input
                  id="ai-count"
                  type="number"
                  min={1}
                  max={options.maxQuestions}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="ai-instruction" className={labelClass}>
                Custom instructions <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="ai-instruction"
                rows={3}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Focus on Indian states, use only simple English, avoid formulas above grade 6..."
                className={`${inputClass} resize-y`}
              />
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                {error}
              </p>
            )}
          </div>
        )}

        {/* Review */}
        {reviewMode && (
          <div className="max-h-[55vh] space-y-3 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                Review {total} generated question{total === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDrafts([]);
                  setError("");
                }}
                className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
              >
                Start over
              </button>
            </div>

            {drafts.map((draft, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1 space-y-3">
                    <input
                      value={draft.question}
                      onChange={(e) =>
                        handleDraftChange(index, { question: e.target.value })
                      }
                      aria-label={`Question ${index + 1}`}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />

                    <div className="grid gap-2 sm:grid-cols-2">
                      {draft.options.map((option, optionIndex) => {
                        const letter = String.fromCharCode(65 + optionIndex);
                        const isAnswer = draft.answer === option;

                        return (
                          <div
                            key={letter}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                              isAnswer
                                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                : "border-slate-200 dark:border-gray-700"
                            }`}
                          >
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400">
                              {letter}.
                            </span>
                            <input
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, optionIndex, e.target.value)
                              }
                              aria-label={`Option ${letter} of question ${index + 1}`}
                              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleDraftChange(index, {
                                  answer: draft.options[optionIndex],
                                })
                              }
                              aria-label={`Mark option ${letter} as correct`}
                              title="Mark as correct answer"
                              className={`grid h-5 w-5 flex-none place-items-center rounded-full border transition-colors ${
                                isAnswer
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-300 text-transparent hover:border-emerald-400 hover:text-emerald-500 dark:border-gray-600"
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`ai-timer-${index}`}
                        className="text-[11px] font-medium text-slate-500 dark:text-gray-400"
                      >
                        Timer
                      </label>
                      <input
                        id={`ai-timer-${index}`}
                        type="number"
                        min={1}
                        value={draft.timer}
                        onChange={(e) =>
                          handleDraftChange(index, {
                            timer: e.target.value ? Number(e.target.value) : 10,
                          })
                        }
                        className="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                      <span className="text-[11px] text-slate-400">seconds</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove question ${index + 1}`}
                    title="Remove question"
                    className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {error && (
              <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                {error}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-gray-800 sm:px-6">
          {reviewMode && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || saving}
              className="mr-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Wand2 className="h-3.5 w-3.5" />
              )}
              Regenerate
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {reviewMode ? "Cancel" : "Close"}
          </button>

          {reviewMode ? (
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {saving
                ? "Saving..."
                : `Save ${total} question${total === 1 ? "" : "s"}`}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {generating ? "Generating..." : "Generate questions"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiGeneratorModal;
