import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowRight,
  CreditCard,
  FileText,
  IndianRupee,
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import ReportCard from "../../components/reports/ReportCard";
import RatioCard from "../../components/reports/RatioCard";
import RevenueChart from "../../components/reports/RevenueChart";
import PaymentChart from "../../components/reports/PaymentChart";

import RecentInvoices from "../../components/dashboard/RecentInvoices";
import RecentPayments from "../../components/dashboard/RecentPayments";
import RecentClients from "../../components/dashboard/RecentClients";
import WorkDashboardPanels from "../../components/dashboard/WorkDashboardPanels";

import dashboardService from "../../services/dashboardService";
import useSettings from "../../hooks/useSettings";


const EMPTY_DATA = {
  revenue: 0,
  outstanding: 0,
  invoices: 0,
  clients: 0,
  paidInvoices: 0,
  overdueInvoices: 0,

  revenueChart: [],
  paymentChart: [],

  recentInvoices: [],
  recentPayments: [],
  recentClients: [],
};


export default function Dashboard() {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [dashboardView, setDashboardView] = useState(() => {
    return localStorage.getItem("invoiceflow_dashboard_view") || "work_panels";
  });

  const handleViewChange = (view) => {
    setDashboardView(view);
    localStorage.setItem("invoiceflow_dashboard_view", view);
  };

  useEffect(() => {
    loadDashboard();
  }, []);



  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response =
        await dashboardService.get();

      /*
       * Supports either:
       *
       * {
       *   revenue: ...
       * }
       *
       * or
       *
       * {
       *   data: {
       *     revenue: ...
       *   }
       * }
       */

      const dashboard =
        response?.data ||
        response ||
        {};

      setData({
        ...EMPTY_DATA,
        ...dashboard,

        revenue:
          Number(dashboard.total_revenue ?? dashboard.revenue) || 0,

        outstanding:
          Number(dashboard.pending_amount ?? dashboard.outstanding) || 0,

        invoices:
          Number(dashboard.invoices) || 0,

        clients:
          Number(dashboard.clients) || 0,

        paidInvoices:
          Number(
            dashboard.paidInvoices ??
            dashboard.paid_invoices
          ) || 0,

        overdueInvoices:
          Number(
            dashboard.overdueInvoices ??
            dashboard.overdue_invoices
          ) || 0,

        revenueChart:
          dashboard.revenueChart ??
          dashboard.revenue_chart ??
          [],

        paymentChart:
          dashboard.paymentChart ??
          dashboard.payment_chart ??
          [],

        recentInvoices:
          dashboard.recentInvoices ??
          dashboard.recent_invoices ??
          [],

        recentPayments:
          dashboard.recentPayments ??
          dashboard.recent_payments ??
          [],

        recentClients:
          dashboard.recentClients ??
          dashboard.recent_clients ??
          [],
      });

    } catch (error) {
      console.error(
        "Dashboard API error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
        "Unable to load dashboard"
      );

      setData(EMPTY_DATA);

    } finally {
      setLoading(false);
    }
  };


  const collectionRatio = useMemo(() => {
    if (data.revenue <= 0) {
      return 0;
    }

    return Number(
      (
        ((data.revenue -
          data.outstanding) /
          data.revenue) *
        100
      ).toFixed(1)
    );
  }, [
    data.revenue,
    data.outstanding,
  ]);


  const overdueRatio = useMemo(() => {
    if (data.invoices <= 0) {
      return 0;
    }

    return Number(
      (
        (data.overdueInvoices /
          data.invoices) *
        100
      ).toFixed(1)
    );
  }, [
    data.invoices,
    data.overdueInvoices,
  ]);


  const averageInvoice = useMemo(() => {
    if (data.invoices <= 0) {
      return 0;
    }

    return data.revenue /
      data.invoices;
  }, [
    data.revenue,
    data.invoices,
  ]);


  // formatCurrency comes from useSettings — uses dynamic symbol and decimals from saved settings
  const { formatCurrency } = useSettings();

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="h-20 animate-pulse rounded-3xl bg-slate-100" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-3xl bg-slate-100"
              />
            )
          )}

        </div>

        <div className="grid gap-4 md:grid-cols-3">

          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-3xl bg-slate-100"
              />
            )
          )}

        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">

          <div className="h-[350px] animate-pulse rounded-3xl bg-slate-100" />

          <div className="h-[350px] animate-pulse rounded-3xl bg-slate-100" />

        </div>

      </div>
    );
  }


  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-6"
    >
      {/* =====================================================
          HEADER WITH WORKSPACE VIEW SWITCHER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* View mode switcher */}
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => handleViewChange("work_panels")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              dashboardView === "work_panels"
                ? "bg-slate-950 text-white shadow-md shadow-slate-950/20 dark:bg-blue-600 dark:shadow-blue-600/20"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Layers size={14} className={dashboardView === "work_panels" ? "text-blue-400 dark:text-white" : "text-slate-400"} />
            <span>Dynamic Work Panels</span>
            <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-black text-blue-600 dark:text-blue-200">
              Interactive
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange("classic_charts")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              dashboardView === "classic_charts"
                ? "bg-slate-950 text-white shadow-md shadow-slate-950/20 dark:bg-blue-600 dark:shadow-blue-600/20"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard size={14} className={dashboardView === "classic_charts" ? "text-blue-400 dark:text-white" : "text-slate-400"} />
            <span>Classic Overview</span>
          </button>
        </div>

        <div className="flex gap-2">

          <Link
            to="/admin/invoices/add"
            className="flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm"
          >
            <FileText size={15} />

            Create invoice
          </Link>


          <Link
            to="/admin/clients/add"
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex"
          >
            <Users size={15} />

            Add client
          </Link>

        </div>

      </div>

      {dashboardView === "work_panels" ? (
        <WorkDashboardPanels data={data} onRefresh={loadDashboard} />
      ) : (
        <>
          {/* =====================================================
              MAIN STATS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <ReportCard
          title="Total revenue"
          value={formatCurrency(
            data.revenue
          )}
          subtitle="Current financial period"
          icon={IndianRupee}
        />


        <ReportCard
          title="Outstanding"
          value={formatCurrency(
            data.outstanding
          )}
          subtitle="Amount yet to be collected"
          icon={CreditCard}
        />


        <ReportCard
          title="Invoices"
          value={data.invoices}
          subtitle={`${data.paidInvoices} paid invoices`}
          icon={FileText}
        />


        <ReportCard
          title="Clients"
          value={data.clients}
          subtitle="Active customers"
          icon={Users}
        />

      </div>


      {/* =====================================================
          RATIOS
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-3">

        <RatioCard
          title="Collection ratio"
          value={`${collectionRatio}%`}
          ratio={collectionRatio}
          description="Percentage of revenue successfully collected."
          icon={CreditCard}
        />


        <RatioCard
          title="Overdue ratio"
          value={`${overdueRatio}%`}
          ratio={overdueRatio}
          description="Percentage of invoices currently overdue."
          icon={Activity}
          inverse
        />


        <RatioCard
          title="Average invoice"
          value={formatCurrency(
            averageInvoice
          )}
          ratio={
            data.invoices > 0
              ? Math.min(
                100,
                (averageInvoice /
                  Math.max(
                    data.revenue,
                    1
                  )) *
                100
              )
              : 0
          }
          description="Average invoice value across current records."
          icon={IndianRupee}
        />

      </div>


      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">

        <RevenueChart
          data={
            data.revenueChart
          }
        />

        <PaymentChart
          data={
            data.paymentChart
          }
        />

      </div>


      {/* =====================================================
          RECENT DATA
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-2">

        <RecentInvoices
          invoices={
            data.recentInvoices
          }
        />

        <RecentPayments
          payments={
            data.recentPayments
          }
        />

      </div>


      <RecentClients
        data={
          data.recentClients
        }
      />


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Create records with quick popup modals.
            </p>

          </div>

          <ArrowRight
            size={16}
            className="text-slate-300"
          />

        </div>


        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <QuickLink
            to="/admin/clients/add"
            title="Add Client"
            description="Add a new customer to directory."
          />

          <QuickLink
            to="/admin/invoices/add"
            title="Create Invoice"
            description="Generate a billing invoice."
          />

          <QuickLink
            to="/admin/quotes/add"
            title="New Quotation"
            description="Draft a proposal for a client."
          />

          <QuickLink
            to="/admin/reports"
            title="View Reports"
            description="Analyze revenue and payments."
          />

        </div>

      </div>
      </>
      )}

    </motion.div>
  );
}


/* =========================================================
   QUICK LINK
========================================================= */

function QuickLink({
  to,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
    >

      <div className="flex items-center justify-between">

        <h3 className="text-xs font-bold text-slate-800">
          {title}
        </h3>

        <ArrowRight
          size={14}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
        />

      </div>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {description}
      </p>

    </Link>
  );
}