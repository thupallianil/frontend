import { useState } from "react";

import {
  ArrowRight,
  Building2,
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
// LOGIN PAGE
// ============================================================

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  // New public accounts are created as CLIENT.
  const [role, setRole] = useState("client");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // ------------------------------------------------------
      // LOGIN REQUEST
      // ------------------------------------------------------

      console.log(
        "LOGIN REQUEST:",
        {
          email: email.trim(),
          role,
        }
      );

      const response = await api.post(
        "/auth/login/",
        {
          email: email.trim().toLowerCase(),
          password,
          role,
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      // ------------------------------------------------------
      // BACKEND SUCCESS CHECK
      // ------------------------------------------------------

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
          "Login failed."
        );

        return;
      }

      // ------------------------------------------------------
      // EXTRACT DATA
      // ------------------------------------------------------

      const accessToken =
        response.data?.data?.tokens?.access;

      const refreshToken =
        response.data?.data?.tokens?.refresh;

      const user =
        response.data?.data?.user;

      // ------------------------------------------------------
      // CHECK TOKENS
      // ------------------------------------------------------

      if (!accessToken) {
        toast.error(
          "Access token was not received."
        );

        return;
      }

      if (!refreshToken) {
        toast.error(
          "Refresh token was not received."
        );

        return;
      }

      if (!user) {
        toast.error(
          "User information was not received."
        );

        return;
      }

      // ------------------------------------------------------
      // DETERMINE ACTUAL ROLE
      // ------------------------------------------------------

      const userIsAdmin =
        user?.is_staff === true ||
        user?.is_superuser === true ||
        user?.role === "admin";

      // ------------------------------------------------------
      // FRONTEND ROLE VALIDATION
      // ------------------------------------------------------

      if (
        role === "admin" &&
        !userIsAdmin
      ) {
        toast.error(
          "This account is not an admin account. Please use the Client tab."
        );

        return;
      }

      if (
        role === "client" &&
        userIsAdmin
      ) {
        toast.error(
          "This is an admin account. Please use the Admin tab."
        );

        return;
      }

      // ------------------------------------------------------
      // SAVE AUTHENTICATION
      // ------------------------------------------------------

      localStorage.setItem(
        "access_token",
        accessToken
      );

      localStorage.setItem(
        "refresh_token",
        refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "auth_user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "remember_me",
        remember
          ? "true"
          : "false"
      );

      // ------------------------------------------------------
      // UPDATE AUTH CONTEXT
      // ------------------------------------------------------

      login(user);

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      toast.success(
        response.data?.message ||
        "Login successful!"
      );

      // ------------------------------------------------------
      // REDIRECT
      // ------------------------------------------------------

      if (userIsAdmin) {
        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );
      } else {
        navigate(
          "/client/dashboard",
          {
            replace: true,
          }
        );
      }

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      // ------------------------------------------------------
      // BACKEND ERROR
      // ------------------------------------------------------

      if (error.response) {
        console.error(
          "LOGIN STATUS:",
          error.response.status
        );

        console.error(
          "LOGIN DATA:",
          error.response.data
        );

        const data =
          error.response.data;

        // Role mismatch
        if (
          error.response.status === 403
        ) {
          toast.error(
            data?.message ||
            "You do not have permission to login with this role."
          );

          return;
        }

        // Validation errors
        if (
          data?.errors
        ) {
          const firstError =
            Object.values(
              data.errors
            )[0];

          const message =
            Array.isArray(firstError)
              ? firstError[0]
              : firstError;

          toast.error(
            message ||
            "Login validation failed."
          );

          return;
        }

        toast.error(
          data?.message ||
          data?.detail ||
          "Invalid email or password."
        );

        return;
      }

      // ------------------------------------------------------
      // NETWORK ERROR
      // ------------------------------------------------------

      if (error.request) {
        toast.error(
          "Cannot connect to the Django server."
        );

        return;
      }

      // ------------------------------------------------------
      // UNKNOWN ERROR
      // ------------------------------------------------------

      toast.error(
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CURRENT UI ROLE
  // ==========================================================

  const isAdmin =
    role === "admin";

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      </div>

      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div className="relative w-full max-w-md">

        {/* ====================================================
            LOGO
        ==================================================== */}

        <div className="mb-8 flex flex-col items-center gap-3 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-xl">

            <LockKeyhole
              size={26}
              className="text-white"
            />

          </div>

          <div>

            <p className="text-2xl font-black text-white tracking-tight">
              InvoiceFlow
            </p>

            <p className="text-sm text-slate-400">
              Business Management Platform
            </p>

          </div>

        </div>

        {/* ====================================================
            CARD
        ==================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">

          {/* ==================================================
              ROLE SELECTOR
          ================================================== */}

          <div className="mb-7 flex rounded-2xl bg-white/5 border border-white/10 p-1">

            {/* ADMIN */}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setRole("admin")
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${isAdmin
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
                } disabled:cursor-not-allowed disabled:opacity-60`}
            >

              <Building2
                size={16}
              />

              Admin

            </button>

            {/* CLIENT */}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setRole("client")
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${!isAdmin
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
                } disabled:cursor-not-allowed disabled:opacity-60`}
            >

              <User
                size={16}
              />

              Client

            </button>

          </div>

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-6">

            <h2 className="text-2xl font-black text-white">

              {isAdmin
                ? "Admin Login"
                : "Client Login"}

            </h2>

            <p className="mt-1 text-sm text-slate-400">

              {isAdmin
                ? "Sign in to manage your business dashboard"
                : "Sign in to view your invoices and payments"}

            </p>

          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-slate-300"
              >
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <div className="mb-1.5 flex items-center justify-between">

                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-slate-300"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}

                </button>

              </div>

            </div>

            {/* =================================================
                REMEMBER ME
            ================================================= */}

            <label className="flex cursor-pointer items-center gap-2.5">

              <input
                type="checkbox"
                checked={remember}
                onChange={(event) =>
                  setRemember(
                    event.target.checked
                  )
                }
                disabled={loading}
                className="h-4 w-4 rounded border-slate-600 bg-white/5 accent-indigo-500"
              />

              <span className="text-sm text-slate-400">
                Remember me
              </span>

            </label>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Signing in...
                </>
              ) : (
                <>
                  Sign in as{" "}
                  {isAdmin
                    ? "Admin"
                    : "Client"}

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>

          {/* ==================================================
              DIVIDER
          ================================================== */}

          <div className="my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-500">
              or
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          {/* ==================================================
              INFO BOX
          ================================================== */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

            <div className="flex items-center gap-2 mb-1.5">

              <ShieldCheck
                size={16}
                className="text-emerald-400"
              />

              <p className="text-sm font-semibold text-white">

                {isAdmin
                  ? "Admin account"
                  : "Client account"}

              </p>

            </div>

            <p className="text-xs leading-5 text-slate-400">

              {isAdmin
                ? "Admin accounts have full access to manage clients, invoices, quotes, payments and settings."
                : "Client accounts can view invoices, quotes and make payments."}

            </p>

          </div>

          {/* ==================================================
              SIGNUP
          ================================================== */}

          <p className="mt-6 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="font-bold text-indigo-400 hover:text-indigo-300 transition hover:underline"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}