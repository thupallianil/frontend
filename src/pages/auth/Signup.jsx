import { useState } from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ============================================================
// SIGNUP PAGE
// ============================================================

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("admin"); // "admin" | "client"

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree,               setAgree]               = useState(false);
  const [loading,             setLoading]             = useState(false);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const passwordStrength = getPasswordStrength(form.password);

  const isAdmin = role === "admin";

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim())          { toast.error("Please enter your full name");              return; }
    if (!form.email.trim())         { toast.error("Please enter your email");                  return; }
    if (!form.password)             { toast.error("Please create a password");                 return; }
    if (form.password.length < 8)   { toast.error("Password must be at least 8 characters");  return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match");       return; }
    if (!agree)                     { toast.error("Please accept the terms and conditions");   return; }

    setLoading(true);

    try {
      const response = await api.post("/auth/register/", {
        username:         form.name.trim(),
        email:            form.email.trim().toLowerCase(),
        password:         form.password,
        password_confirm: form.confirmPassword,
        role,
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Registration failed.");
        return;
      }

      const accessToken  = response.data?.data?.tokens?.access;
      const refreshToken = response.data?.data?.tokens?.refresh;
      const user         = response.data?.data?.user;

      if (accessToken)  localStorage.setItem("access_token",  accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      if (user) {
        localStorage.setItem("user",      JSON.stringify(user));
        localStorage.setItem("auth_user", JSON.stringify(user));
      }

      // Sync context
      if (user) login(user);

      toast.success(response.data?.message || "Account created successfully!");

      // Redirect based on actual role from backend
      const userIsAdmin =
        user?.is_staff === true ||
        user?.is_superuser === true ||
        user?.role === "admin";

      const destination = userIsAdmin
        ? "/admin/dashboard"
        : "/client/dashboard";

      setTimeout(() => navigate(destination, { replace: true }), 400);

    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        if (data?.errors) {
          const first = Object.values(data.errors)[0];
          const msg = Array.isArray(first) ? first[0] : first;
          toast.error(msg);
          return;
        }

        toast.error(data?.message || data?.detail || "Registration failed.");
      } else if (error.request) {
        toast.error("Cannot connect to the server.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md py-8">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-xl">
            <LockKeyhole size={26} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">InvoiceFlow</p>
            <p className="text-sm text-slate-400">Business Management Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">

          {/* Role selector tabs */}
          <div className="mb-7 flex rounded-2xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                isAdmin
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 size={16} />
              Admin
            </button>

            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                !isAdmin
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User size={16} />
              Client
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">
              {isAdmin ? "Create Admin Account" : "Create Client Account"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isAdmin
                ? "Set up your business and manage everything from one place"
                : "Create an account to view invoices and make payments"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-slate-300">
                Full name
              </label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Password strength */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          passwordStrength.level >= level
                            ? passwordStrength.bar
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-semibold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="signup-confirm" className="mb-1.5 block text-sm font-semibold text-slate-300">
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 disabled:opacity-50 ${
                    form.confirmPassword && form.confirmPassword !== form.password
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p className="mt-1 text-xs font-semibold text-red-400">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2.5 py-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                disabled={loading}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-white/5 accent-indigo-500"
              />
              <span className="text-xs leading-5 text-slate-400">
                I agree to the{" "}
                <button type="button" className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Terms of Service
                </button>
                {" "}and{" "}
                <button type="button" className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create {isAdmin ? "Admin" : "Client"} Account
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </form>

          {/* Role info box */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className={isAdmin ? "text-indigo-400" : "text-emerald-400"} />
              <p className="text-sm font-semibold text-white">
                {isAdmin ? "Admin account features" : "Client account features"}
              </p>
            </div>
            <div className="space-y-1.5">
              {(isAdmin
                ? ["Manage clients, quotes & invoices", "Track payments & receipts", "Full settings & business profile", "Reports & analytics dashboard"]
                : ["View your invoices & quotes", "Make payments online", "Download PDF invoices", "View payment history"]
              ).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className={isAdmin ? "text-indigo-400" : "text-emerald-400"} />
                  <span className="text-xs text-slate-400">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-400 hover:text-indigo-300 transition hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

// ============================================================
// PASSWORD STRENGTH HELPER
// ============================================================

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "", bar: "", text: "" };

  let score = 0;
  if (password.length >= 8)                    score++;
  if (/[A-Z]/.test(password))                 score++;
  if (/[0-9]/.test(password))                 score++;
  if (/[^A-Za-z0-9]/.test(password))          score++;

  const map = [
    { level: 1, label: "Weak",   bar: "bg-red-500",    text: "text-red-400"    },
    { level: 2, label: "Fair",   bar: "bg-amber-500",  text: "text-amber-400"  },
    { level: 3, label: "Good",   bar: "bg-blue-500",   text: "text-blue-400"   },
    { level: 4, label: "Strong", bar: "bg-emerald-500",text: "text-emerald-400"},
  ];

  return map[score - 1] || map[0];
}