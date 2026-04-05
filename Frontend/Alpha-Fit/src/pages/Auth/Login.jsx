import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../context/userContext";
import { validateEmail } from "../../utils/helper";
import { setToken } from "../../utils/axiosInstance";
import { DumbbellIcon } from "../../../src/components/landing/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // ================= NORMAL LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      if (token) {
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser({ user, token });

        toast.success("Welcome back!");
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await axios.post(
        "http://localhost:8000/api/auth/google",
        {
          name: decoded.name,
          email: decoded.email,
          profileImageUrl: decoded.picture,
        }
      );

      const { token, user } = response.data;

      if (token) {
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser({ user, token });

        toast.success("Google sign-in successful!");
        if (response.data.isNewUser) {
          navigate("/user/measurement-form", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-100/40 to-transparent pointer-events-none" />
      <div className="absolute -left-20 top-1/4 w-96 h-96 bg-blue-200/30 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link
            to="/"
            className="inline-flex items-center gap-3 mb-6 group no-underline"
          >
            <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105">
              <DumbbellIcon className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-gray-900 transition-colors">AlphaFit</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 font-medium">Log in to continue your fitness journey</p>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl animate-in zoom-in-95 duration-500 delay-150">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
               <label className="text-sm font-bold text-gray-700 mb-2 block">
                 Password
               </label>
               <div className="relative">
                 <input
                   type={showPw ? "text" : "password"}
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
                 <button
                   type="button"
                   className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors"
                   onClick={() => setShowPw((v) => !v)}
                 >
                   {showPw ? "Hide" : "Show"}
                 </button>
               </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
                  defaultChecked
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
            </div>

            {/* Normal Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center justify-center gap-4">
             <div className="h-px bg-gray-200 flex-1"></div>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or continue with</span>
             <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center flex-col items-center gap-4">
            <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => toast.error("Google sign-in failed")}
               theme="outline"
               size="large"
               text="continue_with"
               width="100%"
            />
          </div>

          {/* Signup Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                to="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
