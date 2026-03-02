import { cn } from "@/lib/utils";

export default function Badge({ children, tone = "default", className }) {
  const toneClass = {
    default: "bg-surface-elevated text-text",
    danger: "bg-error/10 text-error",
    success: "bg-success/10 text-success",
    warning: "bg-warning/20 text-secondary",
    accent: "bg-accent text-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]",
        toneClass[tone] || toneClass.default,
        className,
      )}
    >
      {children}
    </span>
  );
}
