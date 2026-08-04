export default function SortDropDown({
  sort,
  order,
  onSortChange,
  onOrderChange,
}: {
  sort: string | null;
  order: string;
  onSortChange: (sort: string | null) => void;
  onOrderChange: (order: string) => void;
}) {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = event.target.value;
    onSortChange(selectedSort === "none" ? null : selectedSort);
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrder = event.target.value;
    onOrderChange(selectedOrder);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm uppercase tracking-widest text-white/60">
          Sort
        </label>
        <select
          id="sort"
          value={sort ?? "none"}
          onChange={handleSortChange}
          className="px-2 py-1 rounded-sm bg-transparent border border-white/10 text-white text-sm uppercase tracking-widest outline-none cursor-pointer [color-scheme:dark] focus:border-[color:var(--purple-500)]"
        >
          <option value="none" className="bg-gray-900">None</option>
          <option value="rating" className="bg-gray-900">Rating</option>
          <option value="release_date" className="bg-gray-900">Release Date</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="order" className="text-sm uppercase tracking-widest text-white/60">
          Order
        </label>
        <select
          id="order"
          value={order}
          onChange={handleOrderChange}
          className="px-2 py-1 rounded-sm bg-transparent border border-white/10 text-white text-sm uppercase tracking-widest outline-none cursor-pointer [color-scheme:dark] focus:border-[color:var(--purple-500)]"
        >
          <option value="asc" className="bg-gray-900">Ascending</option>
          <option value="desc" className="bg-gray-900">Descending</option>
        </select>
      </div>
    </div>
  );
}
