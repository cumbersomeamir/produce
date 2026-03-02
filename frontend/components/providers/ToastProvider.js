"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/stores/uiStore";

export default function ToastProvider() {
  const toasts = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="pointer-events-auto rounded-xl border border-border bg-surface p-3 text-left shadow-elevated"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <p className="text-sm font-medium">{toast.title || "Notice"}</p>
            {toast.description ? <p className="text-xs text-text-muted">{toast.description}</p> : null}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
