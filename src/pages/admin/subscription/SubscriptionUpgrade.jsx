import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  FolderKanban,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";

export default function SubscriptionUpgrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subRes, plansRes] = await Promise.all([
        api.get("/subscriptions/current/"),
        api.get("/subscriptions/plans/"),
      ]);

      if (subRes.data?.success && subRes.data?.data) {
        setSubscription(subRes.data.data);
      }
      if (plansRes.data?.success && plansRes.data?.data) {
        setPlans(plansRes.data.data.filter((p) => p.plan_name !== "FREE_TRIAL"));
      }
    } catch (err) {
      console.error("Error loading subscription data:", err);
      toast.error("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;
    try {
      setProcessing(true);

      // 1. Initialize Upgrade
      await api.post("/subscriptions/upgrade/", {
        plan_name: selectedPlan.plan_name,
      });

      // 2. Verify Payment & Activate Plan
      const verifyRes = await api.post("/subscriptions/payment/verify/", {
        plan_name: selectedPlan.plan_name,
        payment_method: "credit_card",
        transaction_ref: `TXN_SaaS_${Date.now()}`,
      });

      if (verifyRes.data?.success) {
        toast.success(`Plan upgraded to ${selectedPlan.display_name}!`);
        setShowCheckoutModal(false);
        fetchSubscriptionData();
      } else {
        toast.error("Payment verification failed");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Upgrade failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <CreditCard className="text-purple-600 dark:text-purple-400" size={26} />
              Subscription & SaaS Plans
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your business subscription tier, project quotas, and team member seats.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* CURRENT USAGE CARD */}
      {subscription && (
        <div
          className={`rounded-3xl border p-6 backdrop-blur-xl shadow-sm ${
            subscription.is_trial
              ? subscription.upgrade_required
                ? "border-rose-300 dark:border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 shadow-rose-950/5"
                : "border-purple-300 dark:border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 shadow-purple-950/5"
              : "border-emerald-300 dark:border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 shadow-emerald-950/5"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    subscription.is_trial
                      ? subscription.upgrade_required
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {subscription.is_trial
                    ? subscription.upgrade_required
                      ? "Free Trial Completed"
                      : "Free Trial (Active)"
                    : `${subscription.plan_name} (Active)`}
                </span>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Business: <strong className="text-slate-900 dark:text-white">{subscription.business_name}</strong>
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {subscription.is_trial
                  ? subscription.upgrade_required
                    ? "Free Trial 5-Project Quota Exhausted"
                    : `Free Trial: ${subscription.projects_count} / 5 Projects Created`
                  : `${subscription.plan_name} Plan Tier`}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                {subscription.is_trial
                  ? subscription.upgrade_required
                    ? "You have consumed all 5 free projects included in your trial. Select a paid plan below to instantly unlock new project creations and team member invitations."
                    : `You have ${subscription.trial_remaining} free project${subscription.trial_remaining === 1 ? "" : "s"} remaining before an upgrade is required.`
                  : `Your plan renews automatically. You have utilized ${subscription.projects_count} of ${subscription.max_projects} available project workspaces.`}
              </p>
            </div>

            {/* Quota Progress Meters */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 min-w-[140px] text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Projects Quota</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {subscription.projects_count} / {subscription.is_trial ? 5 : subscription.max_projects}
                </p>
                <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      subscription.upgrade_required ? "bg-rose-500" : "bg-[#6342ff]"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (subscription.projects_count / (subscription.is_trial ? 5 : subscription.max_projects)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 min-w-[140px] text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Team Seats</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {subscription.users_count} / {subscription.max_users}
                </p>
                <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (subscription.users_count / subscription.max_users) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLANS & PRICING GRID */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
            <Sparkles size={14} /> Flexible Multi-Tenant Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Choose the Perfect Plan for Your Business
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Instant activation with automated invoice generation and 100% money-back guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = subscription?.plan_name === plan.plan_name && subscription?.status === "ACTIVE";
            const isPopular = plan.plan_name === "PROFESSIONAL";

            return (
              <div
                key={plan.plan_name}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all hover:scale-[1.02] ${
                  isPopular
                    ? "border-purple-500 bg-gradient-to-b from-purple-500/5 via-white to-white dark:from-purple-500/10 dark:via-slate-900 dark:to-slate-900 shadow-xl shadow-purple-950/10"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-purple-600/30">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.display_name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {plan.max_projects} Projects
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">${plan.monthly_price}</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ month</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Includes up to {plan.max_users} team members and vendors.
                  </p>

                  <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

                  <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-default"
                    >
                      ✓ Current Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition active:scale-95 cursor-pointer ${
                        isPopular
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30"
                          : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                      }`}
                    >
                      Upgrade to {plan.display_name} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHECKOUT / PAYMENT MODAL */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Review & Activate Subscription</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Secure Payment Checkout</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Plan Tier</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedPlan.display_name} Plan</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-500 dark:text-slate-400">Project Workspaces</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">Up to {selectedPlan.max_projects} Projects</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-500 dark:text-slate-400">Team / Vendor Quota</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Up to {selectedPlan.max_users} Users</span>
                </div>
                <div className="mt-3 border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Total Due Today</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">${selectedPlan.monthly_price} / month</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  Instant Activation Guaranteed
                </p>
                Once payment is confirmed, your account's project limit will be increased to {selectedPlan.max_projects} projects immediately and an official VAT invoice will be generated.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleConfirmPayment}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
                >
                  {processing ? "Activating Plan..." : `Pay $${selectedPlan.monthly_price} & Activate`}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
