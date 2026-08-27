import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Eye,
  FileCheck,
  FilePlus,
  FileText,
  Filter,
  Flame,
  Globe,
  Grid,
  HeartHandshake,
  HelpCircle,
  IndianRupee,
  Layers,
  Layout,
  ListFilter,
  Maximize2,
  Minimize2,
  MoveDown,
  MoveUp,
  Plus,
  Receipt,
  RefreshCw,
  RotateCcw,
  Send,
  Settings2,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import useSettings from "../../hooks/useSettings";

const DEFAULT_PANELS = [
  {
    id: "urgent_queue",
    title: "Action Queue & Urgent Follow-ups",
    stream: "urgent",
    description: "Time-critical items requiring immediate action",
    icon: Flame,
    color: "from-amber-500 to-rose-500",
    badge: "Urgent",
    enabled: true,
  },
  {
    id: "live_metrics",
    title: "Financial Health & Collection Velocity",
    stream: "invoicing",
    description: "Real-time metrics, collection velocity & ratios",
    icon: Activity,
    color: "from-blue-600 to-indigo-600",
    badge: "Live KPI",
    enabled: true,
  },
  {
    id: "invoicing_hub",
    title: "Invoicing & Billing Pipeline",
    stream: "invoicing",
    description: "Recent invoices, payment statuses, and quick generator",
    icon: Receipt,
    color: "from-indigo-600 to-purple-600",
    badge: "Billing",
    enabled: true,
  },
  {
    id: "client_crm",
    title: "Client Health & Accounts Receivable",
    stream: "clients",
    description: "Client directory health, top accounts, and dues",
    icon: Users,
    color: "from-sky-500 to-blue-600",
    badge: "CRM",
    enabled: true,
  },
  {
    id: "vendor_procurement",
    title: "Vendor Liabilities & Accounts Payable",
    stream: "vendors",
    description: "Suppliers, purchase liabilities, and pending payouts",
    icon: Building2,
    color: "from-purple-600 to-pink-600",
    badge: "Procurement",
    enabled: true,
  },
  {
    id: "quick_launcher",
    title: "Operational Quick Launcher",
    stream: "all",
    description: "One-click shortcuts to key enterprise creation flows",
    icon: Zap,
    color: "from-slate-800 to-slate-950",
    badge: "Tools",
    enabled: true,
  },
];

const PRESETS = [
  {
    id: "default",
    name: "Full Enterprise View",
    description: "All modular work panels enabled",
    panelIds: ["urgent_queue", "live_metrics", "invoicing_hub", "client_crm", "vendor_procurement", "quick_launcher"],
  },
  {
    id: "finance",
    name: "Finance & Billing Focus",
    description: "Focus on collections, revenue velocity, and invoices",
    panelIds: ["urgent_queue", "live_metrics", "invoicing_hub", "quick_launcher"],
  },
  {
    id: "crm",
    name: "Client Relations & Sales",
    description: "Focus on client accounts, pipeline, and rapid billing",
    panelIds: ["urgent_queue", "client_crm", "invoicing_hub", "quick_launcher"],
  },
  {
    id: "procurement",
    name: "Vendor & Payables",
    description: "Focus on supplier management and payout liabilities",
    panelIds: ["urgent_queue", "vendor_procurement", "quick_launcher"],
  },
  {
    id: "minimal",
    name: "Executive Minimal",
    description: "Condensed high-level action queue and live KPIs",
    panelIds: ["urgent_queue", "live_metrics", "quick_launcher"],
  },
];

const WORK_STREAMS = [
  { id: "all", label: "All Operations", icon: Layers },
  { id: "urgent", label: "Priority & Urgent", icon: Flame, count: 3 },
  { id: "invoicing", label: "Billing & Invoicing", icon: Receipt },
  { id: "clients", label: "Clients & CRM", icon: Users },
  { id: "vendors", label: "Vendors & Payables", icon: Building2 },
];

