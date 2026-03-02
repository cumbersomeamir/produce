export default function Skeleton({ className = "h-4 w-full" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[linear-gradient(90deg,#f2ece5_25%,#f8f4f0_50%,#f2ece5_75%)] bg-[length:200%_100%] ${className}`}
      aria-hidden="true"
    />
  );
}
