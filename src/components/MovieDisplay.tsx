'use client';

import { motion } from 'framer-motion';
import { Star, Users, Calendar, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Image from 'next/image';

interface MovieDisplayProps {
  movie: {
    id: string | number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    overview: string;
    cast: { name: string; character: string; profile_path: string | null }[];
  };
  analysis: {
    summary: string;
    sentiment: 'positive' | 'mixed' | 'negative';
    pros: string[];
    cons: string[];
  };
}

export default function MovieDisplay({ movie, analysis }: MovieDisplayProps) {
  const sentimentColor = {
    positive: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    mixed: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    negative: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
  }[analysis.sentiment] || 'text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20';

  const sentimentIcon = {
    positive: <TrendingUp className="h-5 w-5" />,
    mixed: <Minus className="h-5 w-5" />,
    negative: <TrendingDown className="h-5 w-5" />
  }[analysis.sentiment] || <Minus className="h-5 w-5" />;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Helper to handle image paths (could be local or TMDB)
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Header Info */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl">
        {/* Poster */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-zinc-700/50 shadow-2xl group">
            {movie.poster_path ? (
              <Image 
                src={getImageUrl(movie.poster_path)!} 
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <p className="text-zinc-500">No Poster</p>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-zinc-500 dark:text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5 bg-zinc-100/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full text-sm border border-zinc-200/30 dark:border-zinc-700/30">
                <Calendar className="h-4 w-4" />
                {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-100/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full text-sm border border-zinc-200/30 dark:border-zinc-700/30">
                <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                {(movie.vote_average || 0).toFixed(1)} / 10
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest text-xs">
              <Info className="h-3.5 w-3.5 text-blue-500" />
              Plot Summary
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl">
              {movie.overview}
            </p>
          </div>

          {/* Cast */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest text-xs">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              Top Cast
            </div>
            <div className="flex flex-wrap gap-2">
              {(movie.cast || []).map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-100/30 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/30 pl-1 pr-3 py-1 rounded-full group cursor-default hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600">
                    {c.profile_path ? (
                      <Image 
                        src={getImageUrl(c.profile_path)!} 
                        alt={c.name}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-500">?</div>
                    )}
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-foreground transition-colors">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analysis Card */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-foreground tracking-tight">AI Insights</h3>
              <p className="text-zinc-500 text-sm">Audience sentiment analyzed by Gemini</p>
            </div>
            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-black uppercase tracking-wider ${sentimentColor}`}>
              {sentimentIcon}
              {analysis.sentiment}
            </div>
          </div>
          <div>
            <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed italic">
              &ldquo;{analysis.summary}&rdquo;
            </p>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl flex flex-col gap-6">
          <div className="space-y-4">
            <h4 className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              What they loved
            </h4>
            <ul className="space-y-2.5">
              {(analysis.pros || []).map((pro, i) => (
                <li key={i} className="flex gap-2.5 text-zinc-600 dark:text-zinc-400 text-sm leading-snug">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <TrendingDown className="h-3.5 w-3.5" />
              Common complaints
            </h4>
            <ul className="space-y-2.5">
              {(analysis.cons || []).map((con, i) => (
                <li key={i} className="flex gap-2.5 text-zinc-600 dark:text-zinc-400 text-sm leading-snug">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
