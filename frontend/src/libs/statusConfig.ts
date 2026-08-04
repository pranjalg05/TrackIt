export type MediaType = "movie" | "tv_show" | "game" | "manga" | "anime";

export const STATUS_BY_TYPE: Record<MediaType, string[]> = {
  game: ["planning", "playing", "completed", "on_hold", "dropped"],
  movie: ["plan_to_watch", "watching", "completed", "on_hold", "dropped"],
  tv_show: ["planning", "watching", "completed", "on_hold", "dropped"],
  anime: ["planning", "watching", "completed", "on_hold", "dropped"],
  manga: ["plan_to_read", "reading", "completed", "on_hold", "dropped"],
};

export const STATUS_LABELS: Record<string, string> = {
  planning: "Planning",
  plan_to_watch: "Plan to Watch",
  plan_to_read: "Plan to Read",
  watching: "Watching",
  reading: "Reading",
  playing: "Playing",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
};

export const STATUS_COLORS: Record<string, string> = {
  planning: "text-sky-400 border-sky-400/40",
  plan_to_watch: "text-sky-400 border-sky-400/40",
  plan_to_read: "text-sky-400 border-sky-400/40",
  watching: "text-yellow-400 border-yellow-400/40",
  reading: "text-yellow-400 border-yellow-400/40",
  playing: "text-green-400 border-green-400/40",
  completed: "text-purple-400 border-purple-400/40",
  on_hold: "text-orange-400 border-orange-400/40",
  dropped: "text-red-400 border-red-400/40",
};

export const getStatusLabel = (status: string): string =>
  STATUS_LABELS[status] ?? status.replace("_", " ");

export const getStatusColor = (status: string): string =>
  STATUS_COLORS[status] ?? "text-white/60 border-white/20";

export interface StatusGroup {
  label: string;
  statuses: string[];
}

export const STATUS_GROUPS: StatusGroup[] = [
  { label: "All", statuses: [] },
  {
    label: "Planning",
    statuses: ["planning", "plan_to_watch", "plan_to_read"],
  },
  {
    label: "In Progress",
    statuses: ["watching", "reading", "playing"],
  },
  { label: "Completed", statuses: ["completed"] },
  { label: "On Hold", statuses: ["on_hold"] },
  { label: "Dropped", statuses: ["dropped"] },
];

export const getStatusesForType = (type: string | undefined): string[] => {
  if (!type) return STATUS_BY_TYPE.game;
  return STATUS_BY_TYPE[type as MediaType] ?? STATUS_BY_TYPE.game;
};
