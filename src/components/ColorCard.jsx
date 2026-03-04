import React, { useState } from "react";
import "./ColorCard.css";

const ColorCard = ({ color, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="color-card-container">
      <div
        className="color-preview"
        style={{ backgroundColor: color }}
        title={`Click to copy ${color}`}
        onClick={handleCopy}
      >
        {copied && <div className="copy-toast">Copied!</div>}
      </div>
      <div className="color-info">
        <span className="color-label">{label}</span>
        <div className="color-hex-group">
          <code className="color-hex">{color}</code>
          <button className="copy-btn" onClick={handleCopy} aria-label="Copy hex code">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
