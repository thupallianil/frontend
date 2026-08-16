import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Building2,
  Lock,
  Percent,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  Check,
  Copy,
  Loader2,
  Sparkles,
  Clock,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

import { launchRazorpayCheckout } from "../../utils/razorpay";
import useSettings from "../../hooks/useSettings";

// ============================================================
// BRAND LOGOS (High-Fidelity SVG Components)
// ============================================================

function RazorpayLogo({ className = "h-7" }) {
  return (
    <div className={`flex items-center gap-1.5 font-black text-2xl italic tracking-tight text-white ${className}`}>
      <span className="text-[#00BAF2] text-3xl font-serif leading-none">1</span>
      <span>Razorpay</span>
    </div>
  );
}

function GPayLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 shrink-0">
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    </div>
  );
}

function PhonePeLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5f259f] text-white shadow-sm shrink-0 font-black text-lg leading-none">
      पे
    </div>
  );
}

function PaytmLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 shrink-0 p-1">
      <div className="flex flex-col items-center justify-center leading-none">
        <span className="text-[10px] font-black text-[#002970] tracking-tighter">pay</span>
        <span className="text-[10px] font-black text-[#00b9f5] tracking-tighter">tm</span>
      </div>
    </div>
  );
}

function BhimLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 shrink-0 p-1">
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <polygon points="4,2 14,12 4,22" fill="#008444" />
        <polygon points="12,2 22,12 12,22" fill="#F37021" />
      </svg>
    </div>
  );
}

function UpiLogo() {
  return (
    <div className="flex h-7 w-9 items-center justify-center shrink-0">
      <svg viewBox="0 0 32 16" className="h-4 w-7">
        <text x="0" y="12" fontWeight="900" fontSize="13" fontStyle="italic" fill="#3B82F6">UPI</text>
        <polygon points="24,2 30,8 24,14" fill="#10B981"/>
        <polygon points="20,2 26,8 20,14" fill="#F59E0B"/>
      </svg>
    </div>
  );
}

// Popular Banks for NetBanking
const POPULAR_BANKS = [
  { id: "HDFC", name: "HDFC Bank", badge: "HDFC", color: "bg-blue-900 text-white" },
  { id: "SBIN", name: "State Bank of India", badge: "SBI", color: "bg-cyan-700 text-white" },
  { id: "ICIC", name: "ICICI Bank", badge: "ICICI", color: "bg-orange-700 text-white" },
  { id: "UTIB", name: "Axis Bank", badge: "AXIS", color: "bg-pink-900 text-white" },
  { id: "KKBK", name: "Kotak Mahindra", badge: "KOTAK", color: "bg-red-700 text-white" },
  { id: "PUNB", name: "Punjab National Bank", badge: "PNB", color: "bg-amber-800 text-white" },
  { id: "BARB", name: "Bank of Baroda", badge: "BOB", color: "bg-orange-600 text-white" },
  { id: "YESB", name: "Yes Bank", badge: "YES", color: "bg-blue-700 text-white" },
];

const WALLETS = [
  { id: "paytm", name: "Paytm Wallet", desc: "Link & Pay instantly", logo: PaytmLogo },
  { id: "phonepe", name: "PhonePe Wallet", desc: "Pay with PhonePe balance", logo: PhonePeLogo },
  { id: "mobikwik", name: "MobiKwik", desc: "Fast 1-click checkout", logo: UpiLogo },
  { id: "amazonpay", name: "Amazon Pay Balance", desc: "Direct Amazon checkout", logo: GPayLogo },
];

