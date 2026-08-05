import { useAddAnimeToLibrary, useGetAnimeById } from "@/hooks/useAnime";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MediaLibraryControls from "@/components/ui/MediaLibraryControls";

function formatAirDate(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "airing soon";
  if (diffDays === 1) return "airs tomorrow";
  return `airs in ${diffDays} days`;
}

export default function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const animeId = id ? parseInt(id) : null;

  const { data: anime, isLoading } = useGetAnimeById(animeId!);
  const { mutateAsync: addToLibrary, isPending: isAdding } =
    useAddAnimeToLibrary();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full ">
        <BarLoader color="var(--purple-500)" />
        <p className="[color:var(--purple-500)] text-2xl ml-4 pt-4">
          Loading anime details...
        </p>
      </div>
    );
  }

  if (!anime) {
    return <p className="text-white">Anime Data not found.</p>;
  }

  const title = anime.romaji_title || anime.english_title;
  const year = anime.start_date ? anime.start_date.split("-")[0] : "";
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>/g, "")
    : null;
  const genres = anime.genres ?? [];
  const studios = anime.studios ?? [];
  const synonyms = anime.synonyms ?? [];

  return (
    <div className="text-white relative">
      {anime.banner_url && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={anime.banner_url}
            alt=""
            className="w-full h-96 object-cover opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
        </div>
      )}

      <div className="relative p-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col md:flex-row gap-10">
            <div className="flex flex-col gap-2">
              <div className="shrink-0">
                <img
                  src={anime.cover_url}
                  alt={title}
                  className="w-64 rounded-sm shadow-lg border border-white/10"
                />
              </div>
              {anime.trailer_url && (
                <a
                  href={anime.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-xs uppercase tracking-widest [color:var(--purple-500)] border-b [border-color:color-mix(in_srgb,var(--purple-500)_40%,transparent)] pb-0.5 hover:opacity-80"
                >
                  Watch trailer
                </a>
              )}
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <p className="mt-2 text-white/60 text-sm uppercase tracking-widest">
                  {anime.english_title &&
                    anime.english_title !== anime.romaji_title && (
                      <span className="block text-white/80">
                        {anime.english_title}
                      </span>
                    )}
                  {anime.native_title && (
                    <span className="block text-white/40 normal-case tracking-normal text-sm mt-0.5">
                      {anime.native_title}
                    </span>
                  )}
                  {year}
                  {anime.format && (
                    <>
                      <span className="mx-2 [color:var(--purple-500)]">•</span>
                      {anime.format.replace("_", " ")}
                    </>
                  )}
                  {anime.rating != null && anime.rating > 0 && (
                    <>
                      <span className="mx-2 [color:var(--purple-500)]">•</span>
                      Rating:{" "}
                      <span className="[color:var(--purple-500)]">
                        {anime.rating.toFixed(2)}
                      </span>
                    </>
                  )}
                </p>
                {synonyms.length > 0 && (
                  <p className="mt-2 text-white/30 text-xs italic">
                    {synonyms.join(" · ")}
                  </p>
                )}
              </div>

              {anime.next_episode_number != null &&
                anime.next_episode_airing_at != null && (
                  <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-sm">
                    <span className="[color:var(--purple-500)] font-semibold">
                      Episode {anime.next_episode_number}
                    </span>
                    <span className="text-white/50">
                      {formatAirDate(anime.next_episode_airing_at)}
                    </span>
                  </div>
                )}

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
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
                mediaType="anime"
                source="anilist"
                externalId={String(animeId)}
                isAdding={isAdding}
                onAdd={(status) => addToLibrary({ anime_id: animeId!, status })}
              />
            </div>
          </div>
        </div>

        {(cleanDescription || anime.status || studios.length > 0) && (
          <section className="mt-12 flex flex-col lg:flex-row gap-10">
            {cleanDescription && (
              <div>
                <h2 className="text-xs uppercase tracking-widest [color:var(--purple-500)] mb-3 border-b border-white/10 pb-2">
                  Synopsis
                </h2>
                <p className="text-white/80 leading-relaxed max-w-3xl">
                  {cleanDescription}
                </p>
              </div>
            )}

            <div className="shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-sm p-6 w-full lg:w-72 space-y-4">
                {anime.status && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Status
                    </h3>
                    <p className="text-white/80 text-sm capitalize">
                      {anime.status}
                    </p>
                  </div>
                )}
                {anime.release_season && anime.release_year && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Season
                    </h3>
                    <p className="text-white/80 text-sm capitalize">
                      {anime.release_season} {anime.release_year}
                    </p>
                  </div>
                )}
                {anime.episodes != null && anime.episodes > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Episodes
                    </h3>
                    <p className="text-white/80 text-sm">{anime.episodes}</p>
                  </div>
                )}
                {anime.duration != null && anime.duration > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Duration
                    </h3>
                    <p className="text-white/80 text-sm">
                      {anime.duration} min/ep
                    </p>
                  </div>
                )}
                {anime.source && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Source
                    </h3>
                    <p className="text-white/80 text-sm capitalize">
                      {anime.source.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                )}
                {studios.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Studio
                    </h3>
                    <p className="text-white/80 text-sm">
                      {studios.join(", ")}
                    </p>
                  </div>
                )}
                {anime.popularity != null && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Popularity
                    </h3>
                    <p className="text-white/80 text-sm">
                      {anime.popularity.toLocaleString()} members
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
