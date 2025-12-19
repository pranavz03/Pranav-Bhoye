
import { GoogleGenAI } from "@google/genai";
import { PredictionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAISignal = async (history: PredictionData[]): Promise<string> => {
  const historyStr = history.map(h => `P:${h.period} N:${h.number} S:${h.size} C:${h.color}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a DMwin Pro Analyst. Analyze this recent history and give a short 1-sentence prediction for the next round (Big/Small, Color, or Number). Keep it professional and high-stakes.
      History:
      ${historyStr}`,
      config: {
        systemInstruction: "You are a professional betting analyst for the DMwin club. You provide high-confidence signals based on number patterns and data cycles.",
        temperature: 0.7,
      }
    });
    return response.text || "Wait for data sync...";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error fetching AI signal. Follow the trend: 8 is Big, 2 is Small.";
  }
};

export const chatWithBot = async (message: string, history: PredictionData[]): Promise<string> => {
  const historyStr = history.slice(0, 5).map(h => `P:${h.period} N:${h.number}`).join(', ');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User message: ${message}\n\nCurrent Game Context: ${historyStr}`,
      config: {
        systemInstruction: "You are 'Tashan Win AI Assistant'. You help users with color prediction strategies, explain the 2880 number cycle, and provide encouragement. Be concise and use gambling terminology like 'dragon trend', 'mirror pattern', etc.",
      }
    });
    return response.text || "I'm analyzing the data cycle. Give me a moment.";
  } catch (error) {
    return "I am currently processing the 2880 data cycle. Please try again in a moment.";
  }
};
