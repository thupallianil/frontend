import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
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
  TrendingUp,
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
      icon: FileText,
    },
    {
      num: "02",
      title: "Share & Collect Online",
      desc: "Send invoice links with built-in Razorpay and UPI checkout so clients can pay in a single click.",
      icon: CreditCard,
    },
    {
      num: "03",
      title: "Track Revenue & Settle",
      desc: "Get instant receipts, automated payment status updates, and clear revenue summaries.",
      icon: TrendingUp,
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ============================================================
          TOP NAVIGATION BAR
      ============================================================ */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
          darkMode
            ? "bg-slate-950/85 border-slate-800/80"
            : "bg-white/85 border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25"
            >
              <Receipt className="w-5 h-5" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              InvoiceFlow
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#features"
              className={`transition-colors duration-150 relative py-1 hover:text-blue-600 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`transition-colors duration-150 relative py-1 hover:text-blue-600 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              How It Works
            </a>
            <a
              href="#faq"
              className={`transition-colors duration-150 relative py-1 hover:text-blue-600 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className={`p-2 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 shadow-inner"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={dashboardLink}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:inline-flex px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    darkMode
                      ? "text-slate-300 hover:text-white hover:bg-slate-800"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Dynamic Animated Ambient Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/20 blur-3xl pointer-events-none rounded-full"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Next-Gen Invoicing & Billing Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight lg:leading-tight mb-6"
          >
            Effortless Invoicing & Payments <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              for Growing Businesses
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Create GST-ready invoices in seconds, collect payments instantly via
            UPI & Razorpay, and manage your clients and finances with zero
            complexity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCta}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {!isAuthenticated && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  to="/login"
                  className={`w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold border transition-all ${
                    darkMode
                      ? "bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Sign In to Portal</span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800/80"
          >
            {[
              "1-Click PDF Invoices",
              "GST & Auto Tax Engine",
              "UPI & Razorpay Ready",
              "Client Self-Service Portal",
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
      ============================================================ */}
      <section
        id="features"
        className={`py-20 border-t ${
          darkMode
            ? "bg-slate-900/30 border-slate-800"
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
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`p-7 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    darkMode
                      ? "bg-slate-950/60 border-slate-800 hover:border-slate-700 shadow-sm"
                      : "bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color} group-hover:scale-110 transition-transform duration-200`}
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS (3 SIMPLE STEPS)
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
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  whileHover={{ y: -6 }}
                  className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ SECTION (ANIMATED ACCORDION)
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
                  className={`border rounded-2xl overflow-hidden transition-colors ${
                    darkMode
                      ? "border-slate-800 bg-slate-900/60"
                      : "border-slate-200 bg-slate-50/70"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4.5 px-6 text-left flex items-center justify-between gap-4 font-semibold text-base"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-6 pb-5 text-sm leading-relaxed border-t pt-3.5 ${
                            darkMode
                              ? "border-slate-800 text-slate-400"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          DYNAMIC CTA BANNER
      ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 sm:p-12 text-center shadow-2xl shadow-blue-600/30 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to simplify your business invoicing?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-8">
              Start creating professional invoices and collecting payments today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCta}
              className="px-8 py-3.5 rounded-xl text-base font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-xl transition-all cursor-pointer"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
            </motion.button>
          </div>
        </motion.div>
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
