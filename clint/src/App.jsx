import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import RunTracker from "./pages/RunTracker";
import Feed from "./pages/Feed";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/run" element={<RunTracker />} />
      <Route path="/feed" element={<Feed/>} />
    </Routes>
  );
}

export default App;