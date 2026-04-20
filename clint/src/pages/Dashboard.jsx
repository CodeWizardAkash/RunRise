import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [runs, setRuns] = useState([]);
  const [form, setForm] = useState({
    distance: "",
    duration: "",
    steps: "",
  });

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  //Featch user
  const fetchUser = async () =>{
    const res = await API.get("/user/profile");
    setUser(res.data);
  }

  // Fetch runs
  const fetchRuns = async () => {
    try {
      const res = await API.get("/run");
      setRuns(res.data);
    } catch (err) {
      alert("Unauthorized, please login");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchRuns();
    fetchUser();
  }, []);

  // Add run
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/run", form);
      setForm({ distance: "", duration: "", steps: "" });
      fetchRuns();
    } catch (err) {
      alert("Error adding run");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2">
          Logout
        </button>
      </div>

      <h2 className="text-2xl">Welcome, <span className="font-semibold">{user?.name} 👋</span></h2>

      {/* Add Run Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add Run</h2>

        <input
          type="number"
          placeholder="Distance (km)"
          className="border p-2 mr-2"
          value={form.distance}
          onChange={(e) => setForm({ ...form, distance: e.target.value })}
        />

        <input
          type="number"
          placeholder="Duration (min)"
          className="border p-2 mr-2"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <input
          type="number"
          placeholder="Steps"
          className="border p-2 mr-2"
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
        />

        <button className="bg-blue-500 text-white p-2">
          Add
        </button>
      </form>

      {/* Run History */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Run History</h2>

        {runs.map((run) => (
          <div key={run._id} className="border p-3 mb-2">
            <p>Distance: {run.distance} km</p>
            <p>Duration: {run.duration} min</p>
            <p>Steps: {run.steps}</p>
          </div>
        ))}
      </div>
    </div>
  );
}