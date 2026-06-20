"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RegistrationRow } from "@/lib/exportRegistrations";
import { formatRegistrationDate } from "@/lib/format-date";

const COLORS = [
  "#502A2A",
  "#7a4343",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
];

interface AnalyticsChartsProps {
  registrations: RegistrationRow[];
}

export default function AnalyticsCharts({
  registrations,
}: AnalyticsChartsProps) {
  const typeMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  let paid = 0;
  let pending = 0;

  registrations.forEach((r) => {
    const type = r.registrationType ?? "Unknown";
    typeMap.set(type, (typeMap.get(type) ?? 0) + 1);

    const day = formatRegistrationDate(r.createdAt).split(",")[0];
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);

    const country = String(r.country ?? "Unknown");
    countryMap.set(country, (countryMap.get(country) ?? 0) + 1);

    if (r.paymentStatus === "Paid") paid++;
    else pending++;
  });

  const typeData = Array.from(typeMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));
  const dailyData = Array.from(dailyMap.entries())
    .slice(-14)
    .map(([name, count]) => ({ name, count }));
  const countryData = Array.from(countryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const paymentData = [
    { name: "Paid", value: paid },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Registration Type Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={typeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {typeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Daily Registrations">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dailyData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#502A2A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Country-wise Registrations">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={countryData} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Payment Collection Summary">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={paymentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              <Cell fill="#10B981" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}
