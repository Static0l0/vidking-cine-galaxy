import { Movie } from "@/lib/tmdb";
import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export const MovieRow = ({ title, movies }: MovieRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 mb-12">
      <h2 className="text-xl md:text-2xl font-bold text-foreground px-8 md:px-16 hover:text-primary transition-colors cursor-default">
        {title}
      </h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-background via-background to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft className="w-10 h-10 text-white drop-shadow-lg" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-8 md:px-16 scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-44 md:w-52">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-background via-background to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight className="w-10 h-10 text-white drop-shadow-lg" />
        </button>
      </div>
    </div>
  );
};
