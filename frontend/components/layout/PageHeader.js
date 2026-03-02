export default function PageHeader({ title, description, action }) {
  return (
    <header className="mb-8">
      <h1 className="font-heading text-3xl text-secondary">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-text-muted">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </header>
  );
}
