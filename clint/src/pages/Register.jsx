import { useState } from "react";
import {useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {  
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!form.name || !form.email || !form.password){
            return alert("Please fill all fields");
        }

        try{
            await API.post("/auth/register", form);
            alert("Registered Successfully");
            setForm({name:"", email: "", password: ""});

            navigate("/")
        }catch(err){
            alert(err.response?.data?.message || "Registration failed");
        }
    }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-green-500 text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
}