export default function PaymentModal({
  open,
  invoice,
  onClose,
  onPaymentSuccess,
}) {
  const { formatCurrency, getBusinessInfo, getPaymentConfig, settings } = useSettings();
  const business = getBusinessInfo();
  const paymentSettings = getPaymentConfig ? getPaymentConfig() : (settings?.payments || {});

  // Active Tab ("upi", "cards", "netbanking", "wallet", "emi")
  const [activeTab, setActiveTab] = useState("upi");

  // Selected sub-view in UPI (null = main list, "gpay" | "phonepe" | "paytm" | "bhim" | "custom" | "qr")
  const [activeUpiView, setActiveUpiView] = useState(null);
  const [customVpa, setCustomVpa] = useState("");
  const [upiCountdown, setUpiCountdown] = useState(300); // 5 mins

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState("paytm");

  // EMI state
  const [selectedEmiTenure, setSelectedEmiTenure] = useState(3);

  // Processing & Success states
  const [processing, setProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState("");
  const [successData, setSuccessData] = useState(null);

  const payableAmount = Number(
    invoice?.balance_due ??
    invoice?.balanceDue ??
    invoice?.total ??
    1499.00
  );

  const formattedPayable = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(payableAmount);
  }, [payableAmount]);

  const orderNumber = invoice?.invoice_number || `order_${invoice?.id || '29Hdsf398'}`;
  const businessName = invoice?.business?.business_name || business?.business_name || "Merchant";

  // Dynamic UPI Intent String
  const resolvedUpiId = (
    invoice?.payment_settings?.upiId ||
    invoice?.business?.upi_id ||
    invoice?.business?.upiId ||
    paymentSettings?.upiId ||
    business?.upi_id ||
    business?.upiId ||
    ""
  ).trim();
  const upiId = resolvedUpiId || "6303068697561@ybl";
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(businessName)}&am=${payableAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(orderNumber)}`;

  // Countdown timer for active UPI screen
  useEffect(() => {
    let timer;
    if (activeUpiView && upiCountdown > 0 && !successData) {
      timer = setInterval(() => setUpiCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeUpiView, upiCountdown, successData]);

  // Execute real payment via Razorpay SDK and verify with backend
  const handleExecutePayment = async (methodLabel = "UPI", extraNotes = "") => {
    setProcessing(true);
    setProcessingMsg("Connecting to Razorpay Secure Gateway...");

    try {
      let prefMethod = null;
      const lower = methodLabel.toLowerCase();
      if (lower.includes("upi") || lower.includes("gpay") || lower.includes("phonepe") || lower.includes("paytm") || lower.includes("bhim")) {
        prefMethod = "upi";
      } else if (lower.includes("card")) {
        prefMethod = "card";
      } else if (lower.includes("netbank") || lower.includes("bank")) {
        prefMethod = "netbanking";
      } else if (lower.includes("wallet")) {
        prefMethod = "wallet";
      }

      await launchRazorpayCheckout({
        invoice,
        amount: payableAmount,
        preferredMethod: prefMethod,
        onSuccess: (data) => {
          setProcessing(false);
          const txnId = data?.data?.gateway_payment_id || data?.gateway_payment_id || data?.payment_id || "PAY_RZP_SUCCESS";
          setSuccessData({
            txnId,
            amount: formattedPayable,
            method: methodLabel,
            receiptId: data?.data?.receipt?.id || data?.receipt?.id,
          });
          toast.success(`Payment of ${formattedPayable} verified and completed!`);
          onPaymentSuccess?.(data);
        },
        onError: (err) => {
          setProcessing(false);
          console.error("Razorpay error:", err);
        },
      });
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      console.error("Payment execution error:", err);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col md:flex-row min-h-[500px] max-h-[92vh] border border-slate-200"
        >
          {/* ====================================================
              LEFT PANEL (Royal Blue Razorpay Branded Panel)
          ==================================================== */}
          <div className="w-full md:w-[320px] bg-gradient-to-b from-[#2B47FC] via-[#243FE8] to-[#1C33CE] p-6 sm:p-7 text-white flex flex-col justify-between shrink-0 select-none relative overflow-hidden">
            {/* Top section */}
            <div>
              {/* Back button & Logo */}
              <div className="flex items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => {
                    if (activeUpiView) {
                      setActiveUpiView(null);
                    } else {
                      onClose();
                    }
                  }}
                  className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition"
                  title="Go Back"
                >
                  <ArrowLeft size={20} />
                </button>

                <RazorpayLogo />
              </div>

              {/* Payable Amount */}
              <div className="pt-6">
                <p className="text-xs font-semibold text-white/80">
                  Payable Amount
                </p>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1.5 font-sans">
                  {formattedPayable}
                </div>
              </div>
            </div>

            {/* Bottom Security Badge */}
            <div className="pt-8 border-t border-white/15">
              <div className="flex items-start gap-2.5 text-white/90">
                <ShieldCheck size={18} className="text-white/90 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">
                    Secured by Razorpay
                  </p>
                  <p className="text-[11px] text-white/70 leading-snug mt-0.5">
                    Your payment details are secure with Razorpay.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT PANEL (Payment Options & Dynamic Subviews)
          ==================================================== */}
          <div className="flex-1 flex flex-col justify-between bg-white overflow-hidden">
            {/* Success View */}
            {successData ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 size={36} />
                </motion.div>

                <h3 className="text-xl font-bold text-slate-900">
                  Payment Successful!
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your payment of <strong className="text-slate-900">{successData.amount}</strong> was received.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left w-full max-w-sm space-y-1.5 font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Payment ID:</span>
                    <span className="font-bold text-slate-900">{successData.txnId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="font-bold text-slate-900">{successData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invoice Status:</span>
                    <span className="font-bold text-emerald-600">PAID</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl bg-[#2B47FC] hover:bg-[#1D35D9] text-white text-sm font-bold shadow-md transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Top Bar */}
                <div className="p-6 pb-0">
                  <div className="flex items-center justify-between pb-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Payment Options
                    </h2>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={processing}
                      className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Navigation Tabs (UPI, Cards, Netbanking, Wallet, EMI) */}
                  <div className="flex items-center justify-between border-b border-slate-200 mt-2">
                    {/* UPI Tab */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("upi");
                        setActiveUpiView(null);
                      }}
                      className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition relative ${
                        activeTab === "upi"
                          ? "text-[#2B47FC]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <UpiLogo />
                      <span>UPI</span>
                      {activeTab === "upi" && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B47FC]"
                        />
                      )}
                    </button>

                    {/* Cards Tab */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("cards");
                        setActiveUpiView(null);
                      }}
                      className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition relative ${
                        activeTab === "cards"
                          ? "text-[#2B47FC]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <CreditCard size={18} />
                      <span>Cards</span>
                      {activeTab === "cards" && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B47FC]"
                        />
                      )}
                    </button>

                    {/* Netbanking Tab */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("netbanking");
                        setActiveUpiView(null);
                      }}
                      className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition relative ${
                        activeTab === "netbanking"
                          ? "text-[#2B47FC]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Building2 size={18} />
                      <span>Netbanking</span>
                      {activeTab === "netbanking" && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B47FC]"
                        />
                      )}
                    </button>

                    {/* Wallet Tab */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("wallet");
                        setActiveUpiView(null);
                      }}
                      className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition relative ${
                        activeTab === "wallet"
                          ? "text-[#2B47FC]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Wallet size={18} />
                      <span>Wallet</span>
                      {activeTab === "wallet" && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B47FC]"
                        />
                      )}
                    </button>

                    {/* EMI Tab */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("emi");
                        setActiveUpiView(null);
                      }}
                      className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition relative ${
                        activeTab === "emi"
                          ? "text-[#2B47FC]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Percent size={17} />
                      <span>EMI</span>
                      {activeTab === "emi" && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B47FC]"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* TAB CONTENTS (Scrollable body) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* ==============================================
                      TAB 1: UPI
                  ============================================== */}
                  {activeTab === "upi" && (
                    <div>
                      {/* Active UPI App Confirmation / Approval Sub-Screen */}
                      {activeUpiView === "qr" ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveUpiView(null)}
                              className="text-xs font-bold text-[#2B47FC] hover:underline flex items-center gap-1"
                            >
                              <ArrowLeft size={14} /> Back to UPI options
                            </button>
                          </div>

                          <div className="p-6 rounded-2xl border border-slate-200 bg-white text-center space-y-4 shadow-sm">
                            <div className="flex flex-col items-center justify-center">
                              <div className="p-3.5 rounded-2xl bg-white border-2 border-indigo-500 shadow-md">
                                <QRCodeSVG
                                  value={upiString}
                                  size={180}
                                  level="M"
                                  includeMargin={false}
                                />
                              </div>
                              <p className="text-xs font-bold text-slate-800 mt-3">{businessName}</p>
                              <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mt-1">
                                {upiId}
                              </span>
                              <p className="text-sm font-black text-slate-900 mt-2">
                                Amount: {formattedPayable}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Scan with any UPI app (GPay, PhonePe, Paytm, BHIM, CRED)
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={processing}
                              onClick={() => handleExecutePayment("UPI QR")}
                              className="w-full h-11 rounded-xl bg-[#2B47FC] hover:bg-[#1D35D9] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                            >
                              {processing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={14} />}
                              <span>Pay via Official Razorpay Gateway ({formattedPayable})</span>
                            </button>
                          </div>
                        </div>
                      ) : activeUpiView && activeUpiView !== "custom" ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveUpiView(null)}
                              className="text-xs font-bold text-[#2B47FC] hover:underline flex items-center gap-1"
                            >
                              <ArrowLeft size={14} /> Back to UPI options
                            </button>
                          </div>

                          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3">
                            <div className="flex justify-center">
                              {activeUpiView === "gpay" && <GPayLogo />}
                              {activeUpiView === "phonepe" && <PhonePeLogo />}
                              {activeUpiView === "paytm" && <PaytmLogo />}
                              {activeUpiView === "bhim" && <BhimLogo />}
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                Pay with {activeUpiView.toUpperCase()}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                Open the official Razorpay checkout to pay <strong className="text-slate-900">{formattedPayable}</strong> using {activeUpiView.toUpperCase()} or QR
                              </p>
                            </div>

                            <div className="pt-2">
                              <button
                                type="button"
                                disabled={processing}
                                onClick={() => handleExecutePayment(`${activeUpiView.toUpperCase()} UPI`)}
                                className="w-full h-11 rounded-xl bg-[#2B47FC] hover:bg-[#1D35D9] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                              >
                                {processing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={14} />}
                                {processing ? processingMsg : `Pay ${formattedPayable} via Razorpay`}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Main UPI Options List (Exact as Image) */
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-800">
                            Pay using UPI
                          </h4>

                          {/* List of UPI Apps matching Screenshot */}
                          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                            {/* Google Pay */}
                            <button
                              type="button"
                              onClick={() => {
                                setUpiCountdown(300);
                                setActiveUpiView("gpay");
                              }}
                              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left group"
                            >
                              <div className="flex items-center gap-3.5">
                                <GPayLogo />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">Google Pay</p>
                                  <p className="text-xs text-slate-500">Pay using Google Pay</p>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                            </button>

                            {/* PhonePe */}
                            <button
                              type="button"
                              onClick={() => {
                                setUpiCountdown(300);
                                setActiveUpiView("phonepe");
                              }}
                              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left group"
                            >
                              <div className="flex items-center gap-3.5">
                                <PhonePeLogo />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">PhonePe</p>
                                  <p className="text-xs text-slate-500">Pay using PhonePe</p>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                            </button>

                            {/* Paytm */}
                            <button
                              type="button"
                              onClick={() => {
                                setUpiCountdown(300);
                                setActiveUpiView("paytm");
                              }}
                              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left group"
                            >
                              <div className="flex items-center gap-3.5">
                                <PaytmLogo />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">Paytm</p>
                                  <p className="text-xs text-slate-500">Pay using Paytm</p>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                            </button>

                            {/* BHIM UPI */}
                            <button
                              type="button"
                              onClick={() => {
                                setUpiCountdown(300);
                                setActiveUpiView("bhim");
                              }}
                              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left group"
                            >
                              <div className="flex items-center gap-3.5">
                                <BhimLogo />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">BHIM UPI</p>
                                  <p className="text-xs text-slate-500">Pay using BHIM UPI</p>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                            </button>

                            {/* Other UPI Apps / Enter UPI ID */}
                            <div>
                              <button
                                type="button"
                                onClick={() => setActiveUpiView(activeUpiView === "custom" ? null : "custom")}
                                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left group"
                              >
                                <div className="flex items-center gap-3.5">
                                  <UpiLogo />
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Other UPI Apps</p>
                                    <p className="text-xs text-slate-500">Use any other UPI app</p>
                                  </div>
                                </div>
                                <ChevronRight
                                  size={18}
                                  className={`text-slate-400 transition-transform ${activeUpiView === "custom" ? "rotate-90" : "group-hover:translate-x-0.5"}`}
                                />
                              </button>

                              {activeUpiView === "custom" && (
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="username@okhdfcbank / mobile@ybl"
                                    value={customVpa}
                                    onChange={(e) => setCustomVpa(e.target.value)}
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-[#2B47FC]"
                                  />
                                  <button
                                    type="button"
                                    disabled={!customVpa.trim() || processing}
                                    onClick={() => handleExecutePayment(`UPI (${customVpa})`)}
                                    className="rounded-xl bg-[#2B47FC] px-4 py-2 text-xs font-bold text-white hover:bg-[#1D35D9] transition disabled:opacity-50"
                                  >
                                    {processing ? "Paying..." : "Pay Now"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Scan & Pay with any UPI App */}
                          <div
                            onClick={() => setActiveUpiView("qr")}
                            className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-300 transition"
                          >
                            <div>
                              <h5 className="text-sm font-bold text-slate-900">
                                Scan & Pay with any UPI App
                              </h5>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Scan the dynamic QR code with Google Pay, PhonePe or Paytm
                              </p>
                              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#2B47FC]">
                                Click to view full scannable QR &rarr;
                              </span>
                            </div>

                            <div className="p-1 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0">
                              <QRCodeSVG
                                value={upiString}
                                size={64}
                                level="M"
                                includeMargin={false}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ==============================================
                      TAB 2: CARDS
                  ============================================== */}
                  {activeTab === "cards" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800">
                        Pay using Card
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            Card Number
                          </label>
                          <div className="relative">
                            <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              maxLength={19}
                              placeholder="4111 2222 3333 4444"
                              value={cardNumber}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, "").substring(0, 16);
                                const formatted = v.match(/.{1,4}/g)?.join(" ") || v;
                                setCardNumber(formatted);
                              }}
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-[#2B47FC]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "").substring(0, 4);
                                if (v.length > 2) v = `${v.substring(0, 2)}/${v.substring(2)}`;
                                setCardExpiry(v);
                              }}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-[#2B47FC]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">
                              CVV / CVC
                            </label>
                            <div className="relative">
                              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="password"
                                maxLength={4}
                                placeholder="123"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                                className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-[#2B47FC]"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#2B47FC]"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="save-card-toggle"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                          />
                          <label htmlFor="save-card-toggle" className="text-xs text-slate-600 cursor-pointer select-none">
                            Save this card securely as per RBI guidelines
                          </label>
                        </div>

                        <button
                          type="button"
                          disabled={processing}
                          onClick={() => handleExecutePayment("Card", cardNumber ? `Card ending ${cardNumber.slice(-4)}` : "")}
                          className="w-full mt-2 h-12 rounded-xl bg-[#2B47FC] hover:bg-[#1D35D9] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Lock size={16} />
                          )}
                          {processing ? "Processing..." : `Pay ${formattedPayable}`}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==============================================
                      TAB 3: NETBANKING
                  ============================================== */}
                  {activeTab === "netbanking" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800">
                        Popular Banks
                      </h4>

                      <div className="grid grid-cols-4 gap-2.5">
                        {POPULAR_BANKS.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBank(b.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                              selectedBank === b.id
                                ? "border-[#2B47FC] bg-indigo-50/50 shadow-sm"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <span className={`h-7 w-7 rounded-lg ${b.color} flex items-center justify-center font-bold text-[10px] mb-1.5`}>
                              {b.badge}
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 leading-tight">
                              {b.name.split(" ")[0]}
                            </span>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => handleExecutePayment(`Netbanking (${selectedBank})`)}
                        className="w-full mt-3 h-12 rounded-xl bg-[#2B47FC] hover:bg-[#1D35D9] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Lock size={16} />
                        )}
                        {processing ? "Processing..." : `Pay ${formattedPayable} with ${selectedBank}`}
                      </button>
                    </div>
                  )}

                  {/* ==============================================
                      TAB 4: WALLET
                  ============================================== */}
                  {activeTab === "wallet" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800">
                        Pay using Wallets
                      </h4>

                      <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                        {WALLETS.map((w) => {
                          const LogoComponent = w.logo;
                          return (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => handleExecutePayment(w.name)}
                              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left group"
                            >
                              <div className="flex items-center gap-3.5">
                                <LogoComponent />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{w.name}</p>
                                  <p className="text-xs text-slate-500">{w.desc}</p>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ==============================================
                      TAB 5: EMI
                  ============================================== */}
                  {activeTab === "emi" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-800">
                        Pay with Easy EMI Options
                      </h4>

                      <div className="space-y-2.5">
                        {[
                          { months: 3, perMonth: payableAmount / 3, interest: "12% p.a." },
                          { months: 6, perMonth: (payableAmount * 1.06) / 6, interest: "13% p.a." },
                          { months: 9, perMonth: (payableAmount * 1.09) / 9, interest: "14% p.a." },
                          { months: 12, perMonth: (payableAmount * 1.12) / 12, interest: "15% p.a." },
                        ].map((emi) => (
                          <div
                            key={emi.months}
                            onClick={() => setSelectedEmiTenure(emi.months)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              selectedEmiTenure === emi.months
                                ? "border-[#2B47FC] bg-indigo-50/50"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                {emi.months} Months Plan
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Interest: {emi.interest}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-[#2B47FC]">
                                ₹ {emi.perMonth.toFixed(2)}/mo
                              </p>
                              <span className="text-[10px] text-slate-400">Total: ₹ {(emi.perMonth * emi.months).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => handleExecutePayment(`EMI (${selectedEmiTenure} Months)`)}
                        className="w-full mt-3 h-12 rounded-xl bg-[#2B47FC] hover:bg-[#1D35D9] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Lock size={16} />
                        )}
                        {processing ? "Processing..." : `Proceed with ${selectedEmiTenure} Months EMI`}
                      </button>
                    </div>
                  )}
                </div>

                {/* ====================================================
                    BOTTOM FOOTER (100% Secure Payments Bar)
                ==================================================== */}
                <div className="bg-[#F4F6FD] border-t border-slate-200/80 px-6 py-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
                  <ShieldCheck size={16} className="text-[#2B47FC]" />
                  <span>100% Secure Payments Powered by Razorpay</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}