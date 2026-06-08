import { NextRequest } from "next/server";
import { handleVerifyPayment } from "@/lib/razorpay/handlers";

/** Alias for Standard Checkout docs — delegates to payments handler */
export async function POST(request: NextRequest) {
  return handleVerifyPayment(request);
}
