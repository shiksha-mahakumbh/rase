import { NextRequest } from "next/server";
import { handleCreateOrder } from "@/lib/razorpay/handlers";

export async function POST(request: NextRequest) {
  return handleCreateOrder(request);
}
