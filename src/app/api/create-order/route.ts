import { NextRequest } from "next/server";
import { handleCreateOrder } from "@/lib/razorpay/handlers";

/** Alias for Standard Checkout docs — delegates to payments handler */
export async function POST(request: NextRequest) {
  return handleCreateOrder(request);
}
