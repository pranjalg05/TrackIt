import { getStatusLabel, getStatusesForType } from "@/libs/statusConfig";

interface StatusDropdownProps {
  mediaType?: string;
  value: string;
  onChange: (status: string) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export default function StatusDropdown({
  mediaType,
  value,
  onChange,
  disabled,
  className,
  title,
}: StatusDropdownProps) {
  const statuses = getStatusesForType(mediaType);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      title={title}
      className={
        className ??
        "px-2 py-1 rounded-sm bg-transparent border border-white/10 text-white text-sm uppercase tracking-widest outline-none cursor-pointer [color-scheme:dark] focus:border-[color:var(--purple-500)] disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-gray-900">
          {getStatusLabel(s)}
        </option>
      ))}
    </select>
  );
}
