const TMDB_API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: 'movie' | 'tv';
}

export interface MovieDetails extends Movie {
  runtime?: number;
  number_of_seasons?: number;
  genres: { id: number; name: string }[];
  imdb_id?: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
}

export interface Genre {
  id: number;
  name: string;
}

export const tmdbApi = {
  getGenres: async (): Promise<Genre[]> => {
    const [movieGenres, tvGenres] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`),
      fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}`)
    ]);
    const movieData = await movieGenres.json();
    const tvData = await tvGenres.json();
    
    // Combine and deduplicate genres
    const allGenres = [...movieData.genres, ...tvData.genres];
    const uniqueGenres = allGenres.filter((genre, index, self) =>
      index === self.findIndex((g) => g.id === genre.id)
    );
    return uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
  },

  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`),
      fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`)
    ]);
    const movies = await moviesRes.json();
    const tv = await tvRes.json();
    return [...movies.results, ...tv.results];
  },

  getTrending: async (): Promise<Movie[]> => {
    const response = await fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results;
  },

  getPopular: async (): Promise<Movie[]> => {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`),
      fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`)
    ]);
    const movies = await moviesRes.json();
    const tv = await tvRes.json();
    return [...movies.results, ...tv.results];
  },

  getTopRated: async (): Promise<Movie[]> => {
    const [moviesRes, tvRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`),
      fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`)
    ]);
    const movies = await moviesRes.json();
    const tv = await tvRes.json();
    return [...movies.results, ...tv.results];
  },

  getMovieDetails: async (id: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<MovieDetails> => {
    const response = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return { ...data, media_type: mediaType };
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
  },

  getSimilarMovies: async (id: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
    const response = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/similar?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    // Sort by release date, newest first
    return data.results.sort((a: Movie, b: Movie) => {
      const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01').getTime();
      const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01').getTime();
      return dateB - dateA;
    });
  },

  getCollection: async (collectionId: number): Promise<{ parts: Movie[] }> => {
    const response = await fetch(`${TMDB_BASE_URL}/collection/${collectionId}?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    // Sort collection parts by release date
    data.parts.sort((a: Movie, b: Movie) => {
      const dateA = new Date(a.release_date || '1900-01-01').getTime();
      const dateB = new Date(b.release_date || '1900-01-01').getTime();
      return dateA - dateB;
    });
    return data;
  },

  getImageUrl: (path: string, size: 'w500' | 'original' = 'w500') => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  getTitle: (item: Movie) => item.title || item.name || 'Untitled',
  
  getReleaseDate: (item: Movie) => item.release_date || item.first_air_date || '',
};
