import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import RunMap from "../components/RunMap";
import RunStats from "../components/RunStats";
import RunControls from "../components/RunControls";

import { getDistance } from "../utils/getDistance";

function RunTracker() {
  const navigate = useNavigate();
  
  // State
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Refs
  const prevLocationRef = useRef(null);
  const totalDistanceRef = useRef(0);
  const gpsBufferRef = useRef([]);
  
  // Config
  const MAX_ACCURACY = 50;
  const MIN_DISTANCE = 0.003; // 3 meters
  const MAX_DISTANCE = 0.2; // 200 meters
  
  // Pace
  const pace =
    distance > 0
      ? (time / 60) / distance
      : 0;
  
  // GPS Tracking
  useEffect(() => {
    if (!isRunning) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
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

        // Ignore bad GPS signal
        if (accuracy > MAX_ACCURACY) return;
        
        // GPS Smoothing
        const avgLat = latitude;
        const avgLon = longitude;
        
        // Speed
        const speedKmh =
          typeof gpsSpeed === "number"
            ? gpsSpeed * 3.6
            : 0;

        setSpeed(speedKmh);

        // Ignore impossible jumps
        if (!prevLocationRef.current) {
          prevLocationRef.current = {
            lat: avgLat,
            lon: avgLon,
          };

          setPath([[avgLat, avgLon]]);
          return;
        }
        // Distance Calculation
        const chunk = getDistance(
          prevLocationRef.current.lat,
          prevLocationRef.current.lon,
          avgLat,
          avgLon
        );

        console.log({
          accuracy,
          chunk,
          total: totalDistanceRef.current,
          speed: speedKmh,
        });

        if (
          chunk > MIN_DISTANCE &&
          chunk < MAX_DISTANCE
        ) {
          totalDistanceRef.current += chunk;

          console.log(
            "✅ ACCEPTED",
            chunk,
            totalDistanceRef.current
          );

          setDistance(totalDistanceRef.current);
        }

        // Update Previous Position
        prevLocationRef.current = {
          lat: avgLat,
          lon: avgLon,
        };
        
        // Update Route Path
        setPath((prev) => [
          ...prev,
          [avgLat, avgLon],
        ]);
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isRunning]);
 
  // Timer 
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Start Run
    const startRun = () => {
    totalDistanceRef.current = 0;
    gpsBufferRef.current = [];
    prevLocationRef.current = null;

    setDistance(0);
    setSpeed(0);
    setTime(0);
    setPath([]);

    setIsRunning(true);
  };

  // Stop Run
  const stopRun = () => {
    setIsRunning(false);

    console.log(
      "🏁 Final Distance:",
      totalDistanceRef.current.toFixed(3)
    );

    console.log(
      "🗺 Route Points:",
      path.length
    );
  };

  // UI
  return (
    <div className="p-5 text-center">
      <div
        className="cursor-pointer text-left"
        onClick={() => navigate("/dashboard")}
      >
        {"<< back"}
      </div>

      <h1 className="text-3xl font-bold">
        Run Tracker
      </h1>

      <RunStats
        distance={distance}
        time={time}
        speed={speed}
        pace={pace}
        isRunning={isRunning}
      />

      <RunControls
        isRunning={isRunning}
        startRun={startRun}
        stopRun={stopRun}
      />

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