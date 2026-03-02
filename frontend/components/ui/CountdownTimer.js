"use client";

import { useCountdown } from "@/hooks/useCountdown";

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function CountdownTimer({ targetDate, className = "" }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className={`inline-flex items-center gap-2 font-mono text-sm ${className}`}>
      <span>{pad(days)}d</span>
      <span>{pad(hours)}h</span>
      <span>{pad(minutes)}m</span>
      <span>{pad(seconds)}s</span>
    </div>
  );
}
