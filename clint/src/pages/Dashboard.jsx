import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [runs, setRuns] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    distance: "",
    duration: "",
    steps: "",
  });

  const navigate = useNavigate();

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await API.get("/user/profile");
      setUser(res.data);
    } catch {
      handleLogout();
    }
  };

  // Fetch runs
  const fetchRuns = async () => {
    try {
      const res = await API.get("/run");
      setRuns(res.data);
    } catch {
      handleLogout();
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRuns();
  }, []);

  // Add run
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/run", form);
      setForm({ distance: "", duration: "", steps: "" });
      fetchRuns();
    } catch {
      alert("Error adding run");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">RunRise 🏃</h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold">{user?.name}</span> 👋
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add Run Card */}
      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Run</h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            type="number"
            placeholder="Distance (km)"
            className="border p-2 rounded w-40"
            value={form.distance}
            onChange={(e) =>
              setForm({ ...form, distance: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Duration (min)"
            className="border p-2 rounded w-40"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Steps"
            className="border p-2 rounded w-40"
            value={form.steps}
            onChange={(e) =>
              setForm({ ...form, steps: e.target.value })
            }
          />

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Run
          </button>
        </form>
      </div>

      {/* Run History */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-4">Run History</h2>

        {runs.length === 0 ? (
          <p className="text-gray-500">No runs yet. Start running! 🚀</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {runs.map((run) => (
              <div
                key={run._id}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <p><strong>Distance:</strong> {run.distance} km</p>
                <p><strong>Duration:</strong> {run.duration} min</p>
                <p><strong>Steps:</strong> {run.steps}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(run.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}