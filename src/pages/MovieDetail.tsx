import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbApi } from "@/lib/tmdb";
import { Navbar } from "@/components/Navbar";
import { MovieRow } from "@/components/MovieRow";
import { ArrowLeft, Star, Clock, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id, mediaType],
    queryFn: () => tmdbApi.getMovieDetails(Number(id), mediaType),
  });

  const { data: similarMovies } = useQuery({
    queryKey: ['similar', id, mediaType],
    queryFn: () => tmdbApi.getSimilarMovies(Number(id), mediaType),
    enabled: !!id,
  });

  const { data: collection } = useQuery({
    queryKey: ['collection', movie?.belongs_to_collection?.id],
    queryFn: () => tmdbApi.getCollection(movie!.belongs_to_collection!.id),
    enabled: !!movie?.belongs_to_collection,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Content not found</p>
      </div>
    );
  }

  const title = tmdbApi.getTitle(movie);
  const releaseDate = tmdbApi.getReleaseDate(movie);

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <Navbar />
      
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={tmdbApi.getImageUrl(movie.backdrop_path, 'original')}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      </div>

      <div className="relative -mt-32 px-8 md:px-16 max-w-7xl mx-auto pb-24">
        <Button
          onClick={() => navigate('/')}
          variant="secondary"
          className="mb-6 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="space-y-4">
            <img
              src={tmdbApi.getImageUrl(movie.poster_path)}
              alt={title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Movie Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {title}
              </h1>
              
              <div className="flex items-center gap-4 text-base mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}/10</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="w-5 h-5" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                {movie.number_of_seasons && (
                  <div className="flex items-center gap-2 text-white/80">
                    <span>{movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}</span>
                  </div>
                )}
                <span className="text-white/80 font-medium">
                  {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
                </span>
                {mediaType === 'tv' && (
                  <span className="bg-primary/90 text-white px-3 py-1 rounded text-sm font-semibold">TV SERIES</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate(`/watch/${mediaType}/${movie.id}`)}
                  className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-6 text-lg transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-2" fill="currentColor" />
                  Play Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Section */}
        {collection && collection.parts && collection.parts.length > 1 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {movie.belongs_to_collection?.name || 'Collection'}
            </h2>
            <MovieRow 
              title="" 
              movies={collection.parts} 
            />
          </div>
        )}

        {/* Similar Movies Section */}
        {similarMovies && similarMovies.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              More Like {title}
            </h2>
            <MovieRow title="" movies={similarMovies} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
