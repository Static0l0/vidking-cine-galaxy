import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface GenreNavProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

export const GenreNav = ({ selectedGenre, onGenreSelect }: GenreNavProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: tmdbApi.getGenres,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!genres) return null;

  return (
    <div className="relative px-8 md:px-16 py-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="shrink-0 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Button
            variant={selectedGenre === null ? "default" : "secondary"}
            onClick={() => onGenreSelect(null)}
            className="shrink-0 rounded-full"
          >
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "secondary"}
              onClick={() => onGenreSelect(genre.id)}
              className="shrink-0 rounded-full"
            >
              {genre.name}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="shrink-0 hover:bg-white/10 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
