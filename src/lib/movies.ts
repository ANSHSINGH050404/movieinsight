

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface MovieDetails {
  id: string | number;
  tmdb_id?: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  cast: { name: string; character: string; profile_path: string | null }[];
  reviews: { author: string; content: string }[];
}

interface TMDBCastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

interface TMDBReview {
  author: string;
  content: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface AnalysisResult {
  summary: string;
  sentiment: 'positive' | 'mixed' | 'negative';
  pros: string[];
  cons: string[];
}

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}, retries = 3, backoff = 500) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is missing from environment variables');
  }

  url.searchParams.append('api_key', TMDB_API_KEY || '');
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  try {
    const response = await fetch(url.toString());
     
    if (!response.ok) {
      if (response.status === 401) throw new Error('Invalid TMDB API Key');
      throw new Error(`TMDB API Error: ${response.statusText} (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`TMDB Fetch failed, retrying in ${backoff}ms... (${retries} left). Error: ${error instanceof Error ? error.message : String(error)}`);
      
      // Wait for backoff period
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Retry with increased backoff
      return fetchFromTMDB(endpoint, params, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function fetchMovieById(id: string | number): Promise<MovieDetails | null> {
  try {
    let tmdbId: number | null = null;

    if (typeof id === 'string' && id.startsWith('tt')) {
      const findData = await fetchFromTMDB(`/find/${id}`, { external_source: 'imdb_id' });
      const movie = findData.movie_results?.[0];
      if (movie) {
        tmdbId = movie.id;
      }
    } else {
      tmdbId = Number(id);
    }

    if (!tmdbId || isNaN(tmdbId)) return null;

    const movieData = await fetchFromTMDB(`/movie/${tmdbId}`, {
      append_to_response: 'credits,reviews'
    });

    return {
      id: movieData.imdb_id || movieData.id.toString(),
      tmdb_id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date || '',
      vote_average: movieData.vote_average || 0,
      overview: movieData.overview || '',
      cast: movieData.credits?.cast?.slice(0, 10).map((c: TMDBCastMember) => ({
        name: c.name,
        character: c.character,
        profile_path: c.profile_path
      })) || [],
      reviews: movieData.reviews?.results?.slice(0, 5).map((r: TMDBReview) => ({
        author: r.author,
        content: r.content
      })) || []
    };
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    return null;
  }
}

export async function searchMovies(query: string): Promise<MovieDetails[]> {
  try {
    const data = await fetchFromTMDB('/search/movie', { query });
    return data.results.map((movie: TMDBMovie) => ({
      id: movie.id.toString(),
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date || '',
      vote_average: movie.vote_average || 0,
      overview: movie.overview || '',
      cast: [],
      reviews: []
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function getTrendingMovies(): Promise<MovieDetails[]> {
  try {
    const data = await fetchFromTMDB('/trending/movie/day');
    return data.results.slice(0, 10).map((movie: TMDBMovie) => ({
      id: movie.id.toString(),
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date || '',
      vote_average: movie.vote_average || 0,
      overview: movie.overview || '',
      cast: [],
      reviews: []
    }));
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}
