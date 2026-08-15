import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      // Django:
      // POST /api/auth/forgot-password/

      const response = await api.post(
        "/auth/forgot-password/",
        {
          email: email.trim(),
        }
      );

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setSubmitted(true);

        toast.success(
          response.data?.message ||
          "Password reset instructions have been sent."
        );
      } else {
        toast.error(
          response.data?.message ||
          "Unable to process password reset."
        );
      }
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      if (error.response) {
        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "DATA:",
          error.response.data
        );

        const message =
          error.response.data?.message ||
          error.response.data?.detail ||
          "Unable to send password reset request.";

        toast.error(message);
      } else if (error.request) {
        toast.error(
          "Cannot connect to the Django server."
        );
      } else {
        toast.error(
          "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT PANEL */}

        <div className="relative hidden overflow-hidden lg:flex">

          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg">
                  <KeyRound size={21} />
                </div>

                <div>
                  <p className="text-lg font-bold text-white">
                    InvoiceFlow
                  </p>

                  <p className="text-xs text-slate-400">
                    Business Management
                  </p>
                </div>

              </div>
            </div>

            <div className="max-w-lg">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
                <ShieldCheck size={14} />
                Secure account recovery
              </div>

              <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                Get back into your account
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-400">
                Enter your registered email address and
                we'll help you securely reset your password.
              </p>

            </div>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} InvoiceFlow.
              All rights reserved.
            </p>

          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">

          <div className="w-full max-w-md">

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={17} />
              Back to login
            </button>

            {!submitted ? (

              <div>

                <div className="mb-8">

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                    <KeyRound size={24} />
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Forgot password?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    No problem. Enter your email below and
                    we'll send you instructions to reset your
                    password.
                  </p>

                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />

                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Send Reset Link
                      </>
                    )}

                  </button>

                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                  Remember your password?{" "}

                  <Link
                    to="/login"
                    className="font-bold text-slate-900 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>

              </div>

            ) : (

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>

                <h2 className="mt-6 text-3xl font-black text-slate-900">
                  Check your email
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  If an account exists for{" "}
                  <span className="font-semibold text-slate-700">
                    {email}
                  </span>
                  , password reset instructions have
                  been sent.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <ArrowLeft size={17} />
                  Return to Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="mt-4 block w-full text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Try another email
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}