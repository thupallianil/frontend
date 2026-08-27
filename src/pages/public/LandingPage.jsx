import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileSignature,
  FileText,
  Globe,
  HelpCircle,
  IndianRupee,
  Layers,
  LifeBuoy,
  Lock,
  Moon,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  WalletCards,
  Zap,
  Flame,
  RotateCcw,
  Sliders,
  Settings2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  // ============================================================
  // LIVE API METRICS STATE
  // ============================================================
  const [liveStats, setLiveStats] = useState({
    total_businesses: 1,
    total_clients: 0,
    total_invoices: 0,
    total_quotes: 0,
    total_vendors: 0,
    total_volume: 0,
    uptime_percentage: 99.98,
    is_live_data: true,
  });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await api.get("/public-stats/");
        if (res?.data?.data) {
          setLiveStats(res.data.data);
        }
      } catch (err) {
        console.log("Live stats fallback initialized:", err?.message);
      }
    };
    fetchLiveStats();
  }, []);

  // ============================================================
  // INTERACTIVE TABBED STUDIO & WORKSPACE SHOWCASE
  // ============================================================
  const [activeTab, setActiveTab] = useState("invoicing");
  const [activeWorkRole, setActiveWorkRole] = useState("enterprise");

  // ============================================================
  // DYNAMIC PRICING SUITE STATE
  // ============================================================
  const [pricingCycle, setPricingCycle] = useState("annual"); // "monthly" | "annual"
  const [pricingCurrency, setPricingCurrency] = useState("INR"); // "INR" | "USD" | "EUR" | "GBP" | "AED"
  const [pricingAudience, setPricingAudience] = useState("all");
  const [pricingInvoicesVolume, setPricingInvoicesVolume] = useState(75);
  const [pricingTeamSeats, setPricingTeamSeats] = useState(3);
  const [selectedAddons, setSelectedAddons] = useState(["whatsapp", "multi_gateway"]);


  // ============================================================
  // FAQ INTERACTIVE FILTER & ACCORDION
  // ============================================================
  const [faqSearch, setFaqSearch] = useState("");
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  const FAQ_ITEMS = [
    {
      q: "Is InvoiceFlow fully compliant with Indian GST laws and tax matrices?",
      a: "Yes! The platform automatically calculates CGST, SGST, and IGST based on client state rules, validates GSTIN format, and formats official PDF invoices suitable for filing and auditor verification.",
      tag: "GST & Tax",
    },
    {
      q: "How does online payment collection & settlement work?",
      a: "Invoices support one-click online payment via Razorpay, Stripe, NetBanking, and Direct UPI. Payment statuses update instantly in real time and automatically generate official tax receipts for your clients.",
      tag: "Online Payments",
    },
    {
      q: "Can I manage suppliers, vendor liabilities, and purchase accounts?",
      a: "Yes! The built-in Vendors & Procurement directory lets you store supplier profiles, GSTIN, PAN, bank accounts, IFSC, UPI IDs, and track overdue supplier liabilities with scheduled payout alerts.",
      tag: "Vendors & Payables",
    },
    {
      q: "How does the Client Self-Service Portal operate?",
      a: "Clients receive their own portal credentials. They can securely log in 24/7 to accept quotations, pay invoices online via Razorpay/UPI, download tax receipts, and raise support tickets directly.",
      tag: "Client Portal",
    },
    {
      q: "Can I convert Quotations into Invoices in 1-click?",
      a: "Absolutely. Once an estimate or quote is approved by your client, a single click converts the entire scope, line items, and taxes into a finalized invoice without any re-typing.",
      tag: "Quotes & Billing",
    },
    {
      q: "Is data exportable to Excel, CSV, or accounting software?",
      a: "Yes. All invoices, client CRM ledgers, vendor accounts, payments, and financial summaries can be exported in 1-click to CSV or Excel for your CA or accounting team.",
      tag: "Export & Reports",
    },
  ];

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return FAQ_ITEMS;
    const q = faqSearch.toLowerCase();
    return FAQ_ITEMS.filter((item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q));
  }, [faqSearch]);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      if (user?.is_staff || user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/0 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-[700px] -left-40 w-[650px] h-[550px] bg-gradient-to-tr from-cyan-500/15 to-blue-500/0 blur-3xl opacity-60 dark:opacity-30" />
        <div className="absolute top-[1400px] -right-40 w-[650px] h-[550px] bg-gradient-to-bl from-indigo-500/15 to-pink-500/0 blur-3xl opacity-60 dark:opacity-30" />
      </div>

      {/* ============================================================
          TOP NAVIGATION BAR
      ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              <Receipt size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-slate-100 dark:to-blue-200 bg-clip-text text-transparent">
                InvoiceFlow
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Enterprise Billing OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#showcase" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Modules
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              FAQ
            </a>
          </nav>


          {/* Action CTAs & Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Toggle dark/light mode"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleCtaClick}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
                >
                  <span>Start Free</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO SECTION WITH DYNAMIC LIVE METRICS STRIP
      ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Dynamic Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-800/80 dark:bg-blue-950/70 dark:text-blue-300 shadow-xs"
            >
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Version 2.0 • Dynamic Invoicing, Vendors Hub & Live Payment Gateways</span>
              <ArrowRight size={12} />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]"
            >
              The Next-Generation Billing & Invoicing OS,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Built to Scale.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Generate tax-compliant invoices in seconds, collect payments online via Razorpay, Stripe & Cards, track quotes, manage supplier liabilities, and provide client self-service portals—all from a single unified workspace.
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition active:scale-[0.98] cursor-pointer"
              >
                <span>{isAuthenticated ? "Enter Workspace Dashboard" : "Start 14-Day Free Trial"}</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="#showcase"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-base font-bold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
              >
                <Layers size={17} className="text-blue-600" />
                <span>Explore Modules</span>
              </a>
            </motion.div>

            {/* Live Database API Aggregates Pulse Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Live System & Database Pulse
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-500/20">
                  ⚡ Connected Live API
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50/80 p-3 text-center dark:bg-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspaces</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {liveStats.total_businesses.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">Active Business Units</span>
                </div>

                <div className="rounded-2xl bg-slate-50/80 p-3 text-center dark:bg-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Accounts</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {liveStats.total_clients.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">Portal Accounts</span>
                </div>

                <div className="rounded-2xl bg-slate-50/80 p-3 text-center dark:bg-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoices & Quotes</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {(liveStats.total_invoices + liveStats.total_quotes).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">Generated Documents</span>
                </div>

                <div className="rounded-2xl bg-slate-50/80 p-3 text-center dark:bg-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suppliers</p>
                  <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                    {liveStats.total_vendors.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">Vendor Profiles</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: PRODUCT SHOWCASE TABS
      ============================================================ */}
      <section id="showcase" className="py-20 border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20">

              <Layers size={14} className="text-indigo-600" />
              <span>Full Operational Suite</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              End-to-End Enterprise Workflows
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Explore how Invoices, Quotations, Vendors, Payments, Client Portals, and Financial Analytics interact seamlessly.
            </p>
          </div>

          {/* Showcase Tabs */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-100 pb-3 dark:border-slate-800">
              {[
                { id: "invoicing", label: "Smart Invoices", icon: Receipt },
                { id: "quotes", label: "Quotations", icon: FileText },
                { id: "vendors", label: "Vendors & Payables", icon: Building2 },
                { id: "payments", label: "UPI & Checkout", icon: WalletCards },
                { id: "portal", label: "Client Portal", icon: Users },
                { id: "reports", label: "Financial Reports", icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-600"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Preview Display Window */}
            <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 min-h-[320px]">
              
              {/* TAB 1: INVOICES */}
              {activeTab === "invoicing" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Invoices Ledger</h4>
                      <p className="text-xs text-slate-500">Auto-incrementing sequence, tax breakdown, and instant download</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      ₹ {Number(liveStats.total_paid_volume || 0).toLocaleString()} Processed & Settled
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { inv: "INV-2026-001", client: "Starlight Digital Tech", amount: "₹ 84,000", status: "Paid", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300", date: "Today" },
                      { inv: "INV-2026-002", client: "Nexus Cloud Logistics", amount: "₹ 1,25,000", status: "Partially Paid", badge: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300", date: "Yesterday" },
                      { inv: "INV-2026-003", client: "Vertex Media Agency", amount: "₹ 48,000", status: "Sent", badge: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300", date: "2 days ago" },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs dark:bg-blue-500/10 dark:text-blue-400">
                            {row.client.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{row.client}</p>
                            <p className="font-mono text-[11px] text-slate-400">{row.inv} • {row.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">{row.amount}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${row.badge}`}>{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: QUOTES */}
              {activeTab === "quotes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quotation Pipeline & 1-Click Conversion</h4>
                      <p className="text-xs text-slate-500">Send proposals, let clients approve digitally, and convert directly</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                      {liveStats.total_quotes > 0 ? `${liveStats.total_quotes} Quotes Created` : "High Acceptance Velocity"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">QUO-2026-084</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">Client Approved</span>
                      </div>
                      <h5 className="mt-2 font-bold text-xs text-slate-900 dark:text-slate-100">Enterprise Cloud Architecture Migration</h5>
                      <p className="mt-1 text-[11px] text-slate-500">Client: Starlight Corp</p>
                      <div className="mt-3 flex items-center justify-between border-t border-emerald-200/60 pt-2 dark:border-emerald-900/60">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">₹ 2,40,000</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          <span>1-Click Auto-Convert Ready</span>
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-500">QUO-2026-085</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">Sent to Client</span>
                      </div>
                      <h5 className="mt-2 font-bold text-xs text-slate-900 dark:text-slate-100">Annual Retainer & Maintenance Scope</h5>
                      <p className="mt-1 text-[11px] text-slate-500">Client: Horizon Software Solutions</p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">₹ 1,15,000</span>
                        <span className="text-[11px] text-slate-400">Awaiting Digital Signature</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: VENDORS */}
              {activeTab === "vendors" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Internal Vendor Directory & Payouts Ledger</h4>
                      <p className="text-xs text-slate-500">Manage supplier bank details, IFSC, GSTIN, PAN, and payment terms internally</p>
                    </div>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
                      {liveStats.total_vendors} Active Suppliers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: "Apex Raw Materials Ltd", category: "Raw Materials", gstin: "27AAACA1234A1Z1", bank: "HDFC Bank (Ac: ...5678, IFSC: HDFC0001234)", terms: "Net 30" },
                      { name: "CloudScale Server Hosting", category: "IT & Infrastructure", gstin: "29BBBBB4321B1Z2", bank: "ICICI Bank (UPI: pay@cloudscale)", terms: "Due on Receipt" },
                    ].map((v, i) => (
                      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">{v.name}</h5>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{v.category}</span>
                        </div>
                        <div className="text-[11px] space-y-1 text-slate-500 dark:text-slate-400">
                          <p><span className="font-semibold text-slate-700 dark:text-slate-300">GSTIN:</span> <span className="font-mono">{v.gstin}</span></p>
                          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Payout Details:</span> {v.bank}</p>
                          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Payment Terms:</span> {v.terms}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PAYMENTS & GATEWAYS */}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Multi-Channel Online Gateway Settlement</h4>
                      <p className="text-xs text-slate-500">Collect payments via Razorpay, Stripe, NetBanking, Cards, and Direct Bank Transfer</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Auto-Reconciled
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-xs">
                      <WalletCards size={36} />
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Check size={12} /> Auto-updates invoice status to Paid
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">Zero Payment Friction</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        When clients pay through integrated gateways or cards, payment receipts with full tax breakdowns are instantly generated and dispatched to client email addresses automatically.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CLIENT PORTAL */}
              {activeTab === "portal" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Client Self-Service Experience</h4>
                      <p className="text-xs text-slate-500">24/7 dedicated portal login for clients to review quotes, download receipts, and open tickets</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                      {liveStats.total_clients} Active Portal Clients
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900">
                      <FileSignature size={20} className="mx-auto text-blue-600 dark:text-blue-400 mb-1.5" />
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Approve Estimates</p>
                      <p className="text-[10px] text-slate-400">Accept scope & request changes</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900">
                      <Receipt size={20} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1.5" />
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Settle Invoices</p>
                      <p className="text-[10px] text-slate-400">1-click direct online checkout</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900">
                      <LifeBuoy size={20} className="mx-auto text-purple-600 dark:text-purple-400 mb-1.5" />
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Helpdesk Tickets</p>
                      <p className="text-[10px] text-slate-400">Direct support communication</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: REPORTS */}
              {activeTab === "reports" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Financial Intelligence & Real-Time Ledger</h4>
                      <p className="text-xs text-slate-500">Live platform totals queried directly from the backend database</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Live Platform Metrics
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Billed</p>
                      <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                        ₹ {Number(liveStats.total_volume || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Collected</p>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ₹ {Number(liveStats.total_paid_volume || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Invoices</p>
                      <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        {Number(liveStats.total_invoices || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Clients & Vendors</p>
                      <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {(Number(liveStats.total_clients || 0) + Number(liveStats.total_vendors || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 2: 100% DYNAMIC TRANSPARENT PRICING SUITE
      ============================================================ */}
      <section id="pricing" className="py-20 border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
              <span>100% Transparent Dynamic Pricing</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Simple, Predictable Plans for Every Stage
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Calculate your exact investment with real-time currency conversion, dynamic volume sliders, and custom add-on configurations.
            </p>

            {/* Currency Selector & Annual Toggle */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              
              {/* Currency Selector */}
              <div className="flex items-center gap-1 rounded-2xl bg-white p-1 border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                {[
                  { code: "INR", label: "₹ INR" },
                  { code: "USD", label: "$ USD" },
                  { code: "EUR", label: "€ EUR" },
                  { code: "GBP", label: "£ GBP" },
                  { code: "AED", label: "AED" },
                ].map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setPricingCurrency(curr.code)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      pricingCurrency === curr.code
                        ? "bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>

              {/* Monthly / Annual Toggle */}
              <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                <span className={`text-xs font-semibold ${pricingCycle === "monthly" ? "text-slate-900 dark:text-white font-bold" : "text-slate-400"}`}>
                  Monthly
                </span>
                <button
                  type="button"
                  onClick={() => setPricingCycle(pricingCycle === "monthly" ? "annual" : "monthly")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pricingCycle === "annual" ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      pricingCycle === "annual" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${pricingCycle === "annual" ? "text-slate-900 dark:text-white font-bold" : "text-slate-400"}`}>
                    Annual
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Save 20%
                  </span>
                </div>
              </div>
            </div>

            {/* Audience Filter Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: "all", label: "All Plans" },
                { id: "freelancers", label: "Solo & Freelancers" },
                { id: "agencies", label: "Agencies & Consultancies" },
                { id: "enterprises", label: "Enterprises & High-Volume" },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setPricingAudience(aud.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    pricingAudience === aud.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-200/70 text-slate-600 hover:bg-slate-300/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC CAPACITY SLIDERS & LIVE ESTIMATOR DECK */}
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Sliders Left */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>Dynamic Usage & Capacity Configurator</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Auto-matches best tier
                  </span>
                </div>

                {/* Invoices slider */}
                <div className="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Estimated Monthly Invoices
                    </span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                      {pricingInvoicesVolume >= 500 ? "500+ (Unlimited)" : `${pricingInvoicesVolume} Invoices`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={pricingInvoicesVolume}
                    onChange={(e) => setPricingInvoicesVolume(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>5 (Starter)</span>
                    <span>100 (Pro)</span>
                    <span>250 (Growth)</span>
                    <span>500+ (Enterprise)</span>
                  </div>
                </div>

                {/* Team seats slider */}
                <div className="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Admin & Staff Seats
                    </span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {pricingTeamSeats === 1 ? "1 User (Solo)" : `${pricingTeamSeats} Team Seats`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={pricingTeamSeats}
                    onChange={(e) => setPricingTeamSeats(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1 Solo Owner</span>
                    <span>5 Agency Team</span>
                    <span>10 Growing Firm</span>
                    <span>20+ Enterprise</span>
                  </div>
                </div>

                {/* Dynamic Add-Ons Checkboxes */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Optional Dynamic Add-Ons:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "whatsapp", name: "WhatsApp Reminders", priceInr: 249, priceUsd: 3.99 },
                      { id: "multi_gateway", name: "Multi-Gateway (Razorpay + Stripe)", priceInr: 199, priceUsd: 2.99 },
                      { id: "custom_domain", name: "Custom White-label Domain", priceInr: 399, priceUsd: 5.99 },
                      { id: "priority_sla", name: "Priority 24/7 SLA & Phone", priceInr: 499, priceUsd: 7.99 },
                    ].map((addon) => {
                      const isChecked = selectedAddons.includes(addon.id);
                      const addonCost = pricingCurrency === "INR"
                        ? `+₹${addon.priceInr}`
                        : pricingCurrency === "USD"
                        ? `+$${addon.priceUsd}`
                        : pricingCurrency === "EUR"
                        ? `+€${(addon.priceUsd * 0.92).toFixed(2)}`
                        : pricingCurrency === "GBP"
                        ? `+£${(addon.priceUsd * 0.78).toFixed(2)}`
                        : `+AED ${(addon.priceInr * 0.044).toFixed(0)}`;

                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setSelectedAddons(selectedAddons.filter((k) => k !== addon.id));
                            } else {
                              setSelectedAddons([...selectedAddons, addon.id]);
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition text-left cursor-pointer ${
                            isChecked
                              ? "border-blue-500 bg-blue-50/60 text-blue-900 dark:bg-blue-500/10 dark:border-blue-500/40 dark:text-blue-200"
                              : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 dark:border-slate-600"}`}>
                              {isChecked && <Check size={11} className="stroke-[3]" />}
                            </div>
                            <span className="truncate">{addon.name}</span>
                          </div>
                          <span className="font-bold text-[10px] text-blue-600 dark:text-blue-400 shrink-0 ml-1">
                            {addonCost}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Live Real-Time Cost Summary Card */}
              <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 text-white shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        Live Real-Time Estimate
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {pricingInvoicesVolume <= 15 && pricingTeamSeats <= 1 && selectedAddons.length === 0
                          ? "Starter Tier (Free)"
                          : pricingInvoicesVolume <= 200 && pricingTeamSeats <= 5
                          ? "Professional Plan + Custom Config"
                          : "Enterprise Dedicated Suite"}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      Live Calculated
                    </span>
                  </div>

                  <div className="py-4">
                    {(() => {
                      const isFreeTier = pricingInvoicesVolume <= 15 && pricingTeamSeats <= 1 && selectedAddons.length === 0;
                      const isEntTier = pricingInvoicesVolume > 200 || pricingTeamSeats > 5;
                      
                      let baseCostInr = isFreeTier ? 0 : isEntTier ? (pricingCycle === "annual" ? 1999 : 2499) : (pricingCycle === "annual" ? 799 : 999);
                      let addonInr = 0;
                      if (selectedAddons.includes("whatsapp")) addonInr += 249;
                      if (selectedAddons.includes("multi_gateway")) addonInr += 199;
                      if (selectedAddons.includes("custom_domain")) addonInr += 399;
                      if (selectedAddons.includes("priority_sla")) addonInr += 499;

                      const includedSeats = isFreeTier ? 1 : isEntTier ? 10 : 3;
                      const extraSeats = Math.max(0, pricingTeamSeats - includedSeats);
                      const extraSeatsCostInr = extraSeats * 149;

                      const totalInr = baseCostInr + addonInr + extraSeatsCostInr;

                      const symbol = pricingCurrency === "INR" ? "₹" : pricingCurrency === "USD" ? "$" : pricingCurrency === "EUR" ? "€" : pricingCurrency === "GBP" ? "£" : "AED ";
                      const rate = pricingCurrency === "INR" ? 1 : pricingCurrency === "USD" ? 0.012 : pricingCurrency === "EUR" ? 0.011 : pricingCurrency === "GBP" ? 0.0095 : 0.044;

                      const totalDisplay = isFreeTier
                        ? `${symbol}0`
                        : `${symbol}${Math.round(totalInr * rate).toLocaleString()}`;

                      const annualSavings = Math.round((baseCostInr * 0.25 * 12 + 1200) * rate);

                      return (
                        <div className="space-y-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tight text-white">
                              {totalDisplay}
                            </span>
                            <span className="text-xs text-slate-300">
                              / {pricingCycle === "annual" ? "month (billed annually)" : "month"}
                            </span>
                          </div>

                          {pricingCycle === "annual" && !isFreeTier && (
                            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 size={13} />
                              <span>You save ~{symbol}{annualSavings.toLocaleString()}/year on annual billing</span>
                            </p>
                          )}

                          <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/10">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Included Capacity:</span>
                              <span className="font-semibold text-white">{pricingInvoicesVolume} Invoices & {pricingTeamSeats} Staff Seats</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Selected Add-Ons:</span>
                              <span className="font-semibold text-white">{selectedAddons.length} active</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Setup & Migration:</span>
                              <span className="font-semibold text-emerald-400">₹0 (Free Assisted Onboarding)</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-bold text-white shadow-lg transition active:scale-[0.99] cursor-pointer"
                >
                  <span>Start with this Custom Setup</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic 3-Tier Cards Matrix */}
          {(() => {
            const currSymbol = pricingCurrency === "INR" ? "₹" : pricingCurrency === "USD" ? "$" : pricingCurrency === "EUR" ? "€" : pricingCurrency === "GBP" ? "£" : "AED ";
            const currRate = pricingCurrency === "INR" ? 1 : pricingCurrency === "USD" ? 0.012 : pricingCurrency === "EUR" ? 0.011 : pricingCurrency === "GBP" ? 0.0095 : 0.044;

            const formatPrice = (inrMonthly, inrAnnual) => {
              if (inrMonthly === 0) return `${currSymbol}0`;
              const val = pricingCycle === "annual" ? inrAnnual : inrMonthly;
              return `${currSymbol}${Math.round(val * currRate).toLocaleString()}`;
            };

            const isProRecommended = (pricingInvoicesVolume > 15 && pricingInvoicesVolume <= 200) || (pricingTeamSeats > 1 && pricingTeamSeats <= 5);
            const isEntRecommended = pricingInvoicesVolume > 200 || pricingTeamSeats > 5;
            const isStarterRecommended = pricingInvoicesVolume <= 15 && pricingTeamSeats <= 1;

            return (
              <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
                
                {/* Starter Plan */}
                {(pricingAudience === "all" || pricingAudience === "freelancers") && (
                  <div className={`rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900 flex flex-col justify-between transition-all duration-200 ${
                    isStarterRecommended
                      ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg dark:border-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Starter</h3>
                        {isStarterRecommended && (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                            Matches Selection
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">For solo freelancers and emerging creators</p>
                      
                      <div className="mt-5 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                          {formatPrice(0, 0)}
                        </span>
                        <span className="text-xs text-slate-400">/ forever free</span>
                      </div>

                      <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Up to 15 invoices & quotes / month</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Online payment checkout on all bills</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Standard PDF invoice exports</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> 1 Admin business workspace</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Client self-service portal</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleCtaClick}
                      className="mt-8 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Get Started Free
                    </button>
                  </div>
                )}

                {/* Professional Plan (Featured) */}
                {(pricingAudience === "all" || pricingAudience === "agencies") && (
                  <div className={`relative rounded-3xl border-2 bg-white p-8 shadow-xl flex flex-col justify-between transition-all duration-200 dark:bg-slate-900 ${
                    isProRecommended
                      ? "border-blue-600 shadow-blue-500/15 ring-4 ring-blue-500/10 dark:border-blue-500"
                      : "border-blue-500/80 dark:border-blue-500/80 shadow-md"
                  }`}>
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                      {isProRecommended ? "⭐ Best Match for Your Volume" : "Most Popular"}
                    </span>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Professional</h3>
                      <p className="mt-1 text-xs text-slate-500">For growing agencies, service firms & SMBs</p>
                      
                      <div className="mt-5 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                          {formatPrice(999, 799)}
                        </span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>

                      <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 font-bold" /> <strong>Unlimited</strong> invoices, quotes & clients</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 font-bold" /> Complete <strong>Vendors & Procurement Hub</strong></li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Dedicated Client Portal logins & receipts</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Razorpay online gateway integration</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Profit & Loss, GST & tax analytics</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Support Ticket helpdesk management</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Up to 5 Team & Staff accounts included</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleCtaClick}
                      className="mt-8 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
                    >
                      Start 14-Day Free Trial
                    </button>
                  </div>
                )}

                {/* Enterprise Plan */}
                {(pricingAudience === "all" || pricingAudience === "enterprises") && (
                  <div className={`rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900 flex flex-col justify-between transition-all duration-200 ${
                    isEntRecommended
                      ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-lg dark:border-indigo-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Enterprise</h3>
                        {isEntRecommended && (
                          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                            Recommended for Scale
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">For multi-entity firms & high-volume operators</p>
                      
                      <div className="mt-5 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                          {formatPrice(2499, 1999)}
                        </span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>

                      <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600 font-bold" /> Everything in Professional tier</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Multi-Currency & Multi-GST tax matrices</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Custom white-label domain & PDF layouts</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Priority 24/7 Phone SLA & Account Lead</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> 20+ Staff seats & custom permission roles</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Automated accounting webhook integrations</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleCtaClick}
                      className="mt-8 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Contact Sales & Enterprise Demo
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Guarantee Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              <span>Instant Cloud Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-indigo-500" />
              <span>256-Bit SSL Bank-Grade Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>No Credit Card Required to Start</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: FAQ WITH DYNAMIC INSTANT SEARCH FILTER
      ============================================================ */}
      <section id="faq" className="py-20 border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search by keyword or click questions below for detailed explanations.
            </p>
          </div>

          {/* Interactive Live FAQ Search Bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search topics (e.g. GST, UPI, Vendors, Quotes, Portal)..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            {faqSearch && (
              <button
                type="button"
                onClick={() => setFaqSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filtered FAQ Items */}
          <div className="mt-8 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No matching answers found for "{faqSearch}". Try searching for "GST", "UPI", or "Vendors".
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = faqOpenIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          {faq.tag}
                        </span>
                        <span>{faq.q}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-600" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-200/60 px-4 pt-3 pb-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800/80 dark:text-slate-300">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 6: BOTTOM CONVERSION CTA BANNER
      ============================================================ */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 blur-2xl pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-white border border-white/20 backdrop-blur-md">
            <Zap size={14} className="text-amber-400" />
            <span>Setup In Under 60 Seconds</span>
          </div>

          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            Ready to Automate Your Business Invoicing?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses managing invoices, quotations, online payments, and supplier liabilities seamlessly with InvoiceFlow.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 px-8 py-3.5 text-base font-bold text-white shadow-xl transition active:scale-[0.98] cursor-pointer"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Get Started For Free"}</span>
              <ArrowRight size={18} />
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-base font-bold text-white transition backdrop-blur-md"
            >
              <Lock size={16} />
              <span>Sign In to Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-[10px]">
                IF
              </div>
              <span className="font-bold text-slate-800 dark:text-white">InvoiceFlow OS</span>
              <span>• GST Compliant • UPI Ready</span>
            </div>
            <p>© {new Date().getFullYear()} InvoiceFlow Technologies Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
