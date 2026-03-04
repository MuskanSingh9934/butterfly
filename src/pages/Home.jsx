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
      // Map the object keys to an array of objects with color and label
      const colorEntries = [
        { label: "Primary", color: result.primary },
        { label: "Secondary", color: result.secondary },
        { label: "Background", color: result.background },
        { label: "Accent", color: result.accent },
        { label: "Text", color: result.text },
      ].filter((item) => item.color);

      setPalette(colorEntries);
    } catch (error) {
      console.error("Failed to generate palette:", error);
      alert("Failed to generate palette. Please check your API key and try again.");
      setPalette([]);
    } finally {
      setLoading(false);
    }
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
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Creating your perfect palette...</p>
          </div>
        ) : (
          <PaletteDisplay palette={palette} />
        )}
      </section>
    </div>
  );
};

export default Home;
