"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export type RazorpayPaymentResult = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  verified: boolean;
};

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

type RazorpayCheckoutProps = {
  /** Fee in rupees (INR) */
  amountInRupees: number;
  receipt?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  disabled?: boolean;
  className?: string;
  onSuccess?: (result: RazorpayPaymentResult) => void;
  onDismiss?: () => void;
};

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export default function RazorpayCheckout({
  amountInRupees,
  receipt,
  description = "Registration Fee",
  customerName,
  customerEmail,
  customerPhone,
  disabled = false,
  className,
  onSuccess,
  onDismiss,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [verified, setVerified] = useState(false);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handlePay = useCallback(async () => {
    if (!keyId) {
      toast.error("Payment gateway is not configured. Please contact support.");
      return;
    }
    if (!scriptReady || !window.Razorpay) {
      toast.error("Payment gateway is still loading. Please try again.");
      return;
    }
    if (amountInRupees <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }

    setLoading(true);
    try {
      const amountPaise = Math.round(amountInRupees * 100);
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: receipt ?? `reg_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error ?? "Failed to create order");
      }

      const options: Record<string, unknown> = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Shiksha Mahakumbh Abhiyan",
        description,
        order_id: orderData.order_id,
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.ok) {
              toast.error(verifyData.error ?? "Payment verification failed");
              return;
            }
            setVerified(true);
            toast.success("Payment successful!");
            onSuccess?.({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              verified: true,
            });
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: { color: "#1e3a5f" },
        modal: {
          ondismiss: () => {
            onDismiss?.();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        const msg =
          response.error?.description ?? "Payment failed. Please try again.";
        toast.error(msg);
      });
      rzp.open();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Payment failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [
    amountInRupees,
    customerEmail,
    customerName,
    customerPhone,
    description,
    keyId,
    onDismiss,
    onSuccess,
    receipt,
    scriptReady,
  ]);

  if (!keyId) {
    return (
      <p className="text-sm text-amber-700">
        Online payment is temporarily unavailable. Use manual transfer and upload
        receipt below.
      </p>
    );
  }

  return (
    <>
      <Script
        src={CHECKOUT_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => toast.error("Failed to load payment gateway")}
      />
      <button
        type="button"
        onClick={handlePay}
        disabled={disabled || loading || verified}
        className={
          className ??
          "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {verified
          ? "Payment verified ✓"
          : loading
            ? "Processing…"
            : `Pay ₹${amountInRupees.toLocaleString("en-IN")}`}
      </button>
    </>
  );
}
