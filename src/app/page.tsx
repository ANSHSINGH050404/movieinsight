'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieSearch from '@/components/MovieSearch';
import MovieDisplay from '@/components/MovieDisplay';
import { Clapperboard, Sparkles } from 'lucide-react';
import { MovieDetails, AnalysisResult } from '@/lib/movies';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ movie: MovieDetails; analysis: AnalysisResult } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (imdbId: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imdbId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to analyze movie');
      }

      setData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-blue-500/30">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-32 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">AI-Powered Sentiment Discovery</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tight"
            >
              Movie<span className="text-blue-500">Insights</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Enter a Movie ID to uncover what the audience truly thinks. 
              Custom local API combined with Gemini analysis.
            </motion.p>
          </div>

          <MovieSearch onSearch={handleSearch} isLoading={loading} />
        </section>

        {/* Results Section */}
        <section className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-6 py-20"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <Clapperboard className="absolute inset-0 m-auto h-6 w-6 text-blue-500 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-white font-bold tracking-tight">Gathering insights...</p>
                  <p className="text-zinc-500 text-sm">Gemini is processing reviews and analyzing sentiment</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center space-y-4"
              >
                <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-500">
                  <Info className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white">Analysis Failed</h3>
                  <p className="text-zinc-400 text-sm">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {data && !loading && (
              <MovieDisplay key="results" movie={data.movie} analysis={data.analysis} />
            )}

            {!data && !loading && !error && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center opacity-20 pointer-events-none"
              >
                <Clapperboard className="h-24 w-24 mx-auto mb-4" />
                <p className="text-2xl font-black uppercase tracking-widest">Waiting for ID</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-zinc-900 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-500 text-sm flex items-center gap-2">
            <span className="font-black tracking-tight text-white">MOVIEINSIGHTS</span>
            <span>&copy; 2024</span>
          </div>
          <div className="flex gap-8 text-zinc-500 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API Policy</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
