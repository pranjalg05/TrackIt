import { useUpdateEntryRating } from "@/hooks/useEntries";
import { X } from "lucide-react";
import { useState } from "react";

const RATING_BANDS: { at: number; color: string }[] = [
  { at: 0, color: "#f87171" }, // red-400
  { at: 2.5, color: "#fb923c" }, // orange-400
  { at: 5, color: "#facc15" }, // yellow-400
  { at: 7.5, color: "#4ade80" }, // green-400
  { at: 10, color: "#ad46ff" }, // matches --purple-500
];

const RATING_LABELS: { at: number; label: string; color: string }[] = [
  { at: 0, label: "Dislike", color: "text-red-400" },
  { at: 2.5, label: "Bad", color: "text-orange-400" },
  { at: 5, label: "Meh", color: "text-yellow-400" },
  { at: 7.5, label: "Liked It", color: "text-green-400" },
  { at: 10, label: "Loved It", color: "[color:var(--purple-500)]" },
];

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const bandColorAt = (value: number): string => {
  for (let i = 0; i < RATING_BANDS.length - 1; i++) {
    const a = RATING_BANDS[i];
    const b = RATING_BANDS[i + 1];
    if (value >= a.at && value <= b.at) {
      if (value === b.at && i + 1 === RATING_BANDS.length - 1) return b.color;
      const t = (value - a.at) / (b.at - a.at);
      const [ar, ag, ab] = hexToRgb(a.color);
      const [br, bg, bb] = hexToRgb(b.color);
      const r = Math.round(ar + (br - ar) * t);
      const g = Math.round(ag + (bg - ag) * t);
      const bl = Math.round(ab + (bb - ab) * t);
      return `rgb(${r}, ${g}, ${bl})`;
    }
  }
  return RATING_BANDS[RATING_BANDS.length - 1].color;
};

const ratingLabelAt = (value: number): { label: string; color: string } => {
  let closest = RATING_LABELS[0];
  for (const item of RATING_LABELS) {
    closest = item;
    if (value <= item.at) break;
  }
  return closest;
};

const SLIDER_CSS = `
  input[data-rating-slider] {
    -webkit-appearance: none;
    appearance: none;
  }
  input[data-rating-slider]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: #ffffff;
    border: 3px solid #ad46ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
  input[data-rating-slider]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: #ffffff;
    border: 3px solid #ad46ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
  input[data-rating-slider]::-moz-range-track {
    background: transparent;
  }
`;

export default function RatingPopUp({
  entryId,
  currentRating,
  onClose,
}: {
  entryId: number;
  currentRating: number;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(currentRating);
  const updateEntryRating = useUpdateEntryRating();

  const commitRating = (value: number) => {
    const rounded = Math.round(value * 10) / 10;
    updateEntryRating.mutate({ entry_id: entryId, rating: rounded });
  };

  const handleClose = () => {
    if (rating !== currentRating) {
      commitRating(rating);
    }
    onClose();
  };

  const percent = (rating / 10) * 100;
  const color = bandColorAt(rating);
  const label = ratingLabelAt(rating);
  const trackGradient = `linear-gradient(90deg, #f87171 0%, #fb923c 25%, #facc15 50%, #4ade80 75%, ${color} ${percent}%, rgba(255, 255, 255, 0.12) ${percent}%)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <style>{SLIDER_CSS}</style>

      <div className="bg-gray-900 border border-white/10 rounded-lg p-6 w-[24rem] text-white shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold tracking-tight">Rate this entry</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-sm text-white/40 cursor-pointer transition-colors hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
          Move the slider to set your rating
        </p>

        <div className="mb-5 flex flex-col items-center gap-1">
          <span
            className="text-5xl font-bold tabular-nums transition-colors"
            style={{ color }}
          >
            {rating.toFixed(1)}
          </span>
          <span
            className="text-sm uppercase tracking-widest transition-colors"
            style={{ color }}
          >
            {label.label}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={rating}
          data-rating-slider
          onChange={(e) => setRating(Number(e.target.value))}
          onPointerUp={(e) => commitRating(Number((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              commitRating(Number((e.currentTarget as HTMLInputElement).value));
            }
          }}
          className="w-full h-2 rounded-full outline-none cursor-pointer"
          style={{ background: trackGradient }}
        />

        <div className="flex justify-between mt-2">
          {RATING_LABELS.map((item) => (
            <span
              key={item.label}
              className={`text-[10px] uppercase tracking-wider ${item.color}`}
            >
              {item.label}
            </span>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="mt-6 w-full px-6 py-2 rounded-sm text-sm font-semibold uppercase tracking-widest bg-[color:var(--purple-500)] text-white cursor-pointer transition-opacity hover:opacity-80"
        >
          Done
        </button>
      </div>
    </div>
  );
}
