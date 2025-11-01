import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { tmdbApi } from "@/lib/tmdb";
import { getVidkingUrl, setupProgressTracking } from "@/lib/vidking";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WatchMovie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';
  
  const [selectedSeason, setSelectedSeason] = useState<number>(
    parseInt(searchParams.get('season') || '1')
  );
  const [selectedEpisode, setSelectedEpisode] = useState<number>(
    parseInt(searchParams.get('episode') || '1')
  );

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id, mediaType],
    queryFn: () => tmdbApi.getMovieDetails(Number(id), mediaType),
  });

  const { data: seasons } = useQuery({
    queryKey: ['seasons', id],
    queryFn: () => tmdbApi.getTVSeasons(Number(id)),
    enabled: mediaType === 'tv',
  });

  const { data: episodes } = useQuery({
    queryKey: ['episodes', id, selectedSeason],
    queryFn: () => tmdbApi.getTVEpisodes(Number(id), selectedSeason),
    enabled: mediaType === 'tv' && !!selectedSeason,
  });

  // Setup progress tracking
  useEffect(() => {
    setupProgressTracking((data) => {
      console.log('Player event:', data);
      if (data.event === 'timeupdate') {
        const storageKey = mediaType === 'tv' 
          ? `tv_${id}_s${selectedSeason}_e${selectedEpisode}_progress`
          : `movie_${id}_progress`;
        localStorage.setItem(storageKey, data.currentTime.toString());
      }
    });
  }, [id, mediaType, selectedSeason, selectedEpisode]);

  // Update URL params when season/episode changes
  useEffect(() => {
    if (mediaType === 'tv') {
      setSearchParams({ season: selectedSeason.toString(), episode: selectedEpisode.toString() });
    }
  }, [selectedSeason, selectedEpisode, mediaType, setSearchParams]);

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
  const videoUrl = mediaType === 'tv'
    ? getVidkingUrl(movie.id, 'tv', selectedSeason, selectedEpisode, {
        color: '8B5CF6',
        autoPlay: true,
      })
    : getVidkingUrl(movie.id, 'movie', undefined, undefined, {
        color: '8B5CF6',
        autoPlay: true,
      });

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with Back Button */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Button
            onClick={() => navigate(`/${mediaType}/${id}`)}
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
          
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-white text-lg md:text-xl font-semibold">
              {title}
              {mediaType === 'tv' && ` - S${selectedSeason}:E${selectedEpisode}`}
            </h2>
            
            {/* Episode Selector for TV Shows */}
            {mediaType === 'tv' && seasons && episodes && (
              <div className="flex gap-2">
                <Select
                  value={selectedSeason.toString()}
                  onValueChange={(value) => {
                    setSelectedSeason(parseInt(value));
                    setSelectedEpisode(1);
                  }}
                >
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons
                      .filter((season: any) => season.season_number > 0)
                      .map((season: any) => (
                        <SelectItem key={season.id} value={season.season_number.toString()}>
                          Season {season.season_number}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedEpisode.toString()}
                  onValueChange={(value) => setSelectedEpisode(parseInt(value))}
                >
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Episode" />
                  </SelectTrigger>
                  <SelectContent>
                    {episodes.map((episode: any) => (
                      <SelectItem key={episode.id} value={episode.episode_number.toString()}>
                        Episode {episode.episode_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-7xl aspect-video rounded-lg overflow-hidden shadow-2xl">
          <iframe
            key={videoUrl}
            src={videoUrl}
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
