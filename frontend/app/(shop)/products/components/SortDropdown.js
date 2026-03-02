"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price Low-High" },
  { value: "price-desc", label: "Price High-Low" },
  { value: "newest", label: "Newest" },
  { value: "reviewed", label: "Most Reviewed" },
];

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "popular";

  const onChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      Sort
      <select
        className="rounded-lg border border-border bg-surface px-3 py-2"
        value={current}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
