import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RunTracker() {
    const [distance, setDistance] = useState(0);
    const [prevLocation, setPrevLocation] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);

    const navigate = useNavigate();

    // Haversin formula
    const getDistance = (lat1, lon1, lat2, lon2) =>{
        const R = 6371; // km

        const dLat = (lat1 - lat2) * (Math.PI / 180);
        const dLon = (lon1 - lon2) * (Math.PI / 180);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * (Math.PI/180))*
                  Math.cos(lat2 * (Math.PI/180))*
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R*c;
    };

    useEffect(()=>{
        if (!isRunning) return;

        const interval = setInterval(()=>{
            navigator.geolocation.getCurrentPosition((position)=>{
                const {latitude, longitude, accuracy} = position.coords;
                if(accuracy>50) return;

                if(prevLocation){
                    const dist = getDistance(
                        prevLocation.lat,
                        prevLocation.lon,
                        latitude, 
                        longitude
                    )*1000;

                    if(dist> 10 && dist<100){
                        setDistance((prev)=> prev + dist)
                    }
                }

                setPrevLocation({lat: latitude, lon: longitude});                    
            })
        }, 5000);
        return () =>  clearInterval(interval);
    }, [isRunning, prevLocation]);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning]);


    const startRun = () => {
        setDistance(0);
        setPrevLocation(null);
        setTime(0);
        setIsRunning(true);
    };

    const stopRun = () => {
        setIsRunning(false);
    };

      // 🧠 Format Time (hh:mm:ss)
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return( 
       <div className="p-5 text-center">

        <div className="text-left cursor-pointer" onClick={()=> navigate("/dashboard")} >{"<<back"}</div>

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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>

        <button
          onClick={stopRun}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>

      <p className="mt-3">
        Status: {isRunning ? "Running 🟢" : "Stopped 🔴"}
      </p>
    </div>
    )
}

export default RunTracker;