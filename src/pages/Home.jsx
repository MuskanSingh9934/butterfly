import { useState, useCallback } from "react";
import { generatePalette } from "../utils/gemini";
import "./Home.css";

// Curated default color names using approximate hex values
const COLOR_NAMES = {
  264653: "Charcoal",
  "2A9D8F": "Persian Green",
  E9C46A: "Saffron",
  F4A261: "Sandy Brown",
  E76F51: "Burnt Sienna",
  E63946: "Imperial Red",
  "457B9D": "Steel Blue",
  "1D3557": "Prussian Blue",
  A8DADC: "Powder Blue",
  F1FAEE: "Honeydew",
  "606C38": "Dark Olive",
  DDA15E: "Caramel",
  BC6C25: "Copper",
  FEFAE0: "Cornsilk",
  283618: "Hunter Green",
  "6D6875": "Mauve",
  E5989B: "Pastel Pink",
  FFB4A2: "Melon",
  FFCDB2: "Apricot",
  B5838D: "Puce",
};

function getColorName(hex) {
  const clean = hex.replace("#", "").toUpperCase();
  return COLOR_NAMES[clean] || `#${clean}`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isLight(hex) {
  return getLuminance(hex) > 165;
}

const DEFAULT_PALETTE = [
  { hex: "#264653", name: "Charcoal", locked: false },
  { hex: "#2A9D8F", name: "Persian Green", locked: false },
  { hex: "#E9C46A", name: "Saffron", locked: false },
  { hex: "#F4A261", name: "Sandy Brown", locked: false },
  { hex: "#E76F51", name: "Burnt Sienna", locked: false },
];

const PRESET_PALETTES = [
  { name: "Ocean Breeze", colors: ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"] },
  { name: "Sunset Glow", colors: ["#FF6B6B", "#FFA07A", "#FFD700", "#FF8C00", "#DC143C"] },
  { name: "Forest Walk", colors: ["#1B4332", "#2D6A4F", "#40916C", "#74C69D", "#B7E4C7"] },
  { name: "Berry Bliss", colors: ["#240046", "#7B2FBE", "#9D4EDD", "#C77DFF", "#E0AAFF"] },
  { name: "Desert Sand", colors: ["#582F0E", "#7F4F24", "#936639", "#A68A64", "#E9EDC9"] },
  { name: "Neon City", colors: ["#0D0221", "#0A014F", "#2D00F7", "#F20089", "#FF0054"] },
];

function generateRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 40 + Math.floor(Math.random() * 45);
  const lightness = 25 + Math.floor(Math.random() * 45);
  // Convert HSL to hex
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const Home = () => {
  const [colors, setColors] = useState(DEFAULT_PALETTE);
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [showPresets, setShowPresets] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [websiteType, setWebsiteType] = useState("");
  const [mood, setMood] = useState("");
  const [brandColor, setBrandColor] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);

  const generateRandom = useCallback(() => {
    setColors((prev) =>
      prev.map((c) =>
        c.locked
          ? c
          : { ...c, hex: generateRandomColor(), name: getColorName(generateRandomColor()) },
      ),
    );
    // Actually set the names correctly
    setColors((prev) =>
      prev.map((c) => {
        if (c.locked) return c;
        const hex = generateRandomColor();
        return { hex, name: getColorName(hex), locked: false };
      }),
    );
  }, []);

  // Proper generate function
  const handleGenerate = () => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.locked) return c;
        const hex = generateRandomColor();
        return { hex, name: getColorName(hex), locked: false };
      }),
    );
  };

  const handleAIGenerate = async () => {
    if (!websiteType || !mood) {
      alert("Please fill in both Website Type and Mood.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Style: ${mood}, Site: ${websiteType}, Brand: ${brandColor || "any"}`;
      const result = await generatePalette(prompt);
      const c = result.colors || result;
      const entries = [c.primary, c.secondary, c.background, c.accent, c.text]
        .filter(Boolean)
        .slice(0, 5);
      const newColors = entries.map((hex) => ({ hex, name: getColorName(hex), locked: false }));
      // Pad if < 5
      while (newColors.length < 5) {
        const hex = generateRandomColor();
        newColors.push({ hex, name: getColorName(hex), locked: false });
      }
      setColors(newColors);
      setShowAIPanel(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = (index) => {
    setColors((prev) => prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c)));
  };

  const removeColor = (index) => {
    if (colors.length <= 2) return;
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (colors.length >= 8) return;
    const hex = generateRandomColor();
    setColors((prev) => [...prev, { hex, name: getColorName(hex), locked: false }]);
  };

  const copyHex = (hex, index) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const applyPreset = (preset) => {
    setColors(preset.colors.map((hex) => ({ hex, name: getColorName(hex), locked: false })));
    setShowPresets(false);
  };

  const handleKeyDown = (e) => {
    if (e.code === "Space" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="colorflow-app" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* ── TOP NAV ── */}
      <nav className="cf-nav">
        <div className="cf-nav-left">
          <div className="cf-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="url(#logoGrad)" />
              <circle cx="10" cy="12" r="4" fill="rgba(255,255,255,0.9)" />
              <circle cx="18" cy="12" r="4" fill="rgba(255,255,255,0.6)" />
              <circle cx="14" cy="18" r="4" fill="rgba(255,255,255,0.75)" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span>ColorFlow</span>
          </div>
        </div>

        {/* ── GENERATE BUTTON (image-style, center) ── */}
        <div className="cf-nav-center">
          <button
            className={`cf-generate-btn ${loading ? "loading" : ""}`}
            onClick={handleGenerate}
            disabled={loading}
            title="Generate new palette (Space)"
          >
            <span className="gen-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </span>
            <span className="gen-text">{loading ? "Generating…" : "Generate"}</span>
            <kbd className="gen-kbd">Space</kbd>
          </button>
        </div>

        <div className="cf-nav-right">
          <button
            className="cf-nav-btn icon-btn"
            onClick={() => setShowPresets(!showPresets)}
            title="Presets"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Presets
          </button>
          <button
            className="cf-nav-btn icon-btn"
            onClick={addColor}
            title="Add color"
            disabled={colors.length >= 8}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>
          <button
            className={`cf-nav-btn ai-btn ${showAIPanel ? "active" : ""}`}
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 8v4l3 3" />
              <circle cx="18" cy="6" r="3" fill="currentColor" stroke="none" />
            </svg>
            AI Generate
          </button>
        </div>
      </nav>

      {/* ── PRESETS DROPDOWN ── */}
      {showPresets && (
        <div className="cf-presets-overlay" onClick={() => setShowPresets(false)}>
          <div className="cf-presets-panel" onClick={(e) => e.stopPropagation()}>
            <h3>Preset Palettes</h3>
            <div className="presets-grid">
              {PRESET_PALETTES.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-item"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="preset-swatches">
                    {preset.colors.map((c) => (
                      <div key={c} className="preset-swatch" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI PANEL ── */}
      {showAIPanel && (
        <div className="cf-ai-panel">
          <div className="ai-panel-inner">
            <h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              AI Color Generator
            </h3>
            <div className="ai-inputs">
              <div className="ai-input-group">
                <label>Website Type</label>
                <input
                  type="text"
                  placeholder="e.g. Portfolio, E-commerce…"
                  value={websiteType}
                  onChange={(e) => setWebsiteType(e.target.value)}
                />
              </div>
              <div className="ai-input-group">
                <label>Mood / Style</label>
                <input
                  type="text"
                  placeholder="e.g. Modern, Elegant…"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
              <div className="ai-input-group">
                <label>Brand Color (optional)</label>
                <input
                  type="text"
                  placeholder="#3498db"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                />
              </div>
              <button className="ai-generate-btn" onClick={handleAIGenerate} disabled={loading}>
                {loading ? "Generating…" : "✨ Generate with AI"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PALETTE COLUMNS ── */}
      <main className="cf-palette">
        {colors.map((color, index) => {
          const light = isLight(color.hex);
          const textColor = light ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.9)";
          const btnBg = light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)";
          const btnHover = light ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.35)";

          return (
            <div
              key={index}
              className={`cf-color-col ${activePanel === index ? "active" : ""}`}
              style={{
                backgroundColor: color.hex,
                "--text-col": textColor,
                "--btn-bg": btnBg,
                "--btn-hover": btnHover,
              }}
              onMouseEnter={() => setActivePanel(index)}
              onMouseLeave={() => setActivePanel(null)}
            >
              {/* Actions */}
              <div className="col-actions">
                <button
                  className="col-btn remove-btn"
                  onClick={() => removeColor(index)}
                  title="Remove"
                  disabled={colors.length <= 2}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <button
                  className="col-btn copy-btn"
                  onClick={() => copyHex(color.hex, index)}
                  title="Copy hex"
                >
                  {copiedIndex === index ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
                <button
                  className={`col-btn lock-btn ${color.locked ? "locked" : ""}`}
                  onClick={() => toggleLock(index)}
                  title={color.locked ? "Unlock" : "Lock"}
                >
                  {color.locked ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM12 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-6H9V9a3 3 0 1 1 6 0v2z" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Color info at bottom */}
              <div className="col-info">
                {color.locked && (
                  <div className="locked-badge">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM12 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-6H9V9a3 3 0 1 1 6 0v2z" />
                    </svg>
                    Locked
                  </div>
                )}
                <div className="col-hex">{color.hex.replace("#", "").toUpperCase()}</div>
                <div className="col-name">{color.name}</div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ── HINT BAR ── */}
      <div className="cf-hint">
        Press <kbd>Space</kbd> to generate a new palette · Click <strong>🔒</strong> to lock colors
      </div>
    </div>
  );
};

export default Home;
