export default function Toast({ title, description }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-elevated">
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="text-xs text-text-muted">{description}</p> : null}
    </div>
  );
}
