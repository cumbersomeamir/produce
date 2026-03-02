"use client";

import { useState } from "react";

function formatTime(value) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export default function EmailsClient({ initialAutomations }) {
  const [automations, setAutomations] = useState(initialAutomations || []);
  const [loadingId, setLoadingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function toggleAutomation(automation) {
    setLoadingId(automation.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId: automation.id,
          enabled: !automation.enabled,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Could not update automation.");

      setAutomations((current) =>
        current.map((item) => (item.id === automation.id ? payload.data : item)),
      );
      setMessage(`${automation.name} ${automation.enabled ? "paused" : "enabled"}.`);
    } catch (toggleError) {
      setError(toggleError.message || "Could not update automation.");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Email Center</h1>
      <p className="text-sm text-white/70">Manage transactional automation rules and operational email sequences.</p>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-3 py-2">Automation</th>
              <th className="px-3 py-2">Trigger</th>
              <th className="px-3 py-2">Sent Today</th>
              <th className="px-3 py-2">Last Run</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {automations.map((automation) => (
              <tr key={automation.id} className="border-t border-white/10">
                <td className="px-3 py-2">
                  <p className="font-semibold">{automation.name}</p>
                  <p className="text-xs text-white/65">{automation.enabled ? "Enabled" : "Paused"}</p>
                </td>
                <td className="px-3 py-2">{automation.trigger}</td>
                <td className="px-3 py-2">{automation.sentToday}</td>
                <td className="px-3 py-2 text-xs">{formatTime(automation.lastRunAt)}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleAutomation(automation)}
                    disabled={loadingId === automation.id}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10 disabled:opacity-60"
                  >
                    {loadingId === automation.id ? "Updating..." : automation.enabled ? "Pause" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
