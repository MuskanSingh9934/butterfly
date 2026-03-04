import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const generatePalette = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Assuming the response contains a JSON string with the color palette
    const colors = JSON.parse(response.text);
    return [colors.primary, colors.secondary, colors.background, colors.accent, colors.text];
  } catch (error) {
    console.error("Error generating palette:", error);
    return []; // Return an empty array on error
  }
};

export default generatePalette;
