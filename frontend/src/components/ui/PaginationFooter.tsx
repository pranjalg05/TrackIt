import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationFooterProps {
  page: number;
  totalPages?: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationFooter({
  page,
  totalPages,
  hasMore,
  onPageChange,
}: PaginationFooterProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-6 w-full">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-4 py-2 text-sm uppercase tracking-widest text-white border border-white/10 rounded-sm cursor-pointer transition-colors hover:[color:var(--purple-500)] hover:border-[color:var(--purple-500)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:[color:inherit] disabled:hover:border-white/10"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <span className="text-sm tracking-widest text-white/60">
        Page <span className="[color:var(--purple-500)]">{page}</span> 
        {totalPages ? <> of <span className="[color:var(--purple-500)]">{totalPages}</span></> : ""}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore}
        className="flex items-center gap-1 px-4 py-2 text-sm uppercase tracking-widest text-white border border-white/10 rounded-sm cursor-pointer transition-colors hover:[color:var(--purple-500)] hover:border-[color:var(--purple-500)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:[color:inherit] disabled:hover:border-white/10"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
