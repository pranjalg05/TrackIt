import SearchBar from "@/components/ui/SearchBar";
import PaginationFooter from "@/components/ui/PaginationFooter";
import { useSearchGameByTitle } from "@/hooks/useGames";
import GameCard from "@/components/media/GameCard";
import { ScaleLoader } from "react-spinners";
import SortDropDown from "@/components/ui/SortDropDown";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function GamePage() {
  const PAGE_SIZE = 18;
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get("title") ?? "";
  const [sort, setSort] = useState<string | null>(null);
  const [order, setOrder] = useState<string>("desc");
  const { data: games, isLoading } = useSearchGameByTitle(title);
  const [page, setPage] = useState(1);

  const sortedGames = useMemo(() => {
    const sorted = [...(games || [])];

    if (sort === "rating") {
      sorted.sort((a, b) =>
        order === "asc"
          ? (a.rating ?? 0) - (b.rating ?? 0)
          : (b.rating ?? 0) - (a.rating ?? 0),
      );
    } else if (sort === "release_date") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return sorted.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);
  }, [games, page, sort, order]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchParams({ title: query });
    } else {
      setSearchParams({});
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col items-center h-full p-4">
      <SearchBar
        placeholder="Search for a game..."
        defaultValue={title}
        onSearch={handleSearch}
      />
      <div className="mt-4">
        <SortDropDown
          sort={sort}
          order={order}
          options={[
            { value: "rating", label: "Rating" },
            { value: "release_date", label: "Release Date" },
          ]}
          onSortChange={setSort}
          onOrderChange={setOrder}
        />
      </div>
      {!title ? (
        <p className="text-white mt-4">Please enter a game title to search.</p>
      ) : isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ScaleLoader color="var(--purple-500)" />
          <p className="text-purple-500 ml-2 text-2xl">Loading games...</p>
        </div>
      ) : sortedGames && sortedGames.length > 0 ? (
        <>
          <div className="flex flex-wrap mt-4">
            {sortedGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                imageUrl={game.cover_url}
                rating={game.rating}
                releaseDate={game.release_date}
              />
            ))}
          </div>
          {games && games.length > PAGE_SIZE && (
            <PaginationFooter
              page={page}
              totalPages={Math.ceil((games.length || 0) / PAGE_SIZE)}
              hasMore={games.length > PAGE_SIZE * page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <p className="text-white mt-4">
          No games found. Try searching for something else{" "}
        </p>
      )}
    </div>
  );
}
