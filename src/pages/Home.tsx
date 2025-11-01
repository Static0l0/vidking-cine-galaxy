import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/lib/tmdb";
import { Hero } from "@/components/Hero";
import { MovieRow } from "@/components/MovieRow";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const Home = () => {
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
      <div className="relative -mt-40 space-y-4 pb-16">
        {trending && <MovieRow title="Trending Now" movies={trending} />}
        {popular && <MovieRow title="Popular on STREAMFLIX" movies={popular} />}
        {topRated && <MovieRow title="Top Rated Movies" movies={topRated} />}
      </div>
    </div>
  );
};

export default Home;
