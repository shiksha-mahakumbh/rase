import Razorpay from "razorpay";
import { getRazorpayKeyId, getRazorpayKeySecret } from "@/lib/razorpay/config";

let instance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }
  if (!instance) {
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return instance;
}
