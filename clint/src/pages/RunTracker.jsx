import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import RunMap from "../components/RunMap";
import RunStats from "../components/RunStats";
import RunControls from "../components/RunControls";

import { getDistance } from "../utils/getDistance";

function RunTracker() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // =========================
  // REFS
  // =========================
  const prevLocationRef = useRef(null);
  const totalDistanceRef = useRef(0);
  const prevTimestampRef = useRef(null);

  // =========================
  // CONFIG
  // =========================
  const MAX_ACCURACY = 50;

  // =========================
  // PACE
  // =========================
  const pace =
    distance > 0
      ? (time / 60) / distance
      : 0;

  // =========================
  // GPS TRACKING
  // =========================
  useEffect(() => {
    if (!isRunning) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (position) => {
          const {
            latitude,
            longitude,
            accuracy,
            speed: gpsSpeed,
          } = position.coords;

          console.log(
            "📍",
            latitude,
            longitude,
            "Accuracy:",
            accuracy
          );

          // Ignore poor GPS signal
          if (accuracy > MAX_ACCURACY)
            return;

          const currentLat = latitude;
          const currentLon = longitude;

          // =========================
          // SPEED
          // =========================
          const speedKmh =
            typeof gpsSpeed === "number"
              ? gpsSpeed * 3.6
              : 0;

          // Update speed only if valid
          if (speedKmh > 0) {
            setSpeed(speedKmh);
          }

          // =========================
          // FIRST LOCATION
          // =========================
          if (!prevLocationRef.current) {
            prevLocationRef.current = {
              lat: currentLat,
              lon: currentLon,
            };

            prevTimestampRef.current =
              position.timestamp;

            setPath([
              [currentLat, currentLon],
            ]);

            return;
          }

          // =========================
          // DISTANCE CALCULATION
          // =========================
          const chunk = getDistance(
            prevLocationRef.current.lat,
            prevLocationRef.current.lon,
            currentLat,
            currentLon
          );

          const currentTimestamp =
            position.timestamp;

          const timeDiff =
            (currentTimestamp -
              prevTimestampRef.current) /
            1000;

          // Speed from movement
          const calculatedSpeed =
            chunk / (timeDiff / 3600);

          console.log({
            accuracy,
            chunk,
            calculatedSpeed,
            total:
              totalDistanceRef.current,
          });

          // Reject impossible jumps
          if (
            calculatedSpeed > 0 &&
            calculatedSpeed < 25
          ) {
            totalDistanceRef.current +=
              chunk;

            setDistance(
              totalDistanceRef.current
            );

            console.log(
              "✅ ACCEPTED",
              totalDistanceRef.current
            );
          }

          // =========================
          // UPDATE REFS
          // =========================
          prevLocationRef.current = {
            lat: currentLat,
            lon: currentLon,
          };

          prevTimestampRef.current =
            currentTimestamp;

          // =========================
          // UPDATE MAP PATH
          // =========================
          setPath((prev) => [
            ...prev,
            [currentLat, currentLon],
          ]);
        },

        // ERROR HANDLER
        (error) => {
          console.error(
            "GPS Error:",
            error
          );

          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert(
                "Location permission denied."
              );
              break;

            case error.POSITION_UNAVAILABLE:
              alert(
                "Location unavailable."
              );
              break;

            case error.TIMEOUT:
              alert(
                "Location request timed out."
              );
              break;

            default:
              alert("Unknown GPS error.");
          }
        },

        // GPS OPTIONS
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, [isRunning]);

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // =========================
  // START RUN
  // =========================
  const startRun = () => {
    totalDistanceRef.current = 0;
    prevLocationRef.current = null;
    prevTimestampRef.current = null;

    setDistance(0);
    setSpeed(0);
    setTime(0);
    setPath([]);

    setIsRunning(true);
  };

  // =========================
  // STOP RUN
  // =========================
  const stopRun = async () => {
    setIsRunning(false);

    console.log(
      "🏁 Final Distance:",
      totalDistanceRef.current.toFixed(
        3
      )
    );

    console.log(
      "🗺 Route Points:",
      path.length
    );

    try {
      const runData = {
        distance: Number(
          totalDistanceRef.current.toFixed(
            2
          )
        ),

        duration: time,

        speed: Number(
          speed.toFixed(2)
        ),

        pace: Number(
          pace.toFixed(2)
        ),

        route: path.map((point) => ({
          lat: point[0],
          lon: point[1],
        })),
      };

      console.log(
        "📤 Sending:",
        runData
      );

      const res = await API.post(
        "/run",
        runData
      );

      console.log(
        "✅ Run Saved:",
        res.data
      );
    } catch (error) {
      console.log(
        "❌ Save Error:",
        error.response?.data ||
          error.message
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="p-5 text-center">
      {/* Back */}
      <div
        className="cursor-pointer text-left"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        {"<< back"}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold">
        Run Tracker
      </h1>

      {/* Stats */}
      <RunStats
        distance={distance}
        time={time}
        speed={speed}
        pace={pace}
        isRunning={isRunning}
      />

      {/* Controls */}
      <RunControls
        isRunning={isRunning}
        startRun={startRun}
        stopRun={stopRun}
      />

      {/* Map */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">
          Route Map
        </h2>

        <RunMap path={path} />
      </div>
    </div>
  );
}

export default RunTracker;