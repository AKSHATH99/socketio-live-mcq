import { useEffect, useRef, useState } from "react";
import { CheckCircle, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import QuestionForm from "./QuestionForm";

const getQuestionText = (question) =>
    question?.question || question?.text || "Untitled question";

const QuestionsPreview = ({ questions: initialQuestions, testId, onRefresh }) => {
    const [questions, setQuestions] = useState(initialQuestions || []);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text: string }
    const [activeQuestion, setActiveQuestion] = useState(0);
    const questionRefs = useRef([]);

    useEffect(() => {
        setQuestions(initialQuestions || []);
    }, [initialQuestions]);

    const showNotice = (type, text) => {
        setNotice({ type, text });
        setTimeout(() => setNotice(null), 3000);
    };

    const handleSaved = (message) => {
        setShowAddForm(false);
        setEditingId(null);
        showNotice('success', message);
        onRefresh?.();
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;

        setDeleting(true);

        try {
            const response = await fetch('/api/delete-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: pendingDelete.id })
            });

            if (!response.ok) {
                throw new Error('Failed to delete question');
            }

            setQuestions((prev) => prev.filter((q) => q.id !== pendingDelete.id));
            setPendingDelete(null);
            showNotice('success', 'Question deleted.');
            onRefresh?.();
        } catch (error) {
            console.error('Error deleting question:', error);
            showNotice('error', "Couldn't delete the question. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const scrollToQuestion = (index) => {
        setActiveQuestion(index);
        const target = questionRefs.current[index];

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div>
            {notice && (
                <div className={`mb-4 flex items-center gap-2 rounded-lg border p-4 ${
                        notice.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
                    }`}>
                    {notice.type === 'success' && <CheckCircle className="h-5 w-5 flex-none" />}
                    <span className="font-medium">{notice.text}</span>
                </div>
            )}

            {questions.length > 0 ? (
                <div className="flex gap-6">
                    <aside className="hidden w-56 flex-none lg:block">
                        <div className="sticky top-24">
                            <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                Questions
                            </p>

                            <div className="mt-2 max-h-[calc(100vh-14rem)] space-y-0.5 overflow-y-auto pr-1">
                                {questions.map((question, index) => (
                                    <button
                                        key={question.id || index}
                                        type="button"
                                        onClick={() => scrollToQuestion(index)}
                                        className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                                            activeQuestion === index
                                                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                                                : "text-slate-600 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                                        }`}
                                    >
                                        <span
                                            className={`grid h-5 w-5 flex-none place-items-center rounded-full text-[10px] font-semibold ${
                                                activeQuestion === index
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="line-clamp-2 text-xs leading-4">
                                            {getQuestionText(question)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="min-w-0 flex-1">
                        <div className="mb-3 flex gap-1.5 overflow-x-auto lg:hidden">
                            {questions.map((question, index) => (
                                <button
                                    key={question.id || index}
                                    type="button"
                                    onClick={() => scrollToQuestion(index)}
                                    aria-label={`Go to question ${index + 1}`}
                                    className={`grid h-8 w-8 flex-none place-items-center rounded-lg text-xs font-semibold transition-colors ${
                                        activeQuestion === index
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Questions overview
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
                                    Review and manage your test questions ({questions.length} question{questions.length !== 1 ? 's' : ''})
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setShowAddForm((open) => !open);
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add question
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="mt-4">
                                <QuestionForm
                                    testid={testId}
                                    onClose={() => setShowAddForm(false)}
                                    onSaved={() => handleSaved('Question added.')}
                                />
                            </div>
                        )}

                        <div className="mt-4 max-h-[65vh] space-y-3 overflow-y-auto pr-1">
                            {questions.map((question, index) => (
                                editingId === question.id ? (
                                    <div key={question.id || index}>
                                        <QuestionForm
                                            question={question}
                                            onClose={() => setEditingId(null)}
                                            onSaved={() => handleSaved('Question updated.')}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        key={question.id || index}
                                        ref={(node) => {
                                            questionRefs.current[index] = node;
                                        }}
                                        className="scroll-mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                                                {index + 1}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-6 text-slate-900 dark:text-white">
                                                    {getQuestionText(question)}
                                                </p>

                                                {question.timer ? (
                                                    <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                                                        {question.timer}s timer
                                                    </p>
                                                ) : null}

                                                {question.options && question.options.length > 0 && (
                                                    <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                                                        {question.options.map((option, optIndex) => (
                                                            <div
                                                                key={optIndex}
                                                                className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                                                                    option === question.answer
                                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                                                                        : "border-slate-100 text-slate-600 dark:border-gray-800 dark:text-gray-400"
                                                                }`}
                                                            >
                                                                <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-none items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAddForm(false);
                                                        setEditingId(question.id);
                                                    }}
                                                    aria-label={`Edit question ${index + 1}`}
                                                    title="Edit question"
                                                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPendingDelete(question)}
                                                    aria-label={`Delete question ${index + 1}`}
                                                    title="Delete question"
                                                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                showAddForm ? (
                    <QuestionForm
                        testid={testId}
                        onClose={() => setShowAddForm(false)}
                        onSaved={() => handleSaved('Question added.')}
                    />
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 dark:bg-gray-800">
                            <FileText className="w-8 h-8 text-slate-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 dark:text-white">No questions added</h3>
                        <p className="text-slate-500 text-base mb-8 max-w-md mx-auto dark:text-gray-400">
                            Start building your test by adding questions. Questions will appear here once added.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add first question
                        </button>
                    </div>
                )
            )}

            {pendingDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            <Trash2 className="h-4 w-4" />
                        </span>
                        <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                            Delete this question?
                        </h4>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-gray-400">
                            &ldquo;{getQuestionText(pendingDelete)}&rdquo; will be permanently removed from this test.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPendingDelete(null)}
                                disabled={deleting}
                                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                {deleting ? 'Deleting...' : 'Delete question'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionsPreview;
