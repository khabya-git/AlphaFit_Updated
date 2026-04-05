import React, { useState, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import axiosInstance, { setToken } from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { DumbbellIcon } from "../../../src/components/landing/icons";

const PASSWORD_HINT =
  "At least 8 characters including uppercase, lowercase, number, and special character";

function strengthScore(pw = "") {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[\W_]/.test(pw)) s++;
  return Math.min(s, 5);
}

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const context = useContext(UserContext);
  const updateUser = context?.updateUser || (() => {});
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const pwScore = useMemo(() => strengthScore(password), [password]);
  const pwPercent = (pwScore / 5) * 100;

  const pwColor =
    pwPercent < 40
      ? "bg-red-500"
      : pwPercent < 60
        ? "bg-orange-500"
        : pwPercent < 80
          ? "bg-blue-400"
          : "bg-green-500";

  const pwLabel =
    ["Very Weak", "Weak", "Fair", "Strong", "Excellent"][
      Math.max(0, pwScore - 1)
    ] || "Very Weak";

  const isRegistering = React.useRef(false);

  // Prevent users who are already logged in from staying on signup page,
  // but DON'T kick them out if they are actively in the middle of signing up!
  useEffect(() => {
    if (context?.user && !context?.loading && !isRegistering.current) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [context?.user, context?.loading, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter your email");

    const emailPolicy = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPolicy.test(email))
      return setError("Please enter a valid email address");

    if (!password.trim()) return setError("Please enter a password");
    if (password.trim() !== password)
      return setError("Password cannot start or end with spaces");

    const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!policy.test(password)) return setError(PASSWORD_HINT);

    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email: email.toLowerCase(),
        password,
        profileImageUrl: profileImage,
      });

      if (res.data?.token) {
        isRegistering.current = true; // Block the auto-redirect to dashboard
        localStorage.setItem("token", res.data.token);
        updateUser(res.data.user || res.data);
        toast.success("Account created successfully! Welcome.");
        navigate("/user/measurement-form", { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await axiosInstance.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        profileImageUrl: decoded.picture,
      });

      if (res.data?.token) {
        isRegistering.current = true; // Block the auto-redirect to dashboard
        setToken(res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
        updateUser(res.data.user || res.data);

        toast.success("Google sign-in successful!");
        if (res.data.isNewUser) {
          navigate("/user/measurement-form", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-100/40 to-transparent pointer-events-none" />
      <div className="absolute -left-20 top-1/4 w-96 h-96 bg-blue-200/30 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
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
            Create an Account
          </h1>
          <p className="text-gray-500 font-medium">Get started with your free AlphaFit account</p>
        </div>

        <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-3xl shadow-xl animate-in zoom-in-95 duration-500 delay-150">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-5">
              
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center overflow-hidden relative group cursor-pointer">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                       <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-1" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                       <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <label className="text-xs font-semibold text-gray-500 text-center">
                  Profile Photo (Optional)
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password Strength Gauge */}
                {password.length > 0 && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-semibold text-gray-500">Strength</span>
                       <span className={`text-xs font-bold ${
                          pwScore === 5 ? "text-green-600" :
                          pwScore === 4 ? "text-blue-600" :
                          pwScore === 3 ? "text-orange-600" : "text-red-600"
                       }`}>
                          {pwLabel}
                       </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${i < pwScore ? pwColor : "bg-transparent"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

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
                text="signup_with"
                width="100%"
              />
            </div>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-gray-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
