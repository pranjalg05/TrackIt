import { useAddMangaToLibrary, useGetMangaById } from "@/hooks/useManga";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MediaLibraryControls from "@/components/ui/MediaLibraryControls";

export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();

  const mangaId = id ? parseInt(id) : null;

  const { data: manga, isLoading } = useGetMangaById(mangaId!);
  const { mutateAsync: addToLibrary, isPending: isAdding } = useAddMangaToLibrary();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full ">
        <BarLoader color="var(--purple-500)" />
        <p className="[color:var(--purple-500)] text-2xl ml-4 pt-4">
          Loading manga details...
        </p>
      </div>
    );
  }

  if (!manga) {
    return <p className="text-white">Manga Data not found.</p>;
  }

  const title = manga.romaji_title || manga.english_title;
  const year = manga.start_date ? manga.start_date.split("-")[0] : "";
  const cleanDescription = manga.description
    ? manga.description.replace(/<[^>]*>/g, "")
    : "";

  return (
    <div className="text-white relative">
      {manga.banner_url && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={manga.banner_url}
            alt=""
            className="w-full h-96 object-cover opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
        </div>
      )}

      <div className="relative p-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col md:flex-row gap-10">
            <div className="shrink-0">
              <img
                src={manga.cover_url || ""}
                alt={title || ""}
                className="w-64 rounded-sm shadow-lg border border-white/10"
              />
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <p className="mt-2 text-white/60 text-sm uppercase tracking-widest">
                  {manga.english_title &&
                    manga.english_title !== manga.romaji_title && (
                      <span className="block text-white/80">
                        {manga.english_title}
                      </span>
                    )}
                  {year}
                  {manga.rating != null && manga.rating > 0 && (
                    <>
                      <span className="mx-2 [color:var(--purple-500)]">•</span>
                      Rating:{" "}
                      <span className="[color:var(--purple-500)]">
                        {manga.rating.toFixed(2)}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {manga.genres && manga.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
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
                mediaType="manga"
                source="anilist"
                externalId={String(mangaId)}
                isAdding={isAdding}
                onAdd={(status) => addToLibrary({ manga_id: mangaId!, status })}
              />
            </div>
          </div>
        </div>

        {manga.description && (
          <section className="mt-12 flex flex-col lg:flex-row gap-10">
            <div>
              <h2 className="text-xs uppercase tracking-widest [color:var(--purple-500)] mb-3 border-b border-white/10 pb-2">
                Synopsis
              </h2>
              <p className="text-white/80 leading-relaxed max-w-3xl">
                {cleanDescription}
              </p>
            </div>

            <div className="shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-sm p-6 w-full lg:w-72 space-y-4">
                {manga.status && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Status
                    </h3>
                    <p className="text-white/80 text-sm capitalize">{manga.status}</p>
                  </div>
                )}
                {manga.release_year && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Year
                    </h3>
                    <p className="text-white/80 text-sm">{manga.release_year}</p>
                  </div>
                )}
                {manga.chapters && manga.chapters > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Chapters
                    </h3>
                    <p className="text-white/80 text-sm">{manga.chapters}</p>
                  </div>
                )}
                {manga.volumes && manga.volumes > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                      Volumes
                    </h3>
                    <p className="text-white/80 text-sm">{manga.volumes}</p>
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