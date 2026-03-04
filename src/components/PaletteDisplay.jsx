import React from "react";
import ColorCard from "./ColorCard";

const PaletteDisplay = ({ palette = [] }) => {
  if (!Array.isArray(palette)) {
    console.error("Palette is not an array:", palette);
    return <p>Error: Invalid palette data.</p>;
  }

  return (
    <div className="palette-display">
      {palette.map((item, index) => (
        <ColorCard key={index} color={item.color} label={item.label} />
      ))}
    </div>
  );
};

export default PaletteDisplay;
