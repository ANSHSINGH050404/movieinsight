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
    Provide a summary, classify sentiment (positive, mixed, or negative), and list pros and cons.
    
    You MUST respond with a JSON object in the following format:
    {
      "summary": "Short 1-2 sentence overview",
      "sentiment": "positive" | "mixed" | "negative",
      "pros": ["pro 1", "pro 2", ...],
      "cons": ["con 1", "con 2", ...]
    }

    Reviews:
    ${reviewsText}`;

  try {
    const result = await googleAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(result.text || '{}');
    
    return {
      summary: parsed.summary || 'No summary available.',
      sentiment: parsed.sentiment || 'mixed',
      pros: Array.isArray(parsed.pros) ? parsed.pros : [],
      cons: Array.isArray(parsed.cons) ? parsed.cons : []
    };

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