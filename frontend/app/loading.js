import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-main py-10">
      <Skeleton className="mb-4 h-10 w-72" />
      <Skeleton className="mb-3 h-5 w-full" />
      <Skeleton className="mb-3 h-5 w-4/5" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="h-72 w-full" />
        ))}
      </div>
    </div>
  );
}
