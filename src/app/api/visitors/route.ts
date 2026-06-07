import { NextResponse } from "next/server";
import {
  getVisitorCounts,
  incrementVisitorCounts,
} from "@/lib/firestore/visitors.server";

export async function GET() {
  try {
    const counts = await getVisitorCounts();
    return NextResponse.json(counts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[api/visitors] GET", error);
    return NextResponse.json(
      { daily: 0, total: 0, displayTotal: 94567 },
      {
        status: 200,
        headers: { "X-Visitor-Fallback": "true" },
      }
    );
  }
}

export async function POST() {
  try {
    await incrementVisitorCounts();
    const counts = await getVisitorCounts();
    return NextResponse.json(counts);
  } catch (error) {
    console.error("[api/visitors] POST", error);
    return NextResponse.json(
      { daily: 0, total: 0, displayTotal: 94567 },
      { headers: { "X-Visitor-Fallback": "true" } }
    );
  }
}
