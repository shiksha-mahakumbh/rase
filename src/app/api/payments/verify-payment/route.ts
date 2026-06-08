import { NextRequest } from "next/server";
import { handleVerifyPayment } from "@/lib/razorpay/handlers";

export async function POST(request: NextRequest) {
  return handleVerifyPayment(request);
}
