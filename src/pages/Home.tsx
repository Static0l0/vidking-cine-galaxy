import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/lib/tmdb";
import { Hero } from "@/components/Hero";
import { MovieRow } from "@/components/MovieRow";
import { Navbar } from "@/components/Navbar";
import { GenreNav } from "@/components/GenreNav";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: tmdbApi.getTrending,
  });

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: tmdbApi.getPopular,
  });

  const { data: topRated, isLoading: topRatedLoading } = useQuery({
    queryKey: ['topRated'],
    queryFn: tmdbApi.getTopRated,
  });

  const { data: genreMovies, isLoading: genreLoading } = useQuery({
    queryKey: ['genreMovies', selectedGenre],
    queryFn: () => selectedGenre ? tmdbApi.getMoviesByGenre(selectedGenre) : Promise.resolve(null),
    enabled: selectedGenre !== null,
  });

  if (trendingLoading || popularLoading || topRatedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {trending && trending[0] && <Hero movie={trending[0]} />}
      <GenreNav selectedGenre={selectedGenre} onGenreSelect={setSelectedGenre} />
      <div className="relative space-y-4 pb-16 px-8 md:px-16">
        {selectedGenre && genreLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}
        {selectedGenre && genreMovies && (
          <MovieRow title="Genre Results" movies={genreMovies} />
        )}
        {!selectedGenre && (
          <>
            {trending && <MovieRow title="Trending Now" movies={trending} />}
            {popular && <MovieRow title="Popular on CineMore" movies={popular} />}
            {topRated && <MovieRow title="Top Rated Movies" movies={topRated} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
