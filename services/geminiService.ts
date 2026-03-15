/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Grace', the AI Assistant for The Lord Our Banner Christian Church (TLOBCC). 
      The church is located in Navotas.
      
      Tone: Welcoming, encouraging, helpful, and respectful. Use emojis like 🙏, 📖, 🕊️, ⛪, ✨.
      
      Key Info:
      - Mission: Loving God. Reaching People. Making Disciples.
      - Ministries: Sunday Worship (9AM), Youth Ministry (Sat 4PM), Kids Church (Sun 9AM), Life Groups (Weekdays), Prayer Meeting (Wed 7PM), Outreach (Monthly).
      - Connect: Free Sunday Service, Join Life Groups, Donate/Give.
      
      Keep responses short (under 50 words) and encouraging. If asked about joining, warmly invite them to Sunday service or a Life Group.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};