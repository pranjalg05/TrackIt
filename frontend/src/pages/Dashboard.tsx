import { useMemo, useState } from "react";
import { useUserEntries, useUpdateEntryStatus } from "@/hooks/useEntries";
import EntryCard from "@/components/ui/EntryCard";
import { ScaleLoader } from "react-spinners";
import { STATUS_GROUPS } from "@/libs/statusConfig";

const RATING_OPTIONS = Array.from({ length: 11 }, (_, i) => i);

const DROPDOWN_CLASS =
    "px-2 py-1 rounded-sm bg-transparent border border-white/10 text-white text-sm uppercase tracking-widest outline-none cursor-pointer [color-scheme:dark] focus:border-[color:var(--purple-500)]";

export default function DashBoard() {

    const [sort, setSort] = useState<string>("updated_at");
    const [order, setOrder] = useState<string>("desc");
    const [minRating, setMinRating] = useState<number>(0);
    const [maxRating, setMaxRating] = useState<number>(10);

    const { data: entries, isLoading } = useUserEntries({ sort, order, minRating, maxRating });
    const { mutate: updateStatus, isPending } = useUpdateEntryStatus();
    const [changingId, setChangingId] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>("All");

    const handleMinRatingChange = (value: number) => {
        setMinRating(value);
        if (value > maxRating) setMaxRating(value);
    };

    const handleMaxRatingChange = (value: number) => {
        setMaxRating(value);
        if (value < minRating) setMinRating(value);
    };

    const handleStatusChange = (entryId: number, status: string) => {
        setChangingId(entryId);
        updateStatus(
            { entry_id: entryId, status },
            { onSettled: () => setChangingId(null) },
        );
    };

    const filteredEntries = useMemo(() => {
        if (!entries) return [];
        const group = STATUS_GROUPS.find((g) => g.label === filter);
        if (!group || group.statuses.length === 0) return entries;
        return entries.filter((entry) => group.statuses.includes(entry.status));
    }, [entries, filter]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-full">
                <ScaleLoader color="var(--purple-500)" />
                <p className="[color:var(--purple-500)] text-2xl ml-2 pt-4">Loading your library...</p>
            </div>
        );
    }

    if (!entries || entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
                <p className="text-white/60">Your library is empty. Start adding media to track it.</p>
            </div>
        );
    }

    return (
        <div className="text-white p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-6">My Library</h1>

            <div className="flex flex-wrap gap-2 mb-6">
                {STATUS_GROUPS.map((group) => (
                    <button
                        key={group.label}
                        onClick={() => setFilter(group.label)}
                        className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full border transition-colors cursor-pointer ${
                            filter === group.label
                                ? "bg-[color:var(--purple-500)] border-[color:var(--purple-500)] text-white"
                                : "text-white/60 border-white/15 hover:text-white hover:border-white/40"
                        }`}
                    >
                        {group.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={DROPDOWN_CLASS}
                >
                    <option value="updated_at" className="bg-gray-900">Recently Updated</option>
                    <option value="rating" className="bg-gray-900">Rating</option>
                </select>
                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className={DROPDOWN_CLASS}
                >
                    <option value="desc" className="bg-gray-900">Descending</option>
                    <option value="asc" className="bg-gray-900">Ascending</option>
                </select>

                <div className="flex items-center gap-2">
                    <label className="text-xs uppercase tracking-widest text-white/60">Min</label>
                    <select
                        value={minRating}
                        onChange={(e) => handleMinRatingChange(Number(e.target.value))}
                        className={DROPDOWN_CLASS}
                    >
                        {RATING_OPTIONS.map((r) => (
                            <option key={r} value={r} className="bg-gray-900">≥ {r}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs uppercase tracking-widest text-white/60">Max</label>
                    <select
                        value={maxRating}
                        onChange={(e) => handleMaxRatingChange(Number(e.target.value))}
                        className={DROPDOWN_CLASS}
                    >
                        {RATING_OPTIONS.map((r) => (
                            <option key={r} value={r} className="bg-gray-900">≤ {r}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredEntries.map((entry) => (
                    <EntryCard
                        key={entry.id}
                        entry={entry}
                        isUpdating={isPending && changingId === entry.id}
                        onStatusChange={(status) => handleStatusChange(entry.id, status)}
                    />
                ))}
                {filteredEntries.length === 0 && (
                    <p className="text-white/50 text-sm">No entries match this filter.</p>
                )}
            </div>
        </div>
    );

}
