import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Generates a color palette based on a given prompt using Google Gemini API.
 * @param {string} prompt - The user prompt describing the desired theme.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON color palette.
 */
export async function generatePalette(prompt) {
  try {
    const fullPrompt = `Generate a website color palette with 5 colors for the theme: "${prompt}". 
    Return the colors strictly in JSON format with the following keys:
    "primary", "secondary", "background", "accent", "text".
    The values should be hex codes.
    Example: 
    {
      "primary": "#000000",
      "secondary": "#111111",
      "background": "#ffffff",
      "accent": "#ff0000",
      "text": "#222222"
    }
    Only return the JSON content. No other text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    const text = response.text;

    // Clean potential markdown formatting if any
    const jsonString = text.replace(/```json|```/g, "").trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default generatePalette;
