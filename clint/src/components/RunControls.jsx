function RunControls({
    isRunning,
    startRun,
    stopRun,
}){
    return (
        <div className="mt-5 space-x-4">
            <button
                onClick={startRun}
                disabled={isRunning}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Start
            </button>

            <button
                onClick={stopRun}
                disabled={!isRunning}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Stop
            </button>
        </div>
    );
}

export default RunControls;