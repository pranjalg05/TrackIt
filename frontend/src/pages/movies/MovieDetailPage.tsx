import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { useAddMovieToLibrary, useGetMovieById } from "../../hooks/useMovies";
import MediaLibraryControls from "@/components/ui/MediaLibraryControls";

export default function MovieDetailPage() {

    const { id } = useParams<{ id: string }>();

    const movieId = id ? parseInt(id) : null;

    const { data: movie, isLoading } = useGetMovieById(movieId!);

    const { mutateAsync: addToLibrary, isPending: isAdding } = useAddMovieToLibrary();

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-full">
                <BarLoader color="var(--purple-500)" />
                <p className="[color:var(--purple-500)] text-2xl ml-4 pt-4">Loading movie details...</p>
            </div>
        );
    }

    if (!movie) {
        return <p className="text-white">Movie not found.</p>;
    }

    const year = movie.release_date ? movie.release_date.split("-")[0] : "";

    return (
        <div className="text-white p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="shrink-0">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-64 rounded-sm shadow-lg border border-white/10"
                    />
                </div>

                <div className="flex flex-col justify-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{movie.title}</h1>
                        <p className="mt-2 text-white/60 text-sm uppercase tracking-widest">
                            {year}
                            {movie.runtime ? (
                                <>
                                    <span className="mx-2 [color:var(--purple-500)]">•</span>
                                    {movie.runtime} min
                                </>
                            ) : null}
                            {(movie.rating ?? 0) > 0 && (
                                <>
                                    <span className="mx-2 [color:var(--purple-500)]">•</span>
                                    Rating:{" "}
                                    <span className="[color:var(--purple-500)]">
                                        {movie.rating?.toFixed(2)}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 text-xs uppercase tracking-widest [color:var(--purple-500)] border [border-color:color-mix(in_srgb,var(--purple-500)_40%,transparent)] rounded-full"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    <MediaLibraryControls
                        mediaType="movie"
                        source="tmdb"
                        externalId={String(movieId)}
                        isAdding={isAdding}
                        onAdd={(status) => addToLibrary({ movie_id: movieId!, status })}
                    />
                </div>
            </div>

            {movie.overview && (
                <div className="mt-12 grid gap-10">
                    <section>
                        <h2 className="text-xs uppercase tracking-widest [color:var(--purple-500)] mb-3 border-b border-white/10 pb-2">
                            Overview
                        </h2>
                        <p className="text-white/80 leading-relaxed max-w-3xl">{movie.overview}</p>
                    </section>
                </div>
            )}
        </div>
    );
}
