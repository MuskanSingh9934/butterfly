import React from "react";
import ColorCard from "./ColorCard";

const PaletteDisplay = ({ palette = [], onColorClick }) => {
  if (!Array.isArray(palette)) {
    console.error("Palette is not an array:", palette);
    return <p>Error: Invalid palette data.</p>;
  }

  return (
    <div className="palette-display">
      {palette.map((color, index) => (
        <ColorCard key={index} color={color} onClick={onColorClick} />
      ))}
    </div>
  );
};

export default PaletteDisplay;
