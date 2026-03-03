import { searchMovies, getTrendingMovies } from '@/lib/movies';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  try {
    if (!query) {
      const movies = await getTrendingMovies();
      return NextResponse.json(movies);
    }

    const movies = await searchMovies(query);
    return NextResponse.json(movies);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Movies API Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
