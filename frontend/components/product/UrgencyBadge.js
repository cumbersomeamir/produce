import { Eye, Flame, Timer } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function UrgencyBadge({ type, value }) {
  if (type === "low-stock") {
    return (
      <Badge tone="danger" className="gap-1">
        <Flame size={12} /> Only {value} left
      </Badge>
    );
  }

  if (type === "viewers") {
    return (
      <Badge tone="warning" className="gap-1">
        <Eye size={12} /> {value} viewing now
      </Badge>
    );
  }

  if (type === "timer") {
    return (
      <Badge tone="accent" className="gap-1">
        <Timer size={12} /> Deal ending soon
      </Badge>
    );
  }

  return null;
}
