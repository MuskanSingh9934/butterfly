import React, { useState } from "react";
import PaletteDisplay from "../components/PaletteDisplay";
import generatePalette from "../utils/gemini";

const Home = () => {
  const [palette, setPalette] = useState(generatePalette());

  const handleGenerate = () => {
    setPalette(generatePalette());
  };

  const handleColorClick = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="home">
      <h1>Color Palette Generator</h1>
      <button onClick={handleGenerate}>Generate New Palette</button>
      <PaletteDisplay palette={palette} onColorClick={handleColorClick} />
    </div>
  );
};

export default Home;
