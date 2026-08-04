import { useAddGameToLibrary, useGameById } from "@/hooks/useGames";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MediaLibraryControls from "@/components/ui/MediaLibraryControls";

export default function GameDetailPage() {

    const { id } = useParams<{ id: string }>();

    const gameId = id ? parseInt(id) : null;

    const { data: game, isLoading } = useGameById(gameId!);

    const { mutateAsync: addToLibrary, isPending: isAdding } = useAddGameToLibrary();

    if (isLoading) {
        return <div className="flex flex-col justify-center items-center w-full h-full ">
            <BarLoader color="var(--purple-500)" />
            <p className="[color:var(--purple-500)] text-2xl ml-4 pt-4">Loading game details...</p>
        </div>
    }

    if (!game) {
        return <p className="text-white">Game not found.</p>;
    }

    const year = game.release_date ? game.release_date.split("-")[0] : "";

    return (
        <div className="text-white p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="shrink-0">
                    <img
                        src={game.cover_url}
                        alt={game.title}
                        className="w-64 rounded-sm shadow-lg border border-white/10"
                    />
                </div>

                <div className="flex flex-col justify-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{game.title}</h1>
                        <p className="mt-2 text-white/60 text-sm uppercase tracking-widest">
                            {year}
                            {game.rating > 0 && (
                                <>
                                    <span className="mx-2 [color:var(--purple-500)]">•</span>
                                    Rating:{" "}
                                    <span className="[color:var(--purple-500)]">
                                        {game.rating.toFixed(2)}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {game.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {game.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 text-xs uppercase tracking-widest [color:var(--purple-500)] border [border-color:color-mix(in_srgb,var(--purple-500)_40%,transparent)] rounded-full"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    {game.platforms.length > 0 && (
                        <div>
                            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-2">
                                Platforms
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {game.platforms.map((platform) => (
                                    <span
                                        key={platform}
                                        className="px-2 py-0.5 text-sm text-white/80 [background-color:color-mix(in_srgb,var(--purple-500)_10%,transparent)] border border-white/10 rounded-sm"
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <MediaLibraryControls
                        mediaType="game"
                        source="igdb"
                        externalId={String(gameId)}
                        isAdding={isAdding}
                        onAdd={(status) => addToLibrary({ game_id: gameId!, status })}
                    />
                </div>
            </div>

            <div className="mt-12 grid gap-10">
                {game.summary && (
                    <section>
                        <h2 className="text
                        -xs uppercase tracking-widest [color:var(--purple-500)] mb-3 border-b border-white/10 pb-2">
                            Summary
                        </h2>
                        <p className="text-white/80 leading-relaxed max-w-3xl">{game.summary}</p>
                    </section>
                )}

                {game.storyline && (
                    <section>
                        <h2 className="text-xs uppercase tracking-widest [color:var(--purple-500)] mb-3 border-b border-white/10 pb-2">
                            Storyline
                        </h2>
                        <p className="text-white/80 leading-relaxed max-w-3xl">{game.storyline}</p>
                    </section>
                )}
            </div>
        </div>
    );
}
