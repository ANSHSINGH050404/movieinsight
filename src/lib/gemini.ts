import { GoogleGenAI } from '@google/genai';

// Initialize the client
const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export interface SentimentAnalysis {
  summary: string;
  sentiment: 'positive' | 'mixed' | 'negative';
  pros: string[];
  cons: string[];
}

export async function analyzeReviews(movieTitle: string, reviews: { author: string; content: string }[]): Promise<SentimentAnalysis> {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not defined');

  // Truncate and format reviews
  const reviewsText = reviews
    .map((r, i) => `Review ${i + 1}: ${r.content.substring(0, 500)}`)
    .join('\n\n');

  const prompt = `Analyze the audience reviews for the movie "${movieTitle}".
    Provide a summary, classify sentiment, and list pros and cons.
    
    Reviews:
    ${reviewsText}`;

  try {
    const result = await googleAI.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        // This ensures the model returns valid JSON without markdown backticks
        responseMimeType: 'application/json',
      },
    });

    // The SDK automatically parses the response if it's application/json
    return JSON.parse(result.text || '{}') as SentimentAnalysis;

  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return {
      summary: 'Unable to analyze reviews at this time.',
      sentiment: 'mixed',
      pros: [],
      cons: []
    };
  }
}