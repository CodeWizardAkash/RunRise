import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function RunTracker() {
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [path, setPath] = useState([]);

  const prevLocationRef = useRef(null);
  const totalDistanceRef = useRef(0);

  const navigate = useNavigate();

  // 🌍 Haversine Formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
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

  // 📍 Real-time GPS Tracking
  useEffect(() => {
    if (!isRunning) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("📍 Location:", latitude, longitude, "Accuracy:", accuracy);

        // Ignore bad GPS accuracy
        if (accuracy > 100) return;

        const prev = prevLocationRef.current;

        // First location
        if (!prev) {
          prevLocationRef.current = { lat: latitude, lon: longitude };
          setPath([{ lat: latitude, lon: longitude }]);
          return;
        }

        // Calculate distance
        const dist = getDistance(
          prev.lat,
          prev.lon,
          latitude,
          longitude
        );

        console.log("📏 Distance chunk:", dist);

        // Filter noise (5m to 100m)
        if (dist > 0.005 && dist < 0.1) {
          totalDistanceRef.current += dist;
          setDistance(totalDistanceRef.current);
        }

        // Update previous location
        prevLocationRef.current = { lat: latitude, lon: longitude };

        // Save path (only good accuracy)
        if (accuracy < 50) {
          setPath((p) => [...p, { lat: latitude, lon: longitude }]);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Please enable location permission and use HTTPS");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isRunning]);

  // ⏱ Timer
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // ▶️ Start Run
  const startRun = () => {
    totalDistanceRef.current = 0;
    setDistance(0);
    setTime(0);
    setPath([]);
    prevLocationRef.current = null;
    setIsRunning(true);
  };

  // ⏹ Stop Run
  const stopRun = () => {
    setIsRunning(false);
    console.log("🏁 Final Distance:", totalDistanceRef.current.toFixed(3));
    console.log("🗺 Path Points:", path.length);
  };

  // 🧠 Format Time
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
      {/* Back Button */}
      <div
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer text-left"
      >
        {"<< back"}
      </div>

      <h1 className="text-2xl font-bold">Run Tracker</h1>

      {/* Distance */}
      <p className="text-xl mt-4">
        Distance: {distance < 1 
          ? `${(distance * 1000).toFixed(0)} m` 
          : `${distance.toFixed(3)} km`}
      </p>

      {/* Time */}
      <p className="text-xl mt-2">
        Time: {formatTime(time)}
      </p>

      {/* Buttons */}
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

      {/* Status */}
      <p className="mt-3">
        Status: {isRunning ? "Running 🟢" : "Stopped 🔴"}
      </p>
    </div>
  );
}

export default RunTracker;