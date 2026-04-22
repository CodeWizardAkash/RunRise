import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function RunTracker() {
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [path, setPath] = useState([]);

  const prevLocationRef = useRef(null);

  const navigate = useNavigate();

  // Haversine
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 📍 REAL-TIME TRACKING
  useEffect(() => {
    if (!isRunning) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 50) return;

        const prev = prevLocationRef.current;

        if (prev) {
          const dist = getDistance(
            prev.lat,
            prev.lon,
            latitude,
            longitude
          );

          if (dist > 0.001 && dist < 0.1) {
            setDistance((d) => d + dist);
          }
        }

        // Save current location
        prevLocationRef.current = { lat: latitude, lon: longitude };

        // Save path
        setPath((p) => [...p, { lat: latitude, lon: longitude }]);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isRunning]);

  // ⏱ TIMER
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // ▶️ START
  const startRun = () => {
    setDistance(0);
    setTime(0);
    setPath([]);
    prevLocationRef.current = null;
    setIsRunning(true);
  };

  // ⏹ STOP
  const stopRun = () => {
    setIsRunning(false);
    console.log("Run Path:", path); // for debugging
  };

  // Format Time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-5 text-center">
      <div onClick={() => navigate("/dashboard")} className="cursor-pointer text-left">
        {"<< back"}
      </div>

      <h1 className="text-2xl font-bold">Run Tracker</h1>

      <p className="text-xl mt-4">
        Distance: {distance.toFixed(3)} km
      </p>

      <p className="text-xl mt-2">
        Time: {formatTime(time)}
      </p>

      <div className="mt-5 space-x-4">
        <button
          onClick={startRun}
          disabled={isRunning}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>

        <button
          onClick={stopRun}
          disabled={!isRunning}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>

      <p className="mt-3">
        Status: {isRunning ? "Running 🟢" : "Stopped 🔴"}
      </p>
    </div>
  );
}

export default RunTracker;