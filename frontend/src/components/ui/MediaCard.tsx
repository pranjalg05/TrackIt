interface MediaCardProps {
  id: number;
  title: string;
  imageUrl?: string;
  rating?: number;
  releaseDate?: string;
  type: "movie" | "tv-show" | "anime" | "game";
}

import { useState } from "react";
import { Link } from "react-router-dom";

export default function MediaCard({
  id,
  title,
  imageUrl,
  rating,
  releaseDate,
  type,
}: MediaCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const year = releaseDate ? releaseDate.split("-")[0] : "";

  return (
    <div
      className="w-48 bg-gray-800 rounded-sm overflow-hidden shadow-lg m-3 relative group"
      title={title}
    >
      <Link to={`/${type}/${id}`} className="block relative">
        <img
          className={`w-full h-64 object-cover transition-opacity duration-300 ${
            hasError || !imageUrl
              ? "hidden"
              : isLoading
                ? "opacity-50"
                : "opacity-100"
          }`}
          src={imageUrl}
          alt={title}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />

        {(hasError || !imageUrl) && (
          <div className="w-full h-64 flex items-center justify-center bg-gray-700">
            <span className="text-white font-bold text-center px-2">
              {title}
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
            {rating && rating > 0 ? rating.toFixed(2) : "N/A"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-0">
          <h2 className="text-md font-bold text-white mb-1">{title}</h2>
          {year && <p className="text-gray-300 text-sm">{year}</p>}
        </div>
      </Link>
    </div>
  );
}
