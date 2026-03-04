import React from "react";
import ColorCard from "./ColorCard";

const PaletteDisplay = ({ palette, onColorClick }) => {
  return (
    <div className="palette-display">
      {palette.map((color, index) => (
        <ColorCard key={index} color={color} onClick={onColorClick} />
      ))}
    </div>
  );
};

export default PaletteDisplay;
