import { Movie, tmdbApi } from "@/lib/tmdb";
import { useNavigate } from "react-router-dom";
import { Play, Info, Tv } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const mediaType = movie.media_type || 'movie';
  const title = tmdbApi.getTitle(movie);
  const releaseDate = tmdbApi.getReleaseDate(movie);

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/${mediaType}/${movie.id}`)}
    >
      <div 
        className="relative aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 ease-out group-hover:scale-110 group-hover:rounded-lg"
        style={{ 
          boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)'
        }}
      >
        <img
          src={tmdbApi.getImageUrl(movie.poster_path)}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Media Type Badge */}
        {mediaType === 'tv' && (
          <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <Tv className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-semibold">TV</span>
          </div>
        )}
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-primary font-semibold">⭐ {movie.vote_average.toFixed(1)}</span>
              <span className="text-white/80">{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button 
                className="flex-1 h-8 text-xs bg-white text-black hover:bg-white/90 font-semibold rounded-md flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${mediaType}/${movie.id}`);
                }}
              >
                <Play className="w-3 h-3 mr-1" fill="currentColor" />
                Play
              </button>
              <button 
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-md flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${mediaType}/${movie.id}`);
                }}
              >
                <Info className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
