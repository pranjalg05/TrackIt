import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { useSearchMovieByTitle } from "@/hooks/useMovies";
import MediaCard from "@/components/ui/MediaCard";

export default function MoviePage() {
  const [title, setTitle] = useState("");

  const { data, isLoading } = useSearchMovieByTitle(title);

  const handleSearch = (query: string) => {
    setTitle(query);
  };

  return (
    <div className="flex flex-col items-center h-full">
      <SearchBar placeholder="Search for a movie..." onSearch={handleSearch} />
      {isLoading ? (
        <p className="text-white mt-4">Loading...</p>
      ) : data && data.length > 0 ? (
        <div className="flex flex-wrap mt-4">
          {data.map((movie) => (
            <MediaCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              imageUrl={movie.poster_url}
              rating={movie.rating}
              releaseDate={movie.release_date}
              type="movie"
            />
          ))}
        </div>
      ) : (
        <p className="text-white mt-4">No movies found.</p>
      )}
    </div>
  );
}
