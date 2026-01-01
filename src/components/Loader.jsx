
const Loader = (isLoading, message) => {

    return (
        <>
            {isLoading && (
                <div className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-2xl mt-4">
                    <div className="mx-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-sm font-medium text-blue-800">{message}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Loader;
