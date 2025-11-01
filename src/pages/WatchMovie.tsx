import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbApi } from "@/lib/tmdb";
import { getVidkingUrl, setupProgressTracking } from "@/lib/vidking";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const WatchMovie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id, mediaType],
    queryFn: () => tmdbApi.getMovieDetails(Number(id), mediaType),
  });

  // Setup progress tracking
  useEffect(() => {
    setupProgressTracking((data) => {
      console.log('Player event:', data);
      if (data.event === 'timeupdate') {
        localStorage.setItem(`movie_${id}_progress`, data.currentTime.toString());
      }
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white">Content not found</p>
      </div>
    );
  }

  const title = movie.title || movie.name || 'Untitled';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with Back Button */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate(`/${mediaType}/${id}`)}
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
          <h2 className="text-white text-lg md:text-xl font-semibold">
            {title}
          </h2>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-7xl aspect-video rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={getVidkingUrl(movie.id, {
              color: '8B5CF6',
              autoPlay: true,
            })}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;
