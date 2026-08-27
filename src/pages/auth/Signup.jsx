import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  User,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  // Role: "client" or "admin"
  const [role, setRole] = useState("client");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin";

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // PASSWORD STRENGTH
  // ============================================================

  const passwordStrength = getPasswordStrength(form.password);

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!form.password) {
      toast.error("Please create a password.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!agree) {
      toast.error("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register/", {
        username: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        password_confirm: form.confirmPassword,
        role,
      });

      if (!response.data?.success) {
        toast.error(
          response.data?.message || "Registration failed."
        );
        return;
      }

      const accessToken =
        response.data?.data?.tokens?.access;

      const refreshToken =
        response.data?.data?.tokens?.refresh;

      const user =
        response.data?.data?.user;

      // Save tokens
      if (accessToken) {
        localStorage.setItem(
          "access_token",
          accessToken
        );
      }

      if (refreshToken) {
        localStorage.setItem(
          "refresh_token",
          refreshToken
        );
      }

      // Save user
      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "auth_user",
          JSON.stringify(user)
        );
      }

      // Sync authentication context
      if (user) {
        login(user);
      }

      toast.success(
        response.data?.message ||
        "Account created successfully!"
      );

      // Determine actual backend role
      const userIsAdmin =
        user?.is_staff === true ||
        user?.is_superuser === true ||
        user?.role === "admin";

      if (userIsAdmin) {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/client/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        const data = error.response.data;

        // Django validation errors
        if (data?.errors) {
          const firstError =
            Object.values(data.errors)[0];

          const message = Array.isArray(firstError)
            ? firstError[0]
            : firstError;

          toast.error(
            message || "Registration validation failed."
          );

          return;
        }

        toast.error(
          data?.message ||
          data?.detail ||
          "Registration failed."
        );

        return;
      }

      if (error.request) {
        toast.error(
          "Cannot connect to server. Please check your network connection."
        );

        return;
      }

      toast.error(
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // GOOGLE SIGNUP
  // ============================================================

  const handleGoogleSignupMock = () => {
    toast(
      "Google OAuth integration can be configured in backend settings.",
      {
        icon: "ℹ️",
      }
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white transition-colors duration-300">

      {/* ======================================================
          TOP BAR
      ====================================================== */}

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
          {darkMode ? (
            <Sun size={15} />
          ) : (
            <Moon size={15} />
          )}
        </button>
      </div>

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">

        <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">

            {/* ==================================================
                LEFT COLUMN
            ================================================== */}

            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">

              <div>

                {/* Logo / Icon */}

                <motion.div
                  initial={{
                    rotate: -45,
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="mb-8"
                >
                  <svg
                    className="w-12 h-12 text-slate-900 dark:text-white"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <path d="M50 0 L58 35 L93 20 L68 50 L93 80 L58 65 L50 100 L42 65 L7 80 L32 50 L7 20 L42 35 Z" />
                  </svg>
                </motion.div>

                {/* Heading */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                  }}
                  className="space-y-3"
                >
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                    Create
                    <br />
                    your account!{" "}
                    <span className="inline-block">
                      👋
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-md pt-2">
                    Start managing your invoices,
                    payments, clients, and business
                    operations with InvoiceFlow.
                  </p>
                </motion.div>

                {/* Feature List */}

                <div className="mt-10 space-y-4">

                  <SignupFeature
                    icon={<Check size={14} />}
                    title="Fast & Simple"
                    text="Create your account in less than a minute."
                  />

                  <SignupFeature
                    icon={<ShieldCheck size={14} />}
                    title="Secure"
                    text="Your account and business data stay protected."
                  />

                  <SignupFeature
                    icon={<Users size={14} />}
                    title="Built for Business"
                    text="Manage clients, invoices and payments easily."
                  />

                </div>

              </div>

              {/* Bottom note */}

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">

                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-[10px]">
                  ✓
                </div>

                <span>
                  GST Compliant • Instant UPI Settlement • 99.9% Uptime
                </span>

              </div>

            </div>

            {/* ==================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white dark:bg-slate-900/60">

              <div>

                {/* Brand + Role */}

                <div className="flex items-center justify-between mb-8">

                  <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
                    InvoiceFlow
                  </span>

                  {/* Role Switcher */}

                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">

                    {/* Client */}

                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      disabled={loading}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${role === "client"
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        }`}
                    >
                      <User size={13} />
                      <span>Client</span>
                    </button>

                    {/* Admin */}

                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      disabled={loading}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${role === "admin"
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        }`}
                    >
                      <Building2 size={13} />
                      <span>Admin</span>
                    </button>

                  </div>

                </div>

                {/* Title */}

                <div className="space-y-1 mb-6">

                  <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                    Create your account
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}

                    <Link
                      to="/login"
                      className="font-semibold text-slate-900 underline underline-offset-2 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition"
                    >
                      Sign in here.
                    </Link>
                  </p>

                </div>

                {/* ==================================================
                    SIGNUP FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* Full Name */}

                  <div>

                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Full Name
                    </label>

                    <div className="relative">

                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          updateField(
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="e.g. John Doe"
                        autoComplete="name"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition disabled:opacity-50"
                      />

                      <User
                        size={16}
                        className="absolute right-3 top-2.5 text-slate-400"
                      />

                    </div>

                  </div>

                  {/* Email */}

                  <div>

                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email Address
                    </label>

                    <div className="relative">

                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="e.g. yourname@company.com"
                        autoComplete="email"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition disabled:opacity-50"
                      />

                      <Mail
                        size={16}
                        className="absolute right-3 top-2.5 text-slate-400"
                      />

                    </div>

                  </div>

                  {/* Password */}

                  <div>

                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <input
                        id="signup-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        required
                        value={form.password}
                        onChange={(e) =>
                          updateField(
                            "password",
                            e.target.value
                          )
                        }
                        placeholder="Create a password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-20 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition disabled:opacity-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>

                    </div>

                    {/* Password strength */}

                    {form.password && (
                      <div className="mt-2">

                        <div className="flex gap-1">

                          {[1, 2, 3, 4].map(
                            (level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-all ${passwordStrength.level >=
                                    level
                                    ? passwordStrength.bar
                                    : "bg-slate-200 dark:bg-slate-800"
                                  }`}
                              />
                            )
                          )}

                        </div>

                        <p
                          className={`mt-1 text-[10px] font-semibold ${passwordStrength.text}`}
                        >
                          {passwordStrength.label}
                        </p>

                      </div>
                    )}

                  </div>

                  {/* Confirm Password */}

                  <div>

                    <label
                      htmlFor="signup-confirm"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">

                      <input
                        id="signup-confirm"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        required
                        value={form.confirmPassword}
                        onChange={(e) =>
                          updateField(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        disabled={loading}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 pr-20 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 transition dark:bg-slate-950 dark:text-slate-100 disabled:opacity-50 ${form.confirmPassword &&
                            form.confirmPassword !==
                            form.password
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500/60"
                            : "border-slate-200 focus:border-slate-900 focus:ring-slate-900 dark:border-slate-800 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>

                    </div>

                    {form.confirmPassword &&
                      form.confirmPassword !==
                      form.password && (
                        <p className="mt-1 text-[10px] font-semibold text-red-500">
                          Passwords do not match
                        </p>
                      )}

                  </div>

                  {/* Terms */}

                  <div className="flex items-start gap-2 pt-1">

                    <input
                      id="terms"
                      type="checkbox"
                      checked={agree}
                      onChange={(e) =>
                        setAgree(e.target.checked)
                      }
                      disabled={loading}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    />

                    <label
                      htmlFor="terms"
                      className="text-xs leading-5 text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                    >
                      I agree to the{" "}

                      <button
                        type="button"
                        className="font-semibold text-slate-900 underline underline-offset-2 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                      >
                        Terms of Service
                      </button>

                      {" "}and{" "}

                      <button
                        type="button"
                        className="font-semibold text-slate-900 underline underline-offset-2 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                      >
                        Privacy Policy
                      </button>
                    </label>

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >

                    {loading ? (
                      <span className="inline-flex items-center gap-2">

                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white dark:border-slate-300 dark:border-t-slate-900 animate-spin" />

                        <span>
                          Creating Account...
                        </span>

                      </span>
                    ) : (
                      <>
                        <span>
                          Create{" "}
                          {isAdmin
                            ? "Admin"
                            : "Client"}{" "}
                          Account
                        </span>

                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}

                  </button>

                  {/* Google */}

                  <button
                    type="button"
                    onClick={handleGoogleSignupMock}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                  >

                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>

                    <span>
                      Sign up with Google
                    </span>

                  </button>

                </form>

                {/* Account type information */}

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">

                  <div className="flex items-center gap-2 mb-2">

                    {isAdmin ? (
                      <Building2
                        size={15}
                        className="text-blue-500"
                      />
                    ) : (
                      <User
                        size={15}
                        className="text-emerald-500"
                      />
                    )}

                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      {isAdmin
                        ? "Admin Account"
                        : "Client Account"}
                    </p>

                  </div>

                  <div className="grid grid-cols-1 gap-1">

                    {(isAdmin
                      ? [
                        "Manage clients, quotes & invoices",
                        "Track payments & receipts",
                        "Business profile & settings",
                        "Reports & analytics",
                      ]
                      : [
                        "View invoices & quotes",
                        "Make payments online",
                        "Download PDF invoices",
                        "View payment history",
                      ]
                    ).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2
                          size={12}
                          className={
                            isAdmin
                              ? "text-blue-500"
                              : "text-emerald-500"
                          }
                        />

                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {feature}
                        </span>
                      </div>
                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} InvoiceFlow. All rights reserved.
      </footer>

    </div>
  );
}

// ============================================================
// FEATURE COMPONENT
// ============================================================

function SignupFeature({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {text}
        </p>
      </div>

    </div>
  );
}

// ============================================================
// PASSWORD STRENGTH
// ============================================================

function getPasswordStrength(password) {
  if (!password) {
    return {
      level: 0,
      label: "",
      bar: "",
      text: "",
    };
  }

  let score = 0;

  if (password.length >= 8) {
    score++;
  }

  if (/[A-Z]/.test(password)) {
    score++;
  }

  if (/[0-9]/.test(password)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  const map = [
    {
      level: 1,
      label: "Weak",
      bar: "bg-red-500",
      text: "text-red-500",
    },
    {
      level: 2,
      label: "Fair",
      bar: "bg-amber-500",
      text: "text-amber-500",
    },
    {
      level: 3,
      label: "Good",
      bar: "bg-blue-500",
      text: "text-blue-500",
    },
    {
      level: 4,
      label: "Strong",
      bar: "bg-emerald-500",
      text: "text-emerald-500",
    },
  ];

  return map[score - 1] || map[0];
}