import React, { useState } from "react";
import PaletteDisplay from "../components/PaletteDisplay";
import generatePalette from "../utils/gemini";

const Home = () => {
  const [palette, setPalette] = useState([]);
  const [websiteType, setWebsiteType] = useState("");
  const [mood, setMood] = useState("");
  const [brandColor, setBrandColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!websiteType || !mood) {
      alert("Please fill in both Website Type and Mood.");
      return;
    }

    const prompt = `Generate a professional website color palette for a ${websiteType} website with ${mood} style. Brand color: ${brandColor || "None specified"}. Return JSON with primary, secondary, background, accent, text colors.`;

    setLoading(true);
    try {
      const result = await generatePalette(prompt);
      // Convert the result object into an array of its values for PaletteDisplay
      const colorArray = [
        result.primary,
        result.secondary,
        result.background,
        result.accent,
        result.text,
      ].filter(Boolean); // Filter out any undefined values just in case

      setPalette(colorArray);
    } catch (error) {
      console.error("Failed to generate palette:", error);
      alert("Failed to generate palette. Please check your API key and try again.");
      setPalette([]);
    } finally {
      setLoading(false);
    }
  };

  const handleColorClick = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>AI Color Palette Generator</h1>
        <p>Generate perfect website color palettes with AI</p>
      </header>

      <section className="input-section">
        <div className="input-group">
          <label>Website Type</label>
          <input
            type="text"
            placeholder="e.g. Portfolio, E-commerce, Blog"
            value={websiteType}
            onChange={(e) => setWebsiteType(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Mood / Style</label>
          <input
            type="text"
            placeholder="e.g. Minimalist, Vibrant, Corporate"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Brand Color (optional)</label>
          <input
            type="text"
            placeholder="e.g. #3498db"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
          />
        </div>
        <button onClick={handleGenerate} disabled={loading} className={loading ? "loading" : ""}>
          {loading ? "Generating..." : "Generate Palette"}
        </button>
      </section>

      <section className="results-section">
        {loading ? (
          <div className="loading-spinner">Creating your palette...</div>
        ) : (
          <PaletteDisplay palette={palette} onColorClick={handleColorClick} />
        )}
      </section>
    </div>
  );
};

export default Home;
