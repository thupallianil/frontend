import api from "../services/api";
import { toast } from "react-hot-toast";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Directly launch the official Razorpay Checkout popup in 1 click
 * Supports ALL real payment methods:
 * - UPI (Google Pay, PhonePe, Paytm, BHIM, Cred, Any UPI ID & Dynamic QR)
 * - Credit & Debit Cards (Visa, MasterCard, RuPay, Maestro, Amex)
 * - NetBanking (All 50+ Indian banks)
 * - Wallets (Paytm, PhonePe, MobiKwik, Airtel Money, Freecharge)
 * - Pay Later & Card/Cardless EMI
 */
export const launchRazorpayCheckout = async ({
  invoice,
  amount,
  preferredMethod,
  onSuccess,
  onError,
}) => {
  const effectiveAmount = Number(
    amount ??
      invoice?.balance_due ??
      invoice?.balanceDue ??
      invoice?.grand_total ??
      invoice?.grandTotal ??
      invoice?.total ??
      0
  );

  if (!invoice?.id || effectiveAmount <= 0) {
    toast.error("Invoice has no outstanding balance.");
    return;
  }

  const toastId = toast.loading("Connecting to Razorpay...", { id: "rzp-loader" });

  try {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
    }

    const orderRes = await api.post("/payments/create-order/", {
      invoice_id: invoice.id,
      amount: effectiveAmount,
    });

    const orderData = orderRes?.data?.data || orderRes?.data;
    if (!orderData?.gateway_order_id) {
      throw new Error(orderRes?.data?.message || "Unable to create Razorpay payment order.");
    }

    const activeKey = orderData.key_id;
    if (!activeKey || activeKey.includes("YOUR_KEY") || activeKey.includes("placeholder")) {
      throw new Error("Razorpay API key is not configured. Please add it in Settings → Payments.");
    }

    toast.dismiss(toastId);

    const amountInPaise = Math.round(effectiveAmount * 100);

    const prefillData = {
      name: invoice?.client?.name || invoice?.client_name || "",
      email: invoice?.client?.email || invoice?.client_email || "",
      contact: invoice?.client?.phone || invoice?.client_phone || "",
    };

    if (preferredMethod) {
      prefillData.method = preferredMethod;
    }

    const options = {
      key: activeKey,
      amount: amountInPaise,
      currency: orderData.currency || "INR",
      name: invoice?.business?.business_name || invoice?.business_name || "Invoice Settlement",
      description: `Payment for Invoice ${invoice.invoice_number || invoice.id}`,
      order_id: orderData.gateway_order_id,
      handler: async function (response) {
        const verifyToast = toast.loading("Verifying payment...", { id: "rzp-verify" });
        try {
          const verifyRes = await api.post("/payments/verify/", {
            payment_id: orderData.payment_id,
            gateway_payment_id: response.razorpay_payment_id,
            gateway_signature: response.razorpay_signature,
          });

          toast.dismiss(verifyToast);

          if (verifyRes?.data?.success || verifyRes?.success) {
            toast.success("Payment verified and recorded successfully!");
            if (onSuccess) {
              onSuccess(verifyRes?.data || verifyRes);
            } else {
              window.location.reload();
            }
          } else {
            toast.error("Payment verification failed.");
            onError?.(new Error("Verification failed"));
          }
        } catch (err) {
          toast.dismiss(verifyToast);
          toast.error(err?.response?.data?.message || "Payment verification failed.");
          onError?.(err);
        }
      },
      prefill: prefillData,
      theme: {
        color: "#4f46e5",
      },
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI / QR Code",
              instruments: [
                {
                  method: "upi",
                },
              ],
            },
            cards: {
              name: "Cards & NetBanking",
              instruments: [
                {
                  method: "card",
                },
                {
                  method: "netbanking",
                },
                {
                  method: "wallet",
                },
                {
                  method: "paylater",
                },
              ],
            },
          },
          sequence: ["block.upi", "block.cards"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      modal: {
        ondismiss: function () {
          toast("Payment window closed.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      toast.error(response.error?.description || "Payment failed.");
      onError?.(response.error);
    });
    rzp.open();
  } catch (err) {
    toast.dismiss(toastId);
    const msg = err?.response?.data?.message || err?.message || "Unable to launch Razorpay.";
    toast.error(msg);
    onError?.(err);
  }
};

