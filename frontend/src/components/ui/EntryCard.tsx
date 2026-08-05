import { Link } from "react-router-dom";
import { useState } from "react";
import { Minus, Plus, Star, StickyNote } from "lucide-react";
import type { EntryItem } from "@/models/entries";
import StatusBadge from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";
import RatingPopUp from "./RatingPopUp";
import NotePopUp from "./NotePopUp";
import { useUpdateEntryCurrentEpisode } from "@/hooks/useEntries";

const TYPE_ROUTE_MAP: Record<string, string> = {
  game: "game",
  movie: "movie",
  tv_show: "tv-show",
  anime: "anime",
  manga: "manga",
};

interface EntryCardProps {
  entry: EntryItem;
  onStatusChange?: (status: string) => void;
  isUpdating?: boolean;
}

export default function EntryCard({ entry, onStatusChange, isUpdating }: EntryCardProps) {
  const [showRating, setShowRating] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const { mutate: updateEpisode, isPending: isUpdatingEpisode } = useUpdateEntryCurrentEpisode();
  const detailPath = `/${TYPE_ROUTE_MAP[entry.type] ?? entry.type}/${entry.external_id}`;

  const isAnime = entry.type === "anime";
  const currentEpisode = entry.current_episode ?? 0;
  const totalEpisodes = entry.total_episodes ?? 0;
  const showEpisodeTracker = isAnime && totalEpisodes > 0;

  const adjustEpisode = (delta: number) => {
    if (isUpdatingEpisode) return;
    const min = 0;
    const max = totalEpisodes > 0 ? totalEpisodes : currentEpisode + 1;
    const next = Math.min(max, Math.max(min, currentEpisode + delta));
    if (next === currentEpisode) return;
    updateEpisode({ entry_id: entry.id, current_episode: next });
  };

  return (
    <div className="flex items-center gap-4 p-3 border border-white/10 rounded-sm bg-white/[0.02] transition-colors hover:border-[color:var(--purple-500)] group">
      <Link to={detailPath} className="shrink-0">
        <img
          src={entry.image_url}
          alt={entry.title}
          className="w-16 h-20 object-cover rounded-sm border border-white/10"
        />
      </Link>

      <Link to={detailPath} className="flex-1 min-w-0">
        <h2 className="font-semibold truncate group-hover:[color:var(--purple-500)]">{entry.title}</h2>
        <p className="text-sm uppercase tracking-widest text-white/40">{entry.type.replace("_", " ")}</p>
        {entry.notes && (
          <p className="flex items-center gap-1.5 text-xs text-white/50 truncate mt-1">
            <StickyNote className="w-3 h-3 shrink-0" />
            {entry.notes}
          </p>
        )}
      </Link>

      <div className="flex items-center gap-4">
        {showEpisodeTracker && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => adjustEpisode(-1)}
              disabled={isUpdatingEpisode || currentEpisode <= 0}
              className="flex items-center justify-center w-7 h-7 rounded-sm border border-white/10 text-white/60 cursor-pointer transition-colors hover:border-[color:var(--purple-500)] hover:[color:var(--purple-500)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm whitespace-nowrap" title="Episodes watched">
              <span className="[color:var(--purple-500)] font-semibold">{currentEpisode}</span>
              <span className="text-white/40">/{totalEpisodes}</span>
            </span>
            <button
              onClick={() => adjustEpisode(1)}
              disabled={isUpdatingEpisode || currentEpisode >= totalEpisodes}
              className="flex items-center justify-center w-7 h-7 rounded-sm border border-white/10 text-white/60 cursor-pointer transition-colors hover:border-[color:var(--purple-500)] hover:[color:var(--purple-500)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {onStatusChange && (
          <StatusDropdown
            mediaType={entry.type}
            value={entry.status}
            onChange={onStatusChange}
            disabled={isUpdating}
          />
        )}
        <button
          onClick={() => setShowNote(true)}
          title={entry.notes ? "Edit note" : "Add a note"}
          className={`flex items-center justify-center w-7 h-7 rounded-sm border cursor-pointer transition-colors ${
            entry.notes
              ? "border-white/30 text-white hover:border-[color:var(--purple-500)] hover:[color:var(--purple-500)]"
              : "border-white/10 text-white/40 hover:text-white hover:border-white/40"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowRating(true)}
          title={entry.rating != null ? `Rating: ${entry.rating.toFixed(1)}` : "Rate this entry"}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border text-sm cursor-pointer transition-colors ${
            entry.rating != null
              ? "border-[color:color-mix(in_srgb,var(--purple-500)_40%,transparent)] [color:var(--purple-500)] hover:border-[color:var(--purple-500)]"
              : "border-white/10 text-white/40 hover:text-white hover:border-white/40"
          }`}
        >
          <Star className="w-3.5 h-3.5" fill="currentColor" />
          {entry.rating != null ? entry.rating.toFixed(1) : "Rate"}
        </button>
        <StatusBadge status={entry.status} />
      </div>

      {showRating && (
        <RatingPopUp
          entryId={entry.id}
          currentRating={entry.rating ?? 0}
          onClose={() => setShowRating(false)}
        />
      )}
      {showNote && (
        <NotePopUp
          entryId={entry.id}
          currentNote={entry.notes}
          onClose={() => setShowNote(false)}
        />
      )}
    </div>
  );
}
