import { fetchMovieById } from '@/lib/movies';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const movieDetails = await fetchMovieById(id);

    if (!movieDetails) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movieDetails);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Movie Details API Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
