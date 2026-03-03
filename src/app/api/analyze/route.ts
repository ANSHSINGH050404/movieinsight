import { fetchMovieById } from '@/lib/movies';
import { analyzeReviews } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imdbId } = await req.json();

    if (!imdbId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const movieDetails = await fetchMovieById(imdbId);

    if (!movieDetails) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    const analysis = await analyzeReviews(movieDetails.title, movieDetails.reviews);

    return NextResponse.json({
      movie: movieDetails,
      analysis
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API Route Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
