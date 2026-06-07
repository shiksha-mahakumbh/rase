"use client";

import { useEffect, useState } from "react";

type VisitorCounts = {
  daily: number;
  total: number;
  displayTotal: number;
};

function CounterSkeleton() {
  return (
    <span
      className="inline-block h-6 w-12 animate-pulse rounded bg-gray-300"
      aria-hidden
    />
  );
}

export default function FooterVisitorCounter() {
  const [dailyVisitors, setDailyVisitors] = useState<number | null>(null);
  const [displayTotal, setDisplayTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      try {
        await fetch("/api/visitors", { method: "POST" });
        const res = await fetch("/api/visitors", { cache: "no-store" });
        if (!res.ok) throw new Error("visitor fetch failed");
        const data = (await res.json()) as VisitorCounts;
        if (cancelled) return;
        setDailyVisitors(data.daily);
        setDisplayTotal(data.displayTotal);
      } catch (error) {
        console.error("Footer visitor counter:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-4 flex items-center justify-around rounded-xl bg-gray-100 p-4 text-black">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Daily Visitors
        </p>
        <p className="text-xl font-extrabold text-primary">
          {loading ? <CounterSkeleton /> : dailyVisitors}
        </p>
      </div>
      <div className="h-10 w-px bg-gray-300" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Total Visitors
        </p>
        <p className="text-xl font-extrabold text-primary">
          {loading ? <CounterSkeleton /> : displayTotal}
        </p>
      </div>
    </div>
  );
}
