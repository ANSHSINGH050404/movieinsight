# MovieInsights AI

A premium, AI-powered tool to discover audience sentiment for any movie using IMDb IDs.

## Features
- **Instant Metadata**: Fetch titles, posters, and cast details via TMDB.
- **AI Sentiment Analysis**: Powered by Google Gemini to summarize audience reviews.
- **Sentiment Classification**: Categorizes feedback as Positive, Mixed, or Negative.
- **Premium UI**: Dark-mode aesthetic with glassmorphism, Framer Motion animations, and responsive design.

## Tech Stack Rationale
- **Next.js (App Router)**: Chosen for its robust server-side capabilities and seamless routing.
- **TypeScript**: Ensures type safety and better developer experience.
- **Tailwind CSS**: Rapid UI development with utility classes.
- **Framer Motion**: Delivers the "premium" feel through smooth, GPU-accelerated animations.
- **Google Gemini SDK**: Used for high-speed, cost-effective, and accurate sentiment analysis.
- **Lucide React**: Provides a consistent and modern icon set.

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   TMDB_API_KEY=your_tmdb_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Build for production**:
   ```bash
   npm run build
   ```

## Assumptions & Constraints
- **Data Source**: TMDB is used as the primary source for movie metadata and reviews. If a movie has no reviews on TMDB, the AI analysis will indicate a lack of data.
- **ID Format**: The app expects standard IMDb IDs starting with `tt` followed by digits (e.g., `tt0133093`).
- **AI Model**: Uses `gemini-1.5-flash` for a balance of speed and intelligence.

## Deployment
Recommended: **Vercel**
1. Push to GitHub.
2. Connect repository to Vercel.
3. Add `TMDB_API_KEY` and `GEMINI_API_KEY` to the project's Environment Variables in the Vercel dashboard.
4. Deploy.
