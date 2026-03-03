import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface SentimentAnalysis {
  summary: string;
  sentiment: 'positive' | 'mixed' | 'negative';
  pros: string[];
  cons: string[];
}

export async function analyzeReviews(movieTitle: string, reviews: { author: string; content: string }[]): Promise<SentimentAnalysis> {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not defined');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Analyze the audience reviews for the movie "${movieTitle}". 
  Provide a summary of the sentiment, classify it as "positive", "mixed", or "negative", 
  and list key pros and cons mentioned by the audience.

  Reviews:
  ${reviews.map((r, i) => `Review ${i + 1}: ${r.content.substring(0, 500)}...`).join('\n\n')}

  Return the result strictly in JSON format as follows:
  {
    "summary": "...",
    "sentiment": "positive" | "mixed" | "negative",
    "pros": ["...", "..."],
    "cons": ["...", "..."]
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response if needed (sometimes the model includes markdown code blocks)
    if (text.startsWith('```json')) {
      text = text.replace(/```json|```/g, '').trim();
    }

    return JSON.parse(text);
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