export default function WorkDashboardPanels({ data = {}, onRefresh }) {
  const { formatCurrency } = useSettings();

  // Selected work stream filter
  const [activeStream, setActiveStream] = useState("all");

  // Panel configurations (persisted in localStorage)
  const [panels, setPanels] = useState(() => {
    try {
      const saved = localStorage.getItem("invoiceflow_work_panels");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case of new panels
        return DEFAULT_PANELS.map((p) => {
          const found = parsed.find((item) => item.id === p.id);
          return found ? { ...p, enabled: found.enabled } : p;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PANELS;
  });

  // Density mode: "standard" | "compact"
  const [density, setDensity] = useState(() => {
    return localStorage.getItem("invoiceflow_panel_density") || "standard";
  });

  // Customizer Drawer state
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Persist panels to localStorage
  useEffect(() => {
    localStorage.setItem("invoiceflow_work_panels", JSON.stringify(panels));
  }, [panels]);

  // Persist density to localStorage
  useEffect(() => {
    localStorage.setItem("invoiceflow_panel_density", density);
  }, [density]);

  // Toggle individual panel
  const togglePanel = (panelId) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === panelId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  // Move panel up / down
  const movePanel = (index, direction) => {
    const newPanels = [...panels];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPanels.length) return;
    const [moved] = newPanels.splice(index, 1);
    newPanels.splice(targetIndex, 0, moved);
    setPanels(newPanels);
  };

  // Apply a preset
  const applyPreset = (presetId) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setPanels((prev) =>
      prev.map((p) => ({
        ...p,
        enabled: preset.panelIds.includes(p.id),
      }))
    );
    toast.success(`Applied preset: ${preset.name}`);
  };

  // Reset to default
  const resetPanels = () => {
    setPanels(DEFAULT_PANELS);
    setDensity("standard");
    toast.success("Dashboard reset to default layout");
  };

  // Filter panels based on activeStream & enabled status
  const visiblePanels = useMemo(() => {
    return panels.filter((p) => {
      if (!p.enabled) return false;
      if (activeStream === "all") return true;
      if (activeStream === "urgent") return p.id === "urgent_queue" || p.id === "live_metrics";
      return p.stream === activeStream || p.stream === "all";
    });
  }, [panels, activeStream]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  // Key KPI metrics calculations
  const collectionRatio = useMemo(() => {
    if (!data.revenue || data.revenue <= 0) return 88.5;
    return Number((((data.revenue - (data.outstanding || 0)) / data.revenue) * 100).toFixed(1));
  }, [data.revenue, data.outstanding]);

  const activeInvoicesCount = data.invoices || 14;
  const overdueCount = data.overdueInvoices || 3;
  const totalRevenue = data.revenue || 485000;
  const outstandingAmount = data.outstanding || 64200;

  return (
    <div className="space-y-6">
      {/* ============================================================
          WORK STREAM SELECTOR & DASHBOARD CUSTOMIZATION BAR
      ============================================================ */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 lg:flex-row lg:items-center lg:justify-between">
        {/* Stream Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <div className="mr-1 hidden items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 sm:flex">
            <SlidersHorizontal size={14} />
            <span>Work Stream:</span>
          </div>

          {WORK_STREAMS.map((stream) => {
            const Icon = stream.icon;
            const isSelected = activeStream === stream.id;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => setActiveStream(stream.id)}
                className={`group flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/20 dark:bg-blue-600 dark:shadow-blue-600/20"
                    : "border border-slate-200/80 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  size={14}
                  className={isSelected ? "text-blue-400 dark:text-white" : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"}
                />
                <span>{stream.label}</span>
                {stream.count && (
                  <span
                    className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-black ${
                      isSelected
                        ? "bg-rose-500 text-white"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400"
                    }`}
                  >
                    {stream.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls & Customizer Button */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          {/* Density Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setDensity("standard")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                density === "standard"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Standard density"
            >
              <Maximize2 size={13} />
            </button>
            <button
              type="button"
              onClick={() => setDensity("compact")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                density === "compact"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Compact density"
            >
              <Minimize2 size={13} />
            </button>
          </div>

          {/* Customize Panels Trigger */}
          <button
            type="button"
            onClick={() => setShowCustomizer(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Settings2 size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Customize Panels</span>
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-black text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {panels.filter((p) => p.enabled).length}/{panels.length}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================
          DYNAMIC WORK PANELS GRID
      ============================================================ */}
      <div
        className={`grid gap-5 ${
          density === "compact" ? "gap-3" : "gap-6"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {visiblePanels.map((panel) => {
            return (
              <motion.div
                key={panel.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {panel.id === "urgent_queue" && (
                  <UrgentActionQueuePanel
                    density={density}
                    formatCurrency={formatCurrency}
                    copyToClipboard={copyToClipboard}
                  />
                )}

                {panel.id === "live_metrics" && (
                  <LiveMetricsPanel
                    data={data}
                    density={density}
                    formatCurrency={formatCurrency}
                    collectionRatio={collectionRatio}
                    totalRevenue={totalRevenue}
                    outstandingAmount={outstandingAmount}
                    activeInvoicesCount={activeInvoicesCount}
                    overdueCount={overdueCount}
                  />
                )}

                {panel.id === "invoicing_hub" && (
                  <InvoicingHubPanel
                    data={data}
                    density={density}
                    formatCurrency={formatCurrency}
                  />
                )}

                {panel.id === "client_crm" && (
                  <ClientCrmPanel
                    data={data}
                    density={density}
                    formatCurrency={formatCurrency}
                  />
                )}

                {panel.id === "vendor_procurement" && (
                  <VendorProcurementPanel
                    density={density}
                    formatCurrency={formatCurrency}
                  />
                )}

                {panel.id === "quick_launcher" && (
                  <QuickLauncherPanel density={density} />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visiblePanels.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <Layers size={36} className="text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              No panels visible for "{activeStream}" stream
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              All panels for this stream might be disabled in your custom layout.
            </p>
            <button
              type="button"
              onClick={() => applyPreset("default")}
              className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              <RotateCcw size={13} />
              <span>Restore Default Panels</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          PANEL CUSTOMIZATION MODAL / DRAWER
      ============================================================ */}
      <AnimatePresence>
        {showCustomizer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Customize Work Dashboard Panels
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enable, disable, and rearrange your workflow widget deck
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCustomizer(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {/* Presets */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quick Role Presets
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset.id)}
                        className="flex flex-col items-start rounded-2xl border border-slate-200/80 p-3 text-left transition hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {preset.name}
                        </span>
                        <span className="mt-0.5 text-[10px] text-slate-500 line-clamp-2">
                          {preset.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Panel Reordering & Toggles */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Modular Panels Deck ({panels.filter((p) => p.enabled).length} Enabled)
                    </label>
                    <button
                      type="button"
                      onClick={resetPanels}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Layout</span>
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {panels.map((panel, idx) => {
                      const Icon = panel.icon;
                      return (
                        <div
                          key={panel.id}
                          className={`flex items-center justify-between rounded-2xl border p-3 transition ${
                            panel.enabled
                              ? "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40"
                              : "border-slate-200/50 bg-slate-100/40 opacity-60 dark:border-slate-800/50 dark:bg-slate-950/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                              <Icon size={16} className="text-slate-700 dark:text-slate-300" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  {panel.title}
                                </p>
                                <span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                  {panel.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {panel.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Reorder Buttons */}
                            <div className="flex flex-col">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => movePanel(idx, -1)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                                title="Move Up"
                              >
                                <MoveUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === panels.length - 1}
                                onClick={() => movePanel(idx, 1)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                                title="Move Down"
                              >
                                <MoveDown size={12} />
                              </button>
                            </div>

                            {/* Toggle Switch */}
                            <button
                              type="button"
                              onClick={() => togglePanel(panel.id)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                panel.enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  panel.enabled ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end border-t border-slate-100 p-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomizer(false)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   PANEL 1: URGENT ACTION QUEUE & FOLLOW-UPS
   ========================================================================== */
function UrgentActionQueuePanel({ density, formatCurrency, copyToClipboard }) {
  const [filterType, setFilterType] = useState("all");

  const queueItems = [
    {
      id: "urg-1",
      type: "overdue_invoice",
      title: "Overdue Invoice: #INV-2026-004",
      entity: "Nexus Logistics Ltd",
      amount: 45200,
      daysOverdue: 14,
      priority: "high",
      actionLabel: "Send WhatsApp Reminder",
      onAction: () => toast.success("WhatsApp payment reminder link dispatched to Nexus Logistics!"),
    },
    {
      id: "urg-2",
      type: "expiring_quote",
      title: "Quotation Awaiting Client Approval: #QUO-089",
      entity: "Acme Enterprises",
      amount: 185000,
      daysOverdue: 2,
      priority: "medium",
      actionLabel: "Follow Up",
      onAction: () => toast.success("Follow-up email notification sent to Acme Enterprises!"),
    },
    {
      id: "urg-3",
      type: "vendor_payable",
      title: "Vendor Invoice Due in 2 Days: #V-BILL-902",
      entity: "CloudScale Infrastructure",
      amount: 28400,
      daysOverdue: -2,
      priority: "urgent",
      actionLabel: "Pay via UPI",
      onAction: () => toast.success("Opening UPI checkout session for CloudScale!"),
    },
  ];

  const filtered = queueItems.filter((item) => {
    if (filterType === "all") return true;
    return item.type.includes(filterType);
  });

  return (
    <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/60 via-white to-amber-50/30 p-5 shadow-sm dark:border-rose-950/60 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-rose-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md shadow-rose-500/20">
            <Flame size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Urgent Action Queue
              </h3>
              <span className="flex h-5 items-center rounded-full bg-rose-500 px-2 text-[10px] font-black text-white">
                {queueItems.length} Needs Attention
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-priority invoices, pending approvals, and urgent payout deadlines
            </p>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-rose-200/70 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-950/80">
          {[
            { id: "all", label: "All" },
            { id: "invoice", label: "Invoices" },
            { id: "quote", label: "Quotes" },
            { id: "vendor", label: "Vendors" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                filterType === f.id
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items List */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:border-rose-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                  {item.daysOverdue > 0 ? `${item.daysOverdue}d Overdue` : "Due Soon"}
                </span>
                <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-1 dark:text-slate-100">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Entity: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.entity}</span>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={item.onAction}
                className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60 transition"
              >
                <Zap size={13} />
                <span>{item.actionLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(`Invoice due: ${formatCurrency(item.amount)} for ${item.entity}`, "Reminder details")}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="Copy details"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   PANEL 2: LIVE METRICS & FINANCIAL HEALTH
   ========================================================================== */
function LiveMetricsPanel({
  density,
  formatCurrency,
  collectionRatio,
  totalRevenue,
  outstandingAmount,
  activeInvoicesCount,
  overdueCount,
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Financial Health & Collection Ratios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live operational throughput and realization speed
            </p>
          </div>
        </div>

        <Link
          to="/admin/reports"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>Detailed Reports</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Billed</span>
            <IndianRupee size={15} className="text-blue-500" />
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={13} />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Dues</span>
            <Clock size={15} className="text-amber-500" />
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(outstandingAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-600">
            <span>{overdueCount} invoices past due</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Collection Ratio</span>
            <CheckCircle2 size={15} className="text-emerald-500" />
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            {collectionRatio}%
          </div>
          {/* Mini progress bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
              style={{ width: `${Math.min(collectionRatio, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Settlement</span>
            <Zap size={15} className="text-purple-500" />
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            2.4 Days
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            <Sparkles size={12} />
            <span>Instant UPI reconciliation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   PANEL 3: INVOICING & BILLING HUB
   ========================================================================== */
function InvoicingHubPanel({ data, density, formatCurrency }) {
  const [activeTab, setActiveTab] = useState("all");

  const sampleInvoices = data.recentInvoices?.length > 0 ? data.recentInvoices : [
    { id: "101", invoice_number: "INV-2026-001", client: "Acme Technologies", total: 48500, status: "paid", date: "Today" },
    { id: "102", invoice_number: "INV-2026-002", client: "Zenith Digital Agency", total: 112000, status: "partially_paid", date: "Yesterday" },
    { id: "103", invoice_number: "INV-2026-003", client: "Nexus Logistics Ltd", total: 85300, status: "sent", date: "2 days ago" },
    { id: "104", invoice_number: "INV-2026-004", client: "Starlight Media Corp", total: 32000, status: "overdue", date: "5 days ago" },
  ];

  const filteredInvoices = sampleInvoices.filter((inv) => {
    if (activeTab === "all") return true;
    return String(inv.status).toLowerCase().includes(activeTab);
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
            <Receipt size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Invoicing & Billing Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage GST invoices, monitor statuses, and convert quotes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
            {["all", "paid", "sent", "overdue"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveTab(status)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition ${
                  activeTab === status
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <Link
            to="/admin/invoices/add"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={14} />
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      {/* Invoice Rows */}
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between py-3 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {inv.invoice_number || `INV-${inv.id}`}
                </p>
                <p className="text-[11px] text-slate-400">
                  {inv.client} {inv.date ? `• ${inv.date}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(inv.total || 0)}
                </p>
                <InvoiceStatusBadge status={inv.status} />
              </div>

              <Link
                to={`/admin/invoices/${inv.id}`}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="View Invoice"
              >
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   PANEL 5: CLIENT CRM & ACCOUNTS RECEIVABLE
   ========================================================================== */
function ClientCrmPanel({ data, density, formatCurrency }) {
  const clients = data.recentClients?.length > 0 ? data.recentClients : [
    { id: 1, name: "Acme Technologies", email: "contact@acme.com", totalBilled: 145000, status: "Active" },
    { id: 2, name: "Zenith Digital Agency", email: "billing@zenith.io", totalBilled: 98000, status: "Active" },
    { id: 3, name: "Nexus Logistics Ltd", email: "finance@nexus.com", totalBilled: 85300, status: "Pending Due" },
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Client Health & Accounts Receivable
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customer relationships, lifetime billings, and account follow-ups
            </p>
          </div>
        </div>

        <Link
          to="/admin/clients"
          className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline dark:text-sky-400"
        >
          <span>All Clients</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">
                {client.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                  {client.name}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {client.email}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Billed</span>
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  {formatCurrency(client.totalBilled || 45000)}
                </p>
              </div>

              <Link
                to={`/admin/clients/${client.id}`}
                className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   PANEL 6: VENDOR PROCUREMENT & ACCOUNTS PAYABLE
   ========================================================================== */
function VendorProcurementPanel({ density, formatCurrency }) {
  const vendors = [
    { id: 1, name: "Apex Raw Materials Ltd", category: "Raw Materials", dueAmount: 32000, terms: "Net 30" },
    { id: 2, name: "CloudScale Hosting Solutions", category: "IT & Cloud", dueAmount: 18400, terms: "Due on Receipt" },
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Vendor Liabilities & Accounts Payable
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track supplier payables, GST compliance, and outward expenses
            </p>
          </div>
        </div>

        <Link
          to="/admin/vendors"
          className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
        >
          <span>Vendor Directory</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {vendor.name}
                </p>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
                  {vendor.category}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Payment Terms: <span className="font-semibold text-slate-600 dark:text-slate-300">{vendor.terms}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-black text-slate-900 dark:text-white">
                {formatCurrency(vendor.dueAmount)}
              </p>
              <button
                type="button"
                onClick={() => toast.success(`Initiated payout flow for ${vendor.name}`)}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:underline dark:text-purple-400"
              >
                <span>Pay Out</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   PANEL 7: QUICK OPERATIONAL LAUNCHER
   ========================================================================== */
function QuickLauncherPanel({ density }) {
  const actions = [
    { to: "/admin/invoices/add", title: "Create Invoice", desc: "GST compliant invoice with auto-tax", icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/80 dark:text-blue-400" },
    { to: "/admin/quotes/add", title: "New Quotation", desc: "Draft proposal with 1-click conversion", icon: Receipt, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 dark:text-indigo-400" },
    { to: "/admin/clients/add", title: "Add Client", desc: "Onboard new customer with tax details", icon: UserPlus, color: "text-sky-600 bg-sky-50 dark:bg-sky-950/80 dark:text-sky-400" },
    { to: "/admin/vendors/add", title: "Add Vendor", desc: "Add supplier with bank and GSTIN", icon: Truck, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/80 dark:text-purple-400" },
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm dark:bg-blue-600">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Enterprise Quick Launcher
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One-click shortcuts to key operational creation flows
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Link
              key={i}
              to={act.to}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${act.color}`}>
                  <Icon size={18} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900 dark:group-hover:text-white"
                />
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {act.title}
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function InvoiceStatusBadge({ status }) {
  const norm = String(status || "").toLowerCase();
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800",
    partially_paid: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800",
    sent: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800",
    overdue: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800",
    draft: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold capitalize ${
        styles[norm] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {norm.replaceAll("_", " ")}
    </span>
  );
}
