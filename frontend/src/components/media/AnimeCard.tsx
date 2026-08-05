interface AnimeCardProps {
  id: number;
  romajiTitle?: string | null;
  englishTitle?: string | null;
  imageUrl?: string | null;
  rating?: number | null;
  releaseDate?: string | null;
}

import { useState } from "react";
import { Link } from "react-router-dom";

export default function AnimeCard({
  id,
  romajiTitle,
  englishTitle,
  imageUrl,
  rating,
  releaseDate,
}: AnimeCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const year = releaseDate ? releaseDate.split("-")[0] : "";
  const displayTitle = englishTitle || romajiTitle || "Untitled";

  return (
    <div
      className="w-56 bg-gray-800 rounded-sm overflow-hidden shadow-lg m-3 relative group"
      title={displayTitle}
    >
      <Link to={`/anime/${id}`} className="block relative">
        <img
          className={`w-full h-80 object-cover transition-opacity duration-300 ${
            hasError || !imageUrl
              ? "hidden"
              : isLoading
                ? "opacity-50"
                : "opacity-100"
          }`}
          src={imageUrl || ""}
          alt={displayTitle}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />

        {(hasError || !imageUrl) && (
          <div className="w-full h-80 flex items-center justify-center bg-gray-700">
            <span className="text-white font-bold text-center px-2">
              {displayTitle}
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
            {rating && rating > 0 ? rating.toFixed(2) : "N/A"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h2 className="text-md font-bold text-white mb-1">{romajiTitle || displayTitle}</h2>
          {englishTitle && englishTitle !== romajiTitle && (
            <p className="text-gray-300 text-sm">{englishTitle}</p>
          )}
          {year && <p className="text-gray-300 text-sm">{year}</p>}
        </div>
      </Link>
    </div>
  );
}