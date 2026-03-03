'use client';

import { motion } from 'framer-motion';

export default function MovieSkeleton() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Header Info Skeleton */}
      <motion.div 
        variants={item}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] backdrop-blur-3xl"
      >
        {/* Poster Skeleton */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>

        {/* Details Skeleton */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="space-y-4">
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-3/4" />
            <div className="flex gap-4">
              <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-11/12" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-4/5" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analysis Card Skeleton */}
      <motion.div variants={item} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] backdrop-blur-3xl space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            </div>
            <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-2/3" />
          </div>
        </div>

        <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] backdrop-blur-3xl flex flex-col gap-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading Overlay Text */}
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/20">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="font-bold text-sm tracking-wide uppercase">AI analysis in progress...</span>
        </div>
        <p className="text-zinc-500 text-sm font-medium">Gemini is processing reviews & calculating sentiment</p>
      </div>
    </div>
  );
}
