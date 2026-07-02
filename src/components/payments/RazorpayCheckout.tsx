"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  isRazorpayCheckoutReady,
  loadRazorpayCheckoutScript,
} from "@/lib/razorpay/load-checkout-script";

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
  /** Passed to Razorpay order notes for webhook / audit traceability */
  orderNotes?: Record<string, string>;
  disabled?: boolean;
  className?: string;
  onSuccess?: (result: RazorpayPaymentResult) => void;
  onDismiss?: () => void;
};

export default function RazorpayCheckout({
  amountInRupees,
  receipt,
  description = "Registration Fee",
  customerName,
  customerEmail,
  customerPhone,
  orderNotes,
  disabled = false,
  className,
  onSuccess,
  onDismiss,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [verified, setVerified] = useState(false);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  useEffect(() => {
    let cancelled = false;
    void loadRazorpayCheckoutScript()
      .then(() => {
        if (!cancelled) {
          setScriptReady(isRazorpayCheckoutReady());
          setScriptFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setScriptReady(false);
          setScriptFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePay = useCallback(async () => {
    if (!keyId) {
      toast.error("Payment gateway is not configured. Please contact support.");
      return;
    }

    try {
      if (!isRazorpayCheckoutReady()) {
        console.info("RAZORPAY_SCRIPT_LOAD_START", { phase: "pay_click" });
        await loadRazorpayCheckoutScript();
        setScriptReady(true);
        setScriptFailed(false);
      }
    } catch (err) {
      console.error("RAZORPAY_SCRIPT_LOAD_FAILED", {
        phase: "pay_click",
        error: err instanceof Error ? err.message : String(err),
      });
      toast.error("Payment gateway failed to load. Please refresh and try again.");
      setScriptFailed(true);
      return;
    }

    if (!window.Razorpay) {
      console.error("RAZORPAY_OPEN_FAILED", { reason: "window.Razorpay missing" });
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
      console.info("RAZORPAY_CREATE_ORDER_START", {
        amountPaise,
        receipt: receipt ?? null,
      });

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: receipt ?? `reg_${Date.now()}`,
          notes: orderNotes,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        console.error("RAZORPAY_CREATE_ORDER_FAILED", {
          status: orderRes.status,
          error: orderData.error ?? null,
        });
        throw new Error(orderData.error ?? "Failed to create order");
      }

      console.info("RAZORPAY_CREATE_ORDER_SUCCESS", {
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: orderData.currency,
      });

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
                amount_paise: amountPaise,
                metadata: orderNotes,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.ok) {
              console.error("PAYMENT_VERIFY_FAILED", {
                payment_id: response.razorpay_payment_id,
                error: verifyData.error ?? null,
              });
              toast.error(verifyData.error ?? "Payment verification failed");
              return;
            }
            console.info("PAYMENT_VERIFIED", {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
            });
            setVerified(true);
            toast.success("Payment successful!");
            onSuccess?.({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              verified: true,
            });
          } catch (err) {
            console.error("PAYMENT_VERIFY_FAILED", {
              error: err instanceof Error ? err.message : String(err),
            });
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
      console.info("RAZORPAY_OPEN", { order_id: orderData.order_id });
      rzp.open();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Payment failed";
      console.error("RAZORPAY_OPEN_FAILED", { error: msg });
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
    orderNotes,
    receipt,
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
    <div className="space-y-2">
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
            : scriptFailed
              ? `Retry payment · ₹${amountInRupees.toLocaleString("en-IN")}`
              : `Pay ₹${amountInRupees.toLocaleString("en-IN")}`}
      </button>
      {!scriptReady && !verified && !loading && (
        <p className="text-xs text-slate-600">
          {scriptFailed
            ? "Payment gateway could not load. Disable ad blockers, refresh, then tap Retry."
            : "Preparing secure checkout… you can tap Pay to open Razorpay."}
        </p>
      )}
    </div>
  );
}
