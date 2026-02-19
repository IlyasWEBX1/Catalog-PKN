import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/Catalogue_api/token/",
        { username, password },
      );
      const token = res.data.access;
      localStorage.setItem("authToken", token);

      const decoded = jwtDecode(token);
      if (decoded.peran === "admin") {
        navigate("/Admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(
        err.response?.status === 401
          ? "Username atau password salah."
          : "Terjadi kesalahan.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    axios
      .post("http://localhost:8000/Catalogue_api/token/", {
        username: "guest",
        password: "guest123",
      })
      .then((res) => {
        localStorage.setItem("authToken", res.data.access);
        navigate("/");
      })
      .catch(() => alert("Guest login failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-orange-900/10 w-full max-w-md border border-white z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-800 text-white rounded-2xl mb-4 shadow-lg shadow-orange-800/30">
            <FiLogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 mt-2">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-800 transition-colors">
                <FiUser />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 transition-all text-slate-800"
                placeholder="Your username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-800 transition-colors">
                <FiLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 transition-all text-slate-800"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-orange-800 transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-800 text-white font-bold rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
          >
            Explore as Guest
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/Register"
            className="text-orange-800 font-bold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
