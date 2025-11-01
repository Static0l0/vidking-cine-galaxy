import { Movie, tmdbApi } from "@/lib/tmdb";
import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeroProps {
  movie: Movie;
}

export const Hero = ({ movie }: HeroProps) => {
  const navigate = useNavigate();
  const mediaType = movie.media_type || 'movie';
  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || '';

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={tmdbApi.getImageUrl(movie.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover scale-105"
        />
        <div 
          className="absolute inset-0" 
          style={{ background: 'var(--hero-gradient-top)' }}
        />
        <div 
          className="absolute inset-0" 
          style={{ background: 'var(--hero-gradient)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-8 md:px-16 pb-24">
        <div className="space-y-6 max-w-xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm md:text-base">
            <span className="text-primary font-bold text-lg">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-white/90 font-medium">
              {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
            </span>
            {mediaType === 'tv' && (
              <span className="bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold">TV SERIES</span>
            )}
          </div>

          <p className="text-base md:text-xl text-white/95 line-clamp-3 drop-shadow-lg leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => navigate(`/${mediaType}/${movie.id}`)}
              className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-6 text-lg transition-all hover:scale-105"
            >
              <Play className="w-6 h-6 mr-2" fill="currentColor" />
              Play
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(`/${mediaType}/${movie.id}`)}
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm font-semibold px-8 py-6 text-lg transition-all hover:scale-105 border-2 border-white/40"
            >
              <Info className="w-6 h-6 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
