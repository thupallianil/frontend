import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileCheck,
  FileText,
  LifeBuoy,
  Lock,
  Moon,
  Receipt,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  const [openFaq, setOpenFaq] = useState(null);

  const isAuthenticated = Boolean(user);
  const dashboardLink =
    user?.is_staff || user?.role === "admin"
      ? "/admin/dashboard"
      : "/client/dashboard";

  const handleCta = () => {
    if (isAuthenticated) {
      navigate(dashboardLink);
    } else {
      navigate("/signup");
    }
  };

  const FAQS = [
    {
      q: "How does online payment collection work?",
      a: "Each invoice includes an instant payment link. Your clients can pay via Razorpay, UPI, credit/debit cards, or net banking. Once paid, the invoice automatically marks as Paid and generates an official tax receipt.",
    },
    {
      q: "Is InvoiceFlow compliant with GST and tax rules?",
      a: "Yes. The platform automatically calculates CGST, SGST, and IGST based on state codes, validates GSTIN numbers, and generates compliant PDF tax invoices ready for accounting.",
    },
    {
      q: "Can I convert Quotations into Invoices with one click?",
      a: "Yes. Once an estimate or quote is approved by your client, a single click converts the entire scope, items, and pricing into an official invoice without any re-typing.",
    },
    {
      q: "How does the Client Portal work?",
      a: "Your clients can log in securely 24/7 to view their outstanding invoices, accept quotations, make instant online payments, and download payment receipts.",
    },
    {
      q: "Can I export my data for accounting or tax filing?",
      a: "Yes. You can export invoices, payments, client lists, and financial reports directly into Excel and CSV files for your CA or accounting software at any time.",
    },
  ];

  const FEATURES = [
    {
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10",
      title: "Smart Invoicing & Quotations",
      desc: "Create professional GST-compliant invoices and estimates in seconds with automated tax calculations and instant PDF generation.",
    },
    {
      icon: CreditCard,
      color: "text-emerald-500 bg-emerald-500/10",
      title: "Online Payments & UPI",
      desc: "Collect payments seamlessly via Razorpay, UPI, cards, and net banking. Automatic payment verification and instant receipts.",
    },
    {
      icon: Users,
      color: "text-purple-500 bg-purple-500/10",
      title: "Client & Vendor Management",
      desc: "Track client balances, supplier payables, contact details, and complete billing histories in one unified ledger.",
    },
    {
      icon: BarChart3,
      color: "text-amber-500 bg-amber-500/10",
      title: "Real-Time Reports & Insights",
      desc: "Monitor your revenue, outstanding payments, monthly cash flow, and export clean financial data to Excel/CSV with one click.",
    },
    {
      icon: ShieldCheck,
      color: "text-cyan-500 bg-cyan-500/10",
      title: "Client Self-Service Portal",
      desc: "Give your clients a dedicated portal where they can view invoices, approve quotes, pay online, and access receipts 24/7.",
    },
    {
      icon: LifeBuoy,
      color: "text-rose-500 bg-rose-500/10",
      title: "Support Ticket Desk",
      desc: "Handle customer queries, service requests, and billing questions smoothly with integrated ticket tracking.",
    },
  ];

  const STEPS = [
    {
      num: "01",
      title: "Create Invoices & Quotes",
      desc: "Add your client, line items, and taxes in seconds. Professional layout designed to get approved fast.",
    },
    {
      num: "02",
      title: "Share & Collect Online",
      desc: "Send invoice links with built-in Razorpay and UPI checkout so clients can pay in a single click.",
    },
    {
      num: "03",
      title: "Track Revenue & Settle",
      desc: "Get instant receipts, automated payment status updates, and clear revenue summaries.",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ============================================================
          TOP NAVIGATION BAR
      ============================================================ */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
          darkMode
            ? "bg-slate-950/80 border-slate-800"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              InvoiceFlow
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#features"
              className={`transition-colors ${
                darkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`transition-colors ${
                darkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              How It Works
            </a>
            <a
              href="#faq"
              className={`transition-colors ${
                darkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className={`p-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to={dashboardLink}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:inline-flex px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    darkMode
                      ? "text-slate-300 hover:text-white hover:bg-slate-800"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Invoicing & Payment Management</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight lg:leading-tight mb-6">
            Effortless Invoicing & Payments <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              for Modern Businesses
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Create GST-compliant invoices in seconds, collect online payments
            instantly via UPI & Razorpay, and manage your clients and finances
            all in one simple platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={handleCta}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:-translate-y-0.5"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {!isAuthenticated && (
              <Link
                to="/login"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold border transition-all ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Sign In to Portal</span>
              </Link>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>1-Click PDF Invoicing</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>GST & Tax Auto-Calculation</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Razorpay & UPI Payments</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Client Self-Service Portal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
      ============================================================ */}
      <section
        id="features"
        className={`py-20 border-t ${
          darkMode
            ? "bg-slate-900/40 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Everything You Need
            </h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
              Designed to make billing effortless
            </p>
            <p
              className={`text-base ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              All the tools required to invoice clients, get paid on time, and
              keep your finances organized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-7 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
                    darkMode
                      ? "bg-slate-950/60 border-slate-800 hover:border-slate-700 shadow-sm"
                      : "bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2.5">{item.title}</h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section
        id="how-it-works"
        className={`py-20 border-t ${
          darkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Simple Workflow
            </h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
              Get paid in 3 easy steps
            </p>
            <p
              className={`text-base ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Say goodbye to complicated spreadsheets and manual payment follow-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl border ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-800"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <span className="text-4xl font-black text-blue-600/30 dark:text-blue-400/20 mb-4 block">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ SECTION
      ============================================================ */}
      <section
        id="faq"
        className={`py-20 border-t ${
          darkMode
            ? "bg-slate-900/30 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Questions & Answers
            </h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-xl transition-colors ${
                    darkMode
                      ? "border-slate-800 bg-slate-900/60"
                      : "border-slate-200 bg-slate-50/70"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      className={`px-6 pb-5 text-sm leading-relaxed border-t pt-3 ${
                        darkMode
                          ? "border-slate-800 text-slate-400"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA BANNER
      ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 sm:p-12 text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to simplify your business invoicing?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-8">
              Start creating professional invoices and collecting payments today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCta}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all hover:scale-105"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BEST SIMPLE FOOTER
      ============================================================ */}
      <footer
        className={`border-t py-12 transition-colors ${
          darkMode
            ? "bg-slate-950 border-slate-800 text-slate-400"
            : "bg-white border-slate-200 text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  InvoiceFlow
                </span>
              </div>
              <p className="text-sm max-w-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Simple, powerful invoicing, quotations, and payment collection
                built for growing businesses and professionals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#features" className="hover:text-blue-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-blue-600 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Portals & Auth */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Account & Portals
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/login" className="hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-blue-600 transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="hover:text-blue-600 transition-colors">
                    Forgot Password
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} InvoiceFlow. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Secure Cloud Invoicing</span>
              <span>•</span>
              <span>Razorpay & UPI Enabled</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
