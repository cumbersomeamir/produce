import { availabilityBadgeClass, availabilityLabel } from "@/lib/procurement-workflow";

export default function AvailabilityBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${availabilityBadgeClass(status)}`}>
      {availabilityLabel(status)}
    </span>
  );
}

