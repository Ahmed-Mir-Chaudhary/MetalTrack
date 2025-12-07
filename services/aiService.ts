import { GoogleGenAI } from "@google/genai";
import { Item } from "../types";

// Note: In a real app, this key should be proxied through a backend to keep it secret.
// Since this is a client-side demo, we assume process.env.API_KEY is available.
// If not, the chat feature will gracefully fail or show a mock response.

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const sendMessageToAI = async (
  message: string, 
  contextItems: Item[]
): Promise<string> => {
  if (!ai) {
    return "I am running in demo mode without an API key. I cannot process live queries, but I can tell you that Gold is typically a safe investment!";
  }

  // Create a context string from the available items to "ground" the AI
  const contextString = contextItems.map(item => 
    `- ${item.name} (${item.category}, ${item.country}): ${item.todayPrice} ${item.unit} (${item.percentChange > 0 ? '+' : ''}${item.percentChange}%)`
  ).join('\n');

  const systemInstruction = `
    You are a helpful assistant for a Metal & Lubricant Price Tracker website.
    You have access to the following live prices:
    ${contextString}

    If a user asks about a price, use the data above. 
    If the data is not available, say you don't have that specific information.
    Keep answers concise and helpful.
    Current Date: ${new Date().toLocaleDateString()}
  `;

  try {
    const model = 'gemini-2.5-flash';
    const result = await ai.models.generateContent({
      model: model,
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return result.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I'm having trouble connecting to the AI service right now.";
  }
};
