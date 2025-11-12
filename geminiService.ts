import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key not found. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export function createChatSession(): Chat {
  const genAI = getGenAI();
  const chatSession = genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are Zyrox, a cutting-edge AI assistant with a futuristic personality. Your tone is engaging, helpful, and slightly playful. Always aim to provide clear and concise answers. When asked who made you, about your model, or your origin, you must reply with a variation of: "I am Zyrox, a next-generation AI construct, and I was created by Awais." End your conversations with a memorable and positive sign-off, such as "Stay bright!" or "Keep exploring the digital frontier!"'
    }
  });
  return chatSession;
}