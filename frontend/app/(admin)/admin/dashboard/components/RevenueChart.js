"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function RevenueChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#8d90b5" />
          <YAxis stroke="#8d90b5" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
