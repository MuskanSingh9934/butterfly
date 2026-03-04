import { GoogleGenAI } from "@google/genai";

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generatePalette(prompt) {
  try {
    const fullPrompt = `
Generate a website color palette for "${prompt}".

Return ONLY valid JSON with this structure:

{
  "colors": {
    "primary": "hex",
    "secondary": "hex",
    "background": "hex",
    "accent": "hex",
    "text": "hex"
  },
  "tailwind": {},
  "cssVariables": "",
  "description": ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: fullPrompt,
    });

    const text = response.text;

    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
