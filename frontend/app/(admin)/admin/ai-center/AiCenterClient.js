"use client";

import { useState } from "react";

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export default function AiCenterClient({ initialAgents, initialLogs }) {
  const [agents, setAgents] = useState(initialAgents || []);
  const [logs, setLogs] = useState(initialLogs || []);
  const [running, setRunning] = useState(false);
  const [loadingId, setLoadingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function toggleAgent(agent) {
    setLoadingId(agent.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/ai/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          enabled: !agent.enabled,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Could not update agent state.");
      setAgents((current) => current.map((item) => (item.id === agent.id ? payload.data : item)));
      setMessage(`${agent.name} ${agent.enabled ? "paused" : "enabled"}.`);
    } catch (toggleError) {
      setError(toggleError.message || "Could not update agent state.");
    } finally {
      setLoadingId("");
    }
  }

  async function runHealthCheck() {
    setRunning(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Health Check Product",
          category: "operations",
          notes: "Validate AI endpoint and logging.",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "AI health check failed.");

      const refreshedLogs = await fetch("/api/admin/ai");
      const logsPayload = await refreshedLogs.json();
      setLogs(Array.isArray(logsPayload?.data) ? logsPayload.data : []);
      setMessage("AI health check completed and logs updated.");
    } catch (healthError) {
      setError(healthError.message || "AI health check failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl">AI Center</h1>
        <button onClick={runHealthCheck} disabled={running} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary disabled:opacity-60">
          {running ? "Running..." : "Run AI Health Check"}
        </button>
      </div>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">{agent.name}</p>
            <p className="mt-1 text-sm text-white/70">Mode: {agent.mode} · Runs today: {agent.runsToday}</p>
            <button
              type="button"
              disabled={loadingId === agent.id}
              onClick={() => toggleAgent(agent)}
              className="mt-3 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10 disabled:opacity-60"
            >
              {loadingId === agent.id ? "Updating..." : agent.enabled ? "Pause Agent" : "Enable Agent"}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">Recent AI Action Logs</p>
        {logs.length ? (
          <ul className="mt-2 space-y-2 text-xs text-white/75">
            {logs.slice(0, 8).map((log) => (
              <li key={log.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <p className="font-semibold uppercase tracking-wide text-white/60">{log.type}</p>
                <p className="mt-1">{String(log.response || "").slice(0, 180)}</p>
                <p className="mt-1 text-white/55">{formatTime(log.timestamp)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-white/60">No AI actions logged yet. Run health check to validate pipeline.</p>
        )}
      </div>
    </div>
  );
}
