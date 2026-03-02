"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PROCUREMENT_STORAGE_KEY,
  createInitialProcurementWorkspace,
  mergeProcurementWorkspace,
} from "@/lib/procurement-workflow";

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function loadStoredWorkspace() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROCUREMENT_STORAGE_KEY);
  if (!raw) return null;
  return safeParse(raw);
}

function persistWorkspace(workspace) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROCUREMENT_STORAGE_KEY, JSON.stringify(workspace));
}

export function useProcurementWorkspace() {
  const [workspace, setWorkspace] = useState(() => createInitialProcurementWorkspace());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStoredWorkspace();
    const merged = mergeProcurementWorkspace(stored);
    setWorkspace(merged);
    persistWorkspace(merged);
    setHydrated(true);
  }, []);

  const updateWorkspace = useCallback((updater) => {
    setWorkspace((previous) => {
      const nextRaw = typeof updater === "function" ? updater(previous) : updater;
      const next = {
        ...nextRaw,
        updatedAt: new Date().toISOString(),
      };
      persistWorkspace(next);
      return next;
    });
  }, []);

  const resetWorkspace = useCallback(() => {
    const fresh = createInitialProcurementWorkspace();
    setWorkspace(fresh);
    persistWorkspace(fresh);
  }, []);

  return {
    workspace,
    hydrated,
    updateWorkspace,
    resetWorkspace,
  };
}

