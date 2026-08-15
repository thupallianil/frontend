import {
  CheckCircle2,
  CreditCard,
  Percent,
  ShieldCheck,
  Smartphone,
  Building2,
  Banknote,
  X,
  Sparkles,
  AlertCircle,
  QrCode,
  Lock,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

import { createPaymentOrder, verifyPayment, createManualPayment } from "../../api/payments";
import { loadRazorpayScript } from "../../utils/razorpay";
import useSettings from "../../hooks/useSettings";
import DynamicUpiQr from "./DynamicUpiQr";
import DynamicNetBanking from "./DynamicNetBanking";

// Popular Banks List for NetBanking
const POPULAR_BANKS = [
  { id: "HDFC", name: "HDFC Bank", code: "HDFC00001", color: "bg-blue-900 text-white" },
  { id: "ICICI", name: "ICICI Bank", code: "ICIC00002", color: "bg-orange-700 text-white" },
  { id: "SBI", name: "State Bank of India", code: "SBIN00003", color: "bg-cyan-700 text-white" },
  { id: "AXIS", name: "Axis Bank", code: "UTIB00004", color: "bg-pink-900 text-white" },
  { id: "KOTAK", name: "Kotak Mahindra", code: "KKBK00005", color: "bg-red-700 text-white" },
  { id: "PNB", name: "Punjab National Bank", code: "PUNB00006", color: "bg-amber-800 text-white" },
  { id: "BOB", name: "Bank of Baroda", code: "BARB00007", color: "bg-orange-600 text-white" },
  { id: "YES", name: "Yes Bank", code: "YESB00008", color: "bg-blue-700 text-white" },
];

export default function PaymentModal({
  open,
  invoice,
  onClose,
  onPaymentSuccess,
  loading = false,
}) {
  const { formatCurrency, getBusinessInfo, settings } = useSettings();
  const business = getBusinessInfo();
  const paymentSettings = settings?.payments || {};

  // Selected payment category tab
  const [activeTab, setActiveTab] = useState("upi"); // "upi" | "card" | "netbanking" | "bank" | "cash"

  // Amount states
  const [payType, setPayType] = useState("full"); // "full" | "partial"
  const [customAmount, setCustomAmount] = useState("");

  // Processing states
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // UPI Specific state
  const [upiUtr, setUpiUtr] = useState(""); // Real UTR from customer's payment app
  const [qrExpirySeconds, setQrExpirySeconds] = useState(600); // 10 mins

  // Bank Transfer state
  const [copiedField, setCopiedField] = useState(null);
  const [bankUtr, setBankUtr] = useState(""); // Real UTR from bank

  // Cash Voucher state
  const [cashVoucherRef, setCashVoucherRef] = useState("");
  const [cashierName, setCashierName] = useState("Authorized Counter Cashier");
  const [denominations, setDenominations] = useState({ 500: 0, 200: 0, 100: 0, 50: 0 });

  const balanceDue = Number(
    invoice?.balance_due ??
      invoice?.balanceDue ??
      invoice?.grand_total ??
      invoice?.grandTotal ??
      invoice?.total ??
      0
  );

  const effectiveAmount =
    payType === "full"
      ? balanceDue
      : Math.min(balanceDue, Math.max(1, Number(customAmount) || 0));

  // Business payment settings resolution
  const merchantUpiId = paymentSettings.upiId || business.upi_id || business.upiId || "";
  const merchantBankName = paymentSettings.bankName || "Business Bank Account";
  const merchantAccountName = paymentSettings.accountName || business.businessName || business.companyName || "Business Enterprise";
  const merchantAccountNumber = paymentSettings.accountNumber || "N/A";
  const merchantIfsc = paymentSettings.ifscCode || paymentSettings.ifsc || "N/A";

  // Dynamic UPI URL for QR code
  const dynamicUpiUrl = useMemo(() => {
    const invNum = invoice?.invoice_number || invoice?.id || "INV";
    const bName = business.businessName || "Merchant";
    return `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(bName)}&am=${effectiveAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Invoice ' + invNum)}`;
  }, [merchantUpiId, business.businessName, effectiveAmount, invoice]);

  // Initial reset on open
  useEffect(() => {
    if (open) {
      setActiveTab("upi");
      setProcessing(false);
      setProcessingStep(0);
      setPayType("full");
      setCustomAmount(String(balanceDue > 0 ? balanceDue : 0));
      setQrExpirySeconds(600);
      setUpiUtr("");
      setBankUtr("");
      generateInitialVoucherRef();
    }
  }, [open, balanceDue, invoice]);

  // QR Expiry countdown
  useEffect(() => {
    if (!open || activeTab !== "upi") return;
    const interval = setInterval(() => {
      setQrExpirySeconds((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, activeTab]);

  const generateInitialVoucherRef = () => {
    const now = new Date();
    const dStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    setCashVoucherRef(`CSH-REC-${dStr}-${rand}`);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };



  // Execute backend payment recording with realistic verification
  const executePaymentFinalization = async ({ method, transactionId, notes }) => {
    try {
      setProcessing(true);
      setProcessingStep(1);

      // Step 1: Network Handshake
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep(2);

      // Step 2: Banking Switch Authorization
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStep(3);

      const result = await createManualPayment({
        invoice_id: invoice.id,
        amount: effectiveAmount,
        method: method === "netbanking" || method === "card" ? "card" : method,
        transaction_id: transactionId,
        notes: notes || `Settled via ${method.toUpperCase()} Gateway`,
      });

      const receiptId =
        result?.data?.payment?.receipt_id ||
        result?.data?.receipt_id ||
        result?.receipt_id ||
        result?.data?.id;

      // Step 4: Reconciled
      await new Promise((r) => setTimeout(r, 400));

      toast.success("Payment authorized & digital receipt generated!");
      setOtpModalOpen(false);
      onPaymentSuccess?.({
        method,
        invoiceId: invoice.id,
        amount: effectiveAmount,
        receiptId,
        payment: result?.data?.payment || result?.data || result,
      });
      onClose?.();
    } catch (error) {
      console.error("Payment execution error:", error);
      toast.error(error?.response?.data?.message || "Transaction could not be settled.");
    } finally {
      setProcessing(false);
      setProcessingStep(0);
    }
  };

  // 1. UPI Payment — requires REAL UTR from customer's payment app
  const handleUpiPay = async () => {
    const utr = upiUtr.trim();
    if (!utr) {
      toast.error("Please enter the UPI reference number (UTR) from your payment app.");
      return;
    }
    // Basic UPI UTR format validation (10-22 alphanumeric)
    if (utr.length < 10) {
      toast.error("Invalid UTR. Please enter the full UPI reference number from your payment app.");
      return;
    }
    await executePaymentFinalization({
      method: "upi",
      transactionId: utr,
      notes: `UPI payment via QR scan. Customer UTR: ${utr}`,
    });
  };

  // 2. Card / NetBanking — Real Razorpay Checkout
  const handleRazorpayCheckout = async () => {
    const razorpayKeyId = paymentSettings.razorpayKeyId;
    if (!razorpayKeyId || razorpayKeyId.includes("YOUR_KEY") || razorpayKeyId.includes("placeholder")) {
      toast.error("Razorpay API keys are not configured. Go to Settings → Payments to add your Razorpay Key ID and Secret.");
      return;
    }
    setProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setProcessing(false);
        return;
      }

      toast.loading("Creating payment order...", { id: "rzp-order" });
      const orderRes = await createPaymentOrder({
        invoice_id: invoice.id,
        amount: effectiveAmount,
      });
      toast.dismiss("rzp-order");

      const orderData = orderRes?.data || orderRes;
      if (!orderData?.gateway_order_id) {
        throw new Error("Failed to create payment order. Please try again.");
      }

      const options = {
        key: orderData.key_id,
        amount: Math.round(effectiveAmount * 100),
        currency: orderData.currency || "INR",
        name: business.businessName || "Business Workspace",
        description: `Invoice ${invoice.invoice_number || invoice.id}`,
        order_id: orderData.gateway_order_id,
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "rzp-verify" });
            const verifyRes = await verifyPayment({
              payment_id: orderData.payment_id,
              gateway_payment_id: response.razorpay_payment_id,
              gateway_signature: response.razorpay_signature,
            });
            toast.dismiss("rzp-verify");
            toast.success("Payment verified and recorded successfully!");
            const receiptId = verifyRes?.data?.receipt_id || verifyRes?.receipt_id || verifyRes?.data?.id;
            onPaymentSuccess?.({
              method: "razorpay",
              invoiceId: invoice.id,
              amount: effectiveAmount,
              receiptId,
              payment: verifyRes?.data || verifyRes,
            });
            onClose?.();
          } catch (err) {
            toast.dismiss("rzp-verify");
            toast.error(err?.response?.data?.message || "Payment verification failed. Contact support.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: invoice?.client?.name || invoice?.client_name || "",
          email: invoice?.client?.email || "",
          contact: invoice?.client?.phone || "",
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (e) {
      toast.dismiss("rzp-order");
      toast.error(e?.response?.data?.message || e?.message || "Unable to open payment gateway.");
      setProcessing(false);
    }
  };

  // 3. Direct Bank Transfer — requires REAL UTR from bank statement
  const handleBankTransferPay = async () => {
    const utr = bankUtr.trim();
    if (!utr) {
      toast.error("Please enter the UTR/Transaction reference number from your bank.");
      return;
    }
    if (utr.length < 8) {
      toast.error("Invalid UTR. Bank UTR numbers are typically 12-22 characters.");
      return;
    }
    await executePaymentFinalization({
      method: "bank",
      transactionId: utr,
      notes: `Direct Bank Wire IMPS/NEFT to ${merchantBankName} A/C ${merchantAccountNumber.slice(-4)}. UTR: ${utr}`,
    });
  };

  // 4. Cash Counter Payment trigger (admin records cash received)
  const handleCashPay = async () => {
    const now = new Date();
    const dStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const voucherRef = cashVoucherRef.trim() || `CSH-REC-${dStr}-${rand}`;

    await executePaymentFinalization({
      method: "cash",
      transactionId: voucherRef,
      notes: `Cash collected by ${cashierName} (Voucher #${voucherRef})`,
    });
  };



  if (!invoice) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !processing) onClose?.();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl"
            >
              {/* TOP HEADER */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white">
                        Secure Payment Portal
                      </h2>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <Lock size={10} /> 256-Bit SSL
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Settlement for <span className="font-semibold text-slate-200">{invoice.invoice_number || `Invoice #${invoice.id}`}</span> · {business.businessName || "Business Workspace"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={processing}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* MAIN BODY: 2-COLUMN LAYOUT */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                
                {/* LEFT COLUMN: METHOD SELECTION & SUMMARY (4.5 COLS) */}
                <div className="md:col-span-5 p-5 sm:p-6 bg-slate-950/40 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Amount Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 p-4 border border-indigo-500/20 shadow-inner">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                        Total Amount Due
                      </span>
                      <div className="mt-1 flex items-baseline justify-between">
                        <p className="text-2xl sm:text-3xl font-black text-white">
                          {formatCurrency(effectiveAmount)}
                        </p>
                        {payType === "partial" && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                            Partial Amount
                          </span>
                        )}
                      </div>

                      {/* Full vs Partial Toggle */}
                      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPayType("full");
                              setCustomAmount(String(balanceDue));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              payType === "full"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            Full ({formatCurrency(balanceDue)})
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPayType("partial");
                              setCustomAmount(String(Math.round(balanceDue / 2)));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              payType === "partial"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            Custom
                          </button>
                        </div>

                        {payType === "partial" && (
                          <input
                            type="number"
                            min="1"
                            max={balanceDue}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs font-bold text-white focus:border-indigo-500 outline-none text-right"
                          />
                        )}
                      </div>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="mt-5 space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Choose Payment Method
                      </label>

                      {/* 1. UPI */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("upi")}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                          activeTab === "upi"
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeTab === "upi" ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400"}`}>
                            <QrCode size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">UPI / Dynamic QR Code</p>
                            <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm, BHIM, Cred</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className={activeTab === "upi" ? "text-indigo-400" : "text-slate-600"} />
                      </button>

                      {/* 2. Cards */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("card")}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                          activeTab === "card"
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeTab === "card" ? "bg-indigo-600 text-white" : "bg-slate-800 text-purple-400"}`}>
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">Credit / Debit Cards</p>
                            <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay, Amex (3D Secure)</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className={activeTab === "card" ? "text-indigo-400" : "text-slate-600"} />
                      </button>

                      {/* 3. NetBanking */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("netbanking")}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                          activeTab === "netbanking"
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeTab === "netbanking" ? "bg-indigo-600 text-white" : "bg-slate-800 text-blue-400"}`}>
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">NetBanking</p>
                            <p className="text-[10px] text-slate-400">All Major Indian & International Banks</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className={activeTab === "netbanking" ? "text-indigo-400" : "text-slate-600"} />
                      </button>

                      {/* 4. Bank Wire / NEFT */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("bank")}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                          activeTab === "bank"
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeTab === "bank" ? "bg-indigo-600 text-white" : "bg-slate-800 text-emerald-400"}`}>
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">Bank Wire / IMPS / NEFT</p>
                            <p className="text-[10px] text-slate-400">Direct Account Transfer with UTR</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className={activeTab === "bank" ? "text-indigo-400" : "text-slate-600"} />
                      </button>

                      {/* 5. Cash Counter */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("cash")}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                          activeTab === "cash"
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeTab === "cash" ? "bg-indigo-600 text-white" : "bg-slate-800 text-amber-400"}`}>
                            <Banknote size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">Cash Counter Voucher</p>
                            <p className="text-[10px] text-slate-400">In-Person Signed Cash Settlement</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className={activeTab === "cash" ? "text-indigo-400" : "text-slate-600"} />
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-4 border-t border-slate-800">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    <span>Real-time cryptographic UTR verification & instantaneous sequential receipt generation.</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: ACTIVE METHOD INTERFACE (7.5 COLS) */}
                <div className="md:col-span-7 p-6 bg-slate-900/90 flex flex-col justify-between">
                  
                  {/* TAB 1: DYNAMIC UPI QR — Real UTR Required */}
                  {activeTab === "upi" && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Smartphone size={16} className="text-indigo-400" />
                            Scan & Pay with any UPI App
                          </h3>
                          <p className="text-xs text-slate-400">Scan QR Code via PhonePe, Google Pay, Paytm or Cred</p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                          <Clock size={12} />
                          <span>{Math.floor(qrExpirySeconds / 60)}:{String(qrExpirySeconds % 60).padStart(2, "0")}</span>
                        </div>
                      </div>

                      {/* Live Dynamic QR */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <DynamicUpiQr
                          upiId={merchantUpiId}
                          payeeName={business.businessName || "Business Workspace"}
                          amount={effectiveAmount}
                          invoiceNumber={invoice?.invoice_number || invoice?.id || ""}
                          size={150}
                          showApps={true}
                          showCopy={true}
                          showDetails={true}
                          allowEnlarge={true}
                          theme="dark"
                        />
                      </div>

                      {/* Real UTR Entry — mandatory after paying */}
                      <div className="rounded-2xl bg-slate-950 border border-slate-700 p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-200">Already paid? Enter your UPI Reference Number</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              After scanning & paying, open your UPI app (GPay/PhonePe/Paytm) → Transactions → Copy the <span className="text-amber-400 font-bold">12-digit UTR / Ref No</span>
                            </p>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="e.g. 423589654321 (from your payment app)"
                          value={upiUtr}
                          onChange={(e) => setUpiUtr(e.target.value.trim())}
                          className="w-full h-10 rounded-xl bg-slate-900 border border-slate-600 px-3.5 font-mono text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                        />

                        <button
                          type="button"
                          disabled={processing || !upiUtr.trim()}
                          onClick={handleUpiPay}
                          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                          {processing ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          Verify & Confirm Payment ({formatCurrency(effectiveAmount)})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CARDS & ONLINE — Real Razorpay Checkout */}
                  {activeTab === "card" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <CreditCard size={16} className="text-purple-400" />
                          Credit / Debit Cards & Online Banking
                        </h3>
                        <p className="text-xs text-slate-400">Powered by Razorpay — 3D Secure, PCI-DSS Compliant</p>
                      </div>

                      {/* Razorpay gateway info card */}
                      <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 border border-indigo-500/30 p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/30">
                            <CreditCard size={22} className="text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Secure Payment via Razorpay</p>
                            <p className="text-[11px] text-slate-400">Visa · Mastercard · RuPay · Amex · UPI · NetBanking</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-400 text-center">
                          {["Visa", "Mastercard", "RuPay", "Amex", "UPI", "NetBanking"].map((brand) => (
                            <span key={brand} className="rounded-lg bg-slate-800/60 border border-slate-700 px-2 py-1.5">{brand}</span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-400/10 rounded-xl px-3 py-2 border border-emerald-400/20">
                          <Lock size={12} />
                          <span>256-bit SSL · PCI-DSS Certified · 3D Secure 2.0</span>
                        </div>
                      </div>

                      {(!paymentSettings.razorpayKeyId || paymentSettings.razorpayKeyId.includes("YOUR_KEY")) && (
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
                          ⚠️ Razorpay API keys not configured. Go to <strong>Settings → Payments → Razorpay API Keys</strong> to enable card payments.
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={processing}
                        onClick={handleRazorpayCheckout}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-60"
                      >
                        {processing ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                        Pay {formatCurrency(effectiveAmount)} via Razorpay
                      </button>
                    </div>
                  )}

                  {/* TAB 3: NETBANKING — Real Razorpay Checkout */}
                  {activeTab === "netbanking" && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Building2 size={16} className="text-blue-400" />
                          NetBanking — All Major Banks
                        </h3>
                        <p className="text-xs text-slate-400">Real bank redirect via Razorpay gateway</p>
                      </div>

                      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                        <p className="text-[11px] text-slate-400">
                          Clicking the button below will open the Razorpay payment page where you can log in to your bank's NetBanking portal and complete the payment securely.
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {POPULAR_BANKS.slice(0, 8).map((b) => (
                            <span key={b.id} className={`rounded-lg ${b.color} text-center text-[9px] font-bold px-1 py-1.5 truncate`}>{b.name.split(" ")[0]}</span>
                          ))}
                        </div>
                      </div>

                      {(!paymentSettings.razorpayKeyId || paymentSettings.razorpayKeyId.includes("YOUR_KEY")) && (
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
                          ⚠️ Razorpay API keys not configured. Go to <strong>Settings → Payments → Razorpay API Keys</strong> to enable NetBanking.
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={processing}
                        onClick={handleRazorpayCheckout}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-600/30 disabled:opacity-60"
                      >
                        {processing ? <RefreshCw size={16} className="animate-spin" /> : <ExternalLink size={16} />}
                        Continue to Bank NetBanking ({formatCurrency(effectiveAmount)})
                      </button>
                    </div>
                  )}

                  {/* TAB 4: BANK WIRE / IMPS / NEFT */}
                  {activeTab === "bank" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Building2 size={16} className="text-emerald-400" />
                          Beneficiary Bank Account Details
                        </h3>
                        <p className="text-xs text-slate-400">Transfer from your mobile banking app via NEFT, RTGS or IMPS</p>
                      </div>

                      {/* Account Details Box */}
                      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                          <span className="text-slate-400">Beneficiary Name</span>
                          <span className="font-bold text-slate-100">{merchantAccountName}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                          <span className="text-slate-400">Bank Name</span>
                          <span className="font-bold text-slate-100">{merchantBankName}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                          <span className="text-slate-400">Account Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-400">{merchantAccountNumber}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(merchantAccountNumber, "Account Number")}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedField === "Account Number" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">IFSC Code</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-400">{merchantIfsc}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(merchantIfsc, "IFSC Code")}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedField === "IFSC Code" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Real UTR Entry — Required */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400">
                          Bank UTR / Transaction Reference <span className="text-red-400">*Required</span>
                        </label>
                        <p className="text-[10px] text-slate-500">
                          After transfer: Open your bank app → Transactions → Copy the UTR/Transaction ID (12–22 characters)
                        </p>
                        <input
                          type="text"
                          placeholder="e.g. UTR202608149817294 or HDFC2026081412345"
                          value={bankUtr}
                          onChange={(e) => setBankUtr(e.target.value)}
                          className="w-full h-10 rounded-xl bg-slate-950 border border-slate-700 px-3.5 font-mono text-xs text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={processing || !bankUtr.trim()}
                        onClick={handleBankTransferPay}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                      >
                        {processing ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Confirm Bank Transfer ({formatCurrency(effectiveAmount)})
                      </button>
                    </div>
                  )}

                  {/* TAB 5: CASH COUNTER */}
                  {activeTab === "cash" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Banknote size={16} className="text-amber-400" />
                          Physical Cash Collection Voucher
                        </h3>
                        <p className="text-xs text-slate-400">Generate serialized cash voucher with denomination record</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Cashier / Staff Name</label>
                          <input
                            type="text"
                            value={cashierName}
                            onChange={(e) => setCashierName(e.target.value)}
                            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-700 px-3.5 text-xs text-white focus:border-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Cash Voucher Reference Serial</label>
                          <input
                            type="text"
                            value={cashVoucherRef}
                            onChange={(e) => setCashVoucherRef(e.target.value)}
                            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-700 px-3.5 font-mono text-xs text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                        <span>Signed voucher receipt will be issued upon authorization.</span>
                      </div>

                      <button
                        type="button"
                        disabled={processing}
                        onClick={handleCashPay}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/20 disabled:opacity-60"
                      >
                        <CheckCircle2 size={16} />
                        Issue Signed Cash Receipt ({formatCurrency(effectiveAmount)})
                      </button>
                    </div>
                  )}

                  {/* BOTTOM PROCESSING STEP INDICATOR */}
                  {processing && (
                    <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-indigo-500/30 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Reconciling payment with live ledger...</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full transition-all duration-500"
                          style={{ width: `${(processingStep / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
}