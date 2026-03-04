import React, { useState } from "react";
import PaletteDisplay from "../components/PaletteDisplay";
import generatePalette from "../utils/gemini";
import "./Home.css";

const Home = () => {
  const [palette, setPalette] = useState(generatePalette());
  const [websiteType, setWebsiteType] = useState("");
  const [mood, setMood] = useState("");
  const [brandColor, setBrandColor] = useState("");

  const handleGenerate = () => {
    setPalette(generatePalette());
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
        <input
          type="text"
          placeholder="Website Type"
          value={websiteType}
          onChange={(e) => setWebsiteType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mood / Style"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <input
          type="text"
          placeholder="Brand Color (optional)"
          value={brandColor}
          onChange={(e) => setBrandColor(e.target.value)}
        />
        <button onClick={handleGenerate}>Generate Palette</button>
      </section>

      <section className="results-section">
        <PaletteDisplay palette={palette} onColorClick={handleColorClick} />
      </section>
    </div>
  );
};

export default Home;
