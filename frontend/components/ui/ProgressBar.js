export default function ProgressBar({ value = 0, label }) {
  return (
    <div className="w-full">
      {label ? <p className="mb-1 text-xs text-text-muted">{label}</p> : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
