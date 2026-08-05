import SearchBar from "@/components/ui/SearchBar";
import { useSearchAnimeByTitle } from "@/hooks/useAnime";
import AnimeCard from "@/components/media/AnimeCard";
import { ScaleLoader } from "react-spinners";
import SortDropDown from "@/components/ui/SortDropDown";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationFooter from "@/components/ui/PaginationFooter";

export default function AnimePage() {
  const PAGE_SIZE = 12;
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get("title") ?? "";
  const [sort, setSort] = useState<string | null>("popularity");
  const [order, setOrder] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const { data: anime, isLoading } = useSearchAnimeByTitle(title, page);

  const sortedAnime = useMemo(() => {
    const sorted = [...(anime || [])];

    if (sort === "rating") {
      sorted.sort((a, b) =>
        order === "asc"
          ? (a.rating ?? 0) - (b.rating ?? 0)
          : (b.rating ?? 0) - (a.rating ?? 0),
      );
    } else if (sort === "release_date") {
      sorted.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (sort === "popularity") {
      sorted.sort((a, b) =>
        order === "asc"
          ? (a.popularity ?? 0) - (b.popularity ?? 0)
          : (b.popularity ?? 0) - (a.popularity ?? 0),
      );
    }

    return sorted;
  }, [anime, sort, order]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchParams({ title: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex flex-col items-center h-full p-4">
      <SearchBar
        placeholder="Search for an anime..."
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
            { value: "popularity", label: "Popularity" },
          ]}
          onSortChange={setSort}
          onOrderChange={setOrder}
        />
      </div>
      {!title ? (
        <p className="text-white mt-4">
          Please enter an anime title to search.
        </p>
      ) : isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ScaleLoader color="var(--purple-500)" />
          <p className="text-purple-500 ml-2 text-2xl">Loading anime...</p>
        </div>
      ) : sortedAnime && sortedAnime.length > 0 ? (
        <div className="flex flex-wrap mt-4">
          {sortedAnime.map((item) => (
            <AnimeCard
              key={item.id}
              id={item.id}
              romajiTitle={item.romaji_title}
              englishTitle={item.english_title}
              imageUrl={item.cover_url}
              rating={item.rating}
              releaseDate={item.release_date}
            />
          ))}
          {(page > 1 || (anime?.length ?? 0) >= PAGE_SIZE) && (
            <PaginationFooter
              page={page}
              onPageChange={setPage}
              totalPages={undefined}
              hasMore={(anime?.length ?? 0) >= PAGE_SIZE}
            />
          )}
        </div>
      ) : (
        <p className="text-white mt-4">
          No anime found. Try searching for something else
        </p>
      )}
    </div>
  );
}
