import axios from "axios";

const generatePalette = async (prompt) => {
  try {
    const response = await axios.post(
      "https://gemini.googleapis.com/v1/generate",
      { prompt, maxResults: 1 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
        },
      },
    );

    const colors = response.data.colors[0]; // Assuming the API returns an array of color objects
    return {
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      accent: colors.accent,
      text: colors.text,
    };
  } catch (error) {
    console.error("Error generating palette:", error);
    throw new Error("Failed to generate palette");
  }
};

export default generatePalette;
