import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.path} className="flex items-center gap-2">
            <span>/</span>
            {item.current ? (
              <span className="text-text">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-primary">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
