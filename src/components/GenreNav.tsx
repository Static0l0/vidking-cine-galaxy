import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/lib/tmdb";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";

interface GenreNavProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

export const GenreNav = ({ selectedGenre, onGenreSelect }: GenreNavProps) => {
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: tmdbApi.getGenres,
  });

  if (!genres) return null;

  return (
    <div className="px-8 md:px-16 py-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            onClick={() => onGenreSelect(null)}
            className="rounded-full"
          >
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "outline"}
              onClick={() => onGenreSelect(genre.id)}
              className="rounded-full"
            >
              {genre.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
