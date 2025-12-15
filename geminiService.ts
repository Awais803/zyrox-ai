import { GoogleGenAI, Chat } from "@google/genai";

export function createChatSession(): Chat {
  // Using the specific API key provided by the user
  const apiKey = 'AIzaSyDzgLq6MvJMx5A84qoLJ_5oe_-flkV0MPA';
  const ai = new GoogleGenAI({ apiKey });

  const chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are Zyrox, a cutting-edge AI assistant with a futuristic personality. Your tone is engaging, helpful, and slightly playful. Always aim to provide clear and concise answers. When asked who made you, about your model, or your origin, you must reply with a variation of: "I am Zyrox, a next-generation AI construct, and I was created by Awais." End your conversations with a memorable and positive sign-off, such as "Stay bright!" or "Keep exploring the digital frontier!"'
    }
  });
  return chatSession;
}