import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  // Role: "client" or "admin"
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login/", {
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Login failed.");
        return;
      }

      const accessToken =
        response.data?.data?.tokens?.access ||
        response.data?.access ||
        response.data?.data?.access;

      const refreshToken =
        response.data?.data?.tokens?.refresh ||
        response.data?.refresh ||
        response.data?.data?.refresh;

      const user =
        response.data?.data?.user ||
        response.data?.user;

      if (!accessToken || !refreshToken || !user) {
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      const userIsAdmin =
        user?.is_staff === true ||
        user?.is_superuser === true ||
        user?.role === "admin";

      // Role check
      if (role === "admin" && !userIsAdmin) {
        toast.error("This account is not an admin account. Please switch to Client tab.");
        return;
      }

      if (role === "client" && userIsAdmin) {
        toast.error("This is an admin account. Please switch to Admin tab.");
        return;
      }

      // Persist auth
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("remember_me", remember ? "true" : "false");

      login(user);

      toast.success(response.data?.message || "Welcome back! Login successful.");

      if (userIsAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const data = error.response.data;
        if (error.response.status === 403) {
          toast.error(data?.message || "You do not have permission to login with this role.");
          return;
        }
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0];
          const msg = Array.isArray(firstError) ? firstError[0] : firstError;
          toast.error(msg || "Login validation failed.");
          return;
        }
        toast.error(data?.message || data?.detail || "Invalid email or password.");
        return;
      }

      if (error.request) {
        toast.error("Cannot connect to server. Please check your network connection.");
        return;
      }

      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white transition-colors duration-300">
      {/* Top Bar with Theme Switcher & Home Link */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
        >
          <span>← Back to Home</span>
        </Link>

        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          title="Toggle theme"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* ======================================================
                LEFT COLUMN: GREETING & BRAND HERO
            ====================================================== */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
              <div>
                {/* Starburst / Asterisk Geometric Icon */}
                <motion.div
                  initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <svg
                    className="w-12 h-12 text-slate-900 dark:text-white"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    {/* 8-point geometric starburst matching the design */}
                    <path d="M50 0 L58 35 L93 20 L68 50 L93 80 L58 65 L50 100 L42 65 L7 80 L32 50 L7 20 L42 35 Z" />
                  </svg>
                </motion.div>

                {/* Big Bold Greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-3"
                >
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                    Hello<br />
                    InvoiceFlow! <span className="inline-block animate-wiggle">👋</span>
                  </h1>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-md pt-2">
                    Skip repetitive and manual billing tasks. Get paid 3x faster through automated invoicing, dynamic UPI QR payments, and self-service client portals!
                  </p>
                </motion.div>
              </div>

              {/* Bottom Left Note / Features Chip */}
              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-[10px]">
                  ✓
                </div>
                <span>GST Compliant • Instant UPI Settlement • 99.9% Uptime</span>
              </div>
            </div>

            {/* ======================================================
                RIGHT COLUMN: LOGIN FORM
            ====================================================== */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white dark:bg-slate-900/60">
              <div>
                {/* Brand Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
                    InvoiceFlow
                  </span>

                  {/* Role Switcher Pills */}
                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        role === "client"
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      <User size={13} />
                      <span>Client</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        role === "admin"
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      <Building2 size={13} />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                {/* Form Title & Subtitle */}
                <div className="space-y-1 mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                    Welcome Back!
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-slate-900 underline underline-offset-2 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition"
                    >
                      Create a new account now.
                    </Link>{" "}
                    It's FREE! Takes less than a minute.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. yourname@company.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                    >
                      Remember me on this device
                    </label>
                  </div>

                  {/* Primary Submit Button: Black / Dark Pill Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <span>Signing In...</span>
                      </span>
                    ) : (
                      <span>Login Now</span>
                    )}
                  </button>

                  {/* Google Social Login Button */}
                  <GoogleAuthButton
                    role={role}
                    text="Login with Google"
                    disabled={loading}
                  />


                  {/* Forgot Password Link Below */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Forgot password?{" "}
                      <Link
                        to="/forgot-password"
                        className="font-bold text-slate-900 underline underline-offset-2 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition"
                      >
                        Click here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} InvoiceFlow. All rights reserved.
      </footer>
    </div>
  );
}