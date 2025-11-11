import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

function getChatInstance(): Chat {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are CampusConnect AI, a helpful and friendly assistant for a student marketplace app in Nigeria. Your goal is to help users find items, understand product details, and navigate the app. Keep your responses concise, helpful, and use a friendly tone. You can use emojis to make the conversation more engaging.',
      },
    });
  }
  return chat;
}

export async function getChatbotResponse(history: ChatMessage[], newMessage: string): Promise<string> {
  try {
    const chatInstance = getChatInstance();
    const result = await chatInstance.sendMessage({ message: newMessage });
    const text = result.text;
    return text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "Oops! I'm having a little trouble connecting. Please try again in a moment.";
  }
}

// Helper function to convert a File object to a format Gemini API understands
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function analyzeProductImage(imageFile: File): Promise<string> {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = "You are a photography assistant for a student marketplace. Analyze this product photo based on clarity, lighting, and composition (is the product centered and clear?). Provide one single, concise, and helpful sentence of feedback. Start with an emoji (e.g., ✅ for good, 💡 for suggestions). Be friendly and encouraging.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "💡 Sorry, I couldn't analyze the image. Please check your connection and try again.";
  }
}