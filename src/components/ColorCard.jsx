import React from "react";
import "./ColorCard.css"; // Optional: Add styles for the card

const ColorCard = ({ color, onClick }) => {
  return (
    <div className="color-card" style={{ backgroundColor: color }} onClick={() => onClick(color)}>
      <p>{color}</p>
    </div>
  );
};

export default ColorCard;
