import OpenAI from 'npm:openai@^4.20.0';

const apiKey = Deno.env.get("OPENAI_API_KEY");

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: apiKey,
}); 
