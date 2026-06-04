import { formatTime } from "../utils/formatTime";
import { formatPace } from "../utils/formatPace";

function RunStats({
  distance = 0,
  time = 0,
  speed = 0,
  pace = 0,
  isRunning = false,
}) {
  return (
    <>
      <p className="text-xl mt-4">
        Distance:{" "}
        {distance < 1
          ? `${(distance * 1000).toFixed(0)} m`
          : `${distance.toFixed(3)} km`}
      </p>

      <p className="text-xl mt-2">
        Time: {formatTime(time)}
      </p>

      <p className="text-xl mt-2">
        Speed: {speed.toFixed(1)} km/h
      </p>

      <p className="text-xl mt-2">
        Pace: {formatPace(pace)}
      </p>

      <p className="mt-3">
        Status: {isRunning ? "Running 🟢" : "Stopped 🔴"}
      </p>
    </>
  );
}

export default RunStats;