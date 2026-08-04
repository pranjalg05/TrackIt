import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEntryByExternal, useUpdateEntryStatus } from "@/hooks/useEntries";
import { getStatusesForType } from "@/libs/statusConfig";
import StatusBadge from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";

interface MediaLibraryControlsProps {
  mediaType: string;
  source: string;
  externalId: string;
  onAdd: (status: string) => Promise<unknown>;
  isAdding?: boolean;
}

export default function MediaLibraryControls({
  mediaType,
  source,
  externalId,
  onAdd,
  isAdding,
}: MediaLibraryControlsProps) {
  const queryClient = useQueryClient();
  const { data: entry, isLoading } = useEntryByExternal(source, externalId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateEntryStatus();
  const [selected, setSelected] = useState(
    () => getStatusesForType(mediaType)[0] ?? "planning",
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["entryByExternal", source, externalId] });
    queryClient.invalidateQueries({ queryKey: ["userEntries"] });
  };

  const handleAdd = () => {
    onAdd(selected).then(invalidate).catch(() => {});
  };

  if (isLoading) {
    return (
      <div className="mt-2 h-9 w-44 bg-white/5 border border-white/10 rounded-sm animate-pulse" />
    );
  }

  if (entry) {
    return (
      <div className="flex items-center gap-4 mt-2">
        <StatusDropdown
          mediaType={mediaType}
          value={entry.status}
          onChange={(status) =>
            updateStatus(
              { entry_id: entry.id, status },
              { onSuccess: invalidate },
            )
          }
          disabled={isUpdating}
        />
        <StatusBadge status={entry.status} />
        <span className="text-xs uppercase tracking-widest text-green-400/80">
          In Library
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mt-2">
      <StatusDropdown
        mediaType={mediaType}
        value={selected}
        onChange={setSelected}
        disabled={isAdding}
      />
      <button
        onClick={handleAdd}
        disabled={isAdding}
        className="px-6 py-2 rounded-sm text-sm font-semibold uppercase tracking-widest bg-[color:var(--purple-500)] text-white cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? "Adding..." : "Add to Library"}
      </button>
    </div>
  );
}
