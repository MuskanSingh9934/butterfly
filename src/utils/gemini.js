import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Generates a color palette based on a given prompt using Google Gemini API.
 * @param {string} prompt - The user prompt describing the desired theme.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON color palette.
 */
export async function generatePalette(prompt) {
  try {
    const fullPrompt = `Generate a comprehensive website color palette for the theme: "${prompt}". 
    Return a JSON object with the following structure:
    {
      "colors": {
        "primary": "hex",
        "secondary": "hex",
        "background": "hex",
        "accent": "hex",
        "text": "hex"
      },
      "tailwind": {
        "primary": { "50": "hex", "100": "hex", "200": "hex", "300": "hex", "400": "hex", "500": "hex", "600": "hex", "700": "hex", "800": "hex", "900": "hex" },
        "secondary": { "50": "hex", "100": "hex", "200": "hex", "300": "hex", "400": "hex", "500": "hex", "600": "hex", "700": "hex", "800": "hex", "900": "hex" },
        "accent": { "50": "hex", "100": "hex", "200": "hex", "300": "hex", "400": "hex", "500": "hex", "600": "hex", "700": "hex", "800": "hex", "900": "hex" }
      },
      "cssVariables": ":root {\\n  --primary: ...;\\n  --primary-50: ...;\\n  ...\\n}",
      "description": "Brief explanation of the color choices"
    }
    Ensure the Tailwind scales are harmonious with the base colors. 
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
