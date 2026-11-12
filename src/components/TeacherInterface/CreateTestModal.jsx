import { X } from "lucide-react";

const CreateTestModal = ({ testMeta, setTestMeta, onCreateTest, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Create a new test
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                            Give your test a title and instructions for your students.
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

                <div className="mt-5 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-gray-300">
                            Test title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Chapter 4 — Cell Biology"
                            value={testMeta.title}
                            onChange={(e) => setTestMeta({ ...testMeta, title: e.target.value })}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-gray-300">
                            Instructions
                        </label>
                        <textarea
                            placeholder="Write down instructions for the participants..."
                            value={testMeta.description}
                            onChange={(e) => setTestMeta({ ...testMeta, description: e.target.value })}
                            className="mt-1.5 h-36 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onCreateTest}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                    >
                        Create test
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateTestModal;
