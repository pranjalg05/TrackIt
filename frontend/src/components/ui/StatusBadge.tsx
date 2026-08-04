import { getStatusColor, getStatusLabel } from "@/libs/statusConfig";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = getStatusColor(status);

  return (
    <span
      className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full border ${color} ${className ?? ""}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
