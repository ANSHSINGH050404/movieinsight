'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieSearchProps {
  onSearch: (id: string) => void;
  isLoading: boolean;
}

export default function MovieSearch({ onSearch, isLoading }: MovieSearchProps) {
  const [movieId, setMovieId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!movieId.trim()) {
      setError('Please enter a Movie ID');
      return;
    }

    onSearch(movieId.trim());
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto space-y-2"
    >
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          placeholder="Enter Movie ID (e.g. tt0133093 or 603)"
          className="block w-full pl-11 pr-32 py-4 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white placeholder-zinc-500 shadow-2xl"
          disabled={isLoading}
        />
        <div className="absolute inset-y-2 right-2">
          <button
            type="submit"
            disabled={isLoading}
            className="h-full px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:cursor-not-allowed group-active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400 pl-4"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  );
}
