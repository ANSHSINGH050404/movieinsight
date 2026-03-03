import { fetchMovieById } from '@/lib/movies';
import { analyzeReviews } from '@/lib/gemini';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';


const CACHE_TTL = 86400; // 24 hours in seconds

export async function POST(req: Request) {
  try {
    
    const { imdbId } = await req.json();

    if (!imdbId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    // Try to get from cache first
    const cacheKey = `movie:analysis:${imdbId}`;
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        // Upstash redis.get() returns the object automatically if it was stored as JSON
        return NextResponse.json(cachedData);
      }
    } catch (cacheError) {
      console.error('Redis Cache Error:', cacheError);
      // Continue to fetch fresh data if cache fails
    }

    const movieDetails = await fetchMovieById(imdbId);

    if (!movieDetails) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    const analysis = await analyzeReviews(movieDetails.title, movieDetails.reviews);

    const result = {
      movie: movieDetails,
      analysis
    };

    // Store in cache for future requests
    try {
      // Upstash redis.set() handles objects by stringifying them automatically
      await redis.set(cacheKey, result, { ex: CACHE_TTL });
    } catch (cacheError) {
      console.error('Redis Cache Set Error:', cacheError);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API Route Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
