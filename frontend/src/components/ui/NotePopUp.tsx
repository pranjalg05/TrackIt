import { useUpdateEntryNote } from "@/hooks/useEntries";
import { X } from "lucide-react";
import { useState } from "react";

export default function NotePopUp({
  entryId,
  currentNote,
  onClose,
}: {
  entryId: number;
  currentNote: string | null;
  onClose: () => void;
}) {
  const [note, setNote] = useState(currentNote ?? "");
  const updateEntryNote = useUpdateEntryNote();

  const handleSave = () => {
    updateEntryNote.mutate(
      { entry_id: entryId, note: note.trim() === "" ? null : note.trim() },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-white/10 rounded-lg p-6 w-[24rem] text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {currentNote ? "Edit note" : "Add a note"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-white/40 cursor-pointer transition-colors hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          placeholder="Write your thoughts..."
          className="w-full bg-gray-800 border border-white/10 rounded-sm p-3 text-sm text-white outline-none placeholder:text-gray-400 resize-none focus:border-[color:var(--purple-500)]"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-sm uppercase tracking-widest text-white/60 border border-white/10 cursor-pointer transition-colors hover:text-white hover:border-white/40"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateEntryNote.isPending}
            className="px-4 py-2 rounded-sm text-sm font-semibold uppercase tracking-widest bg-[color:var(--purple-500)] text-white cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
