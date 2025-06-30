const CreateTestModal = ({testMeta , setTestMeta , onCreateTest , onClose}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-xl text-black">Create new test</p>
                    {onClose && (
                        <button 
                            onClick={onClose}
                            className="text-black hover:text-gray-600 text-xl font-bold"
                        >
                            ×
                        </button>
                    )}
                </div>
                <input
                    type="text"
                    placeholder="Test Title"
                    value={testMeta.title}
                    onChange={(e) => setTestMeta({ ...testMeta, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-gray-600"
                />
                <textarea
                    placeholder="Write down instructions for the participants over here "
                    value={testMeta.description}
                    onChange={(e) => setTestMeta({ ...testMeta, description: e.target.value })}
                    className="w-full border h-44 border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-gray-600"
                />
                <button 
                    onClick={onCreateTest}
                    className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                    Create Test
                </button>
            </div>
        </div>
    )
}

export default CreateTestModal;