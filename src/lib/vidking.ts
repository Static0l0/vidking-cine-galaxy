interface VidkingOptions {
  color?: string; // hex color without #
  autoPlay?: boolean;
  progress?: number; // start time in seconds
}

export const getVidkingUrl = (
  tmdbId: number, 
  mediaType: 'movie' | 'tv' = 'movie',
  season?: number,
  episode?: number,
  options?: VidkingOptions
) => {
  let baseUrl = `https://www.vidking.net/embed/${mediaType}/${tmdbId}`;
  
  // For TV shows, add season and episode if provided
  if (mediaType === 'tv' && season && episode) {
    baseUrl += `/${season}/${episode}`;
  }
  
  if (!options) return baseUrl;
  
  const params = new URLSearchParams();
  if (options.color) params.append('color', options.color);
  if (options.autoPlay) params.append('autoPlay', 'true');
  if (options.progress) params.append('progress', options.progress.toString());
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Progress tracking helper
export const setupProgressTracking = (callback: (data: any) => void) => {
  window.addEventListener('message', (event) => {
    if (typeof event.data === 'string') {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PLAYER_EVENT') {
          callback(data.data);
        }
      } catch (e) {
        // Not JSON, ignore
      }
    }
  });
};
