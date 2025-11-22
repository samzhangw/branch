import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getStudyAdvice = async (): Promise<string> => {
  try {
    if (!apiKey) {
      return "請設定 API Key 以獲取 AI 讀書建議 (Please configure your API KEY).";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "請給準備台灣分科測驗的高中生一句簡短、強而有力的鼓勵，或者一個實用的考試準備技巧。請用繁體中文回答，語氣要正向且專業，不要超過50個字。",
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "持續努力，夢想就在前方！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "保持專注，按照自己的節奏前進。";
  }
};