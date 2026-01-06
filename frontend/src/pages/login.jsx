import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/loginPersona.png";
import baseApi from "../services/apiService";
import {useAuth} from "../context/authContext"
import axios from "axios";

export default function UserLoginPage() {
  const [issignIN, setissignIN] = useState(false); // false = Login, true = Signup
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validation Logic 
    if (!issignIN && (!username || !password)) {
      alert("Please fill User ID and Password");
      setLoading(false);
      return;
    }

    if (issignIN && (!username || !fullName || !email || !password)) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      if (issignIN) {
        // --- SIGNUP FLOW ---
        await axios.post(`${import.meta.env.VITE_API}/users/register`, { username, fullName, email, password });
        
        alert("Account created successfully!");
        
       
        setFullName("");
        setEmail("");
        setissignIN(false); 

      } else {
        // --- LOGIN FLOW ---
        const data = await baseApi.post('/users/login', { username, password });

        // Save tokens (Make sure backend sends 'token' or 'accessToken')
        localStorage.setItem('token', data.data.accessToken || data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        if (data) {
        login(data.data); 
    }

        console.log("Login Successful!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img src={loginBg} alt="Persona Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Header Section */}
      <div className="absolute top-10 left-[35%] -translate-x-1/2 z-20 hidden md:block text-center">
        <h1 className="text-[110px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_15px_50px_rgba(255,190,90,0.9)]">
          PERSONA
        </h1>
        <p className="text-xl tracking-[0.35em] text-white/90 mt-2 font-semibold">YOUR AI INTERVIEWER</p>
      </div>

      <div className="relative z-30 min-h-screen flex justify-end items-center pr-16">
        <div className="w-full max-w-md p-10 rounded-3xl bg-gradient-to-br from-[#2a2418]/90 via-[#1f1b12]/90 to-[#141109]/90 backdrop-blur-xl border border-amber-400/10 shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
          
          <h2 className="text-3xl font-extrabold text-amber-200 text-center mb-8 tracking-wide">
            {issignIN ? "Create New Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User ID - Always shown */}
            <div>
              <label className="block text-sm font-semibold text-amber-100/90 mb-1 tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter User ID"
                className="w-full px-4 py-2.5 rounded-xl bg-[#2f2a1d]/70 text-white border border-[#4a412b] focus:border-amber-400 outline-none transition-all"
              />
            </div>

            {/* Signup Only Fields */}
            {issignIN && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-amber-100/90 mb-1 tracking-wide">FullName</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter User Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2f2a1d]/70 text-white border border-[#4a412b] focus:border-amber-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-100/90 mb-1 tracking-wide">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2f2a1d]/70 text-white border border-[#4a412b] focus:border-amber-400 outline-none transition-all"
                  />
                </div>
              </>
            )}

            {/* Password - Always shown */}
            <div>
              <label className="block text-sm font-semibold text-amber-100/90 mb-1 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#2f2a1d]/70 text-white border border-[#4a412b] focus:border-amber-400 outline-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? "PROCESSING..." : issignIN ? "CREATE ACCOUNT" : "LOGIN"}
              </button>

              {!issignIN && (
                <button
                  type="button"
                  onClick={() => setissignIN(true)}
                  className="w-full py-2.5 rounded-xl border border-amber-400/30 text-amber-100 font-semibold hover:bg-white/10 transition-all"
                >
                  GO TO SIGN UP
                </button>
              )}
              
              {issignIN && (
                <button
                  type="button"
                  onClick={() => setissignIN(false)}
                  className="w-full py-2.5 text-amber-200/60 text-sm hover:text-amber-200 transition-all"
                >
                  Already have an account? Login
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}