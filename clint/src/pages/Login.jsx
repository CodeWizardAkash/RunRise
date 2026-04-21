import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      alert("Login successful 🚀");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-500 text-white p-2">Login</button>

        <p className="text-sm mt-3 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
