import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { tmdbApi } from "@/lib/tmdb";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Loader2 } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: movies, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => tmdbApi.searchMovies(query),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-8 md:px-16 max-w-7xl mx-auto pb-16">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Search results for "{query}"
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-20">
            No results found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
