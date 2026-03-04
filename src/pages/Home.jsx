import { useState } from "react";
import PaletteDisplay from "../components/PaletteDisplay";
import { generatePalette } from "../utils/gemini";

const Home = () => {
  const [palette, setPalette] = useState([]);
  const [fullData, setFullData] = useState(null);
  const [activeTab, setActiveTab] = useState("visual");
  const [websiteType, setWebsiteType] = useState("");
  const [mood, setMood] = useState("");
  const [brandColor, setBrandColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!websiteType || !mood) {
      alert("Please fill in both Website Type and Mood.");
      return;
    }

    setLoading(true);
    try {
      const prompt = `Style: ${mood}, Site: ${websiteType}, Brand: ${brandColor || "any"}`;
      const result = await generatePalette(prompt);
      setFullData(result);

      const colors = result.colors || result;
      const colorEntries = [
        { label: "Primary", color: colors.primary },
        { label: "Secondary", color: colors.secondary },
        { label: "Background", color: colors.background },
        { label: "Accent", color: colors.accent },
        { label: "Text", color: colors.text },
      ].filter((item) => item.color);

      setPalette(colorEntries);
      setActiveTab("visual");
    } catch (error) {
      console.error("Failed to generate palette:", error);
      alert("Failed to generate palette. Please check your API key and try again.");
      setPalette([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!fullData) return;
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palette-${websiteType.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyFullPalette = () => {
    if (!fullData) return;
    navigator.clipboard.writeText(JSON.stringify(fullData, null, 2));
    alert("Full palette JSON copied to clipboard!");
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>AI Color Palette Generator</h1>
        <p>Professional colors, Tailwind scales, and CSS variables in seconds.</p>
      </header>

      <section className="input-section">
        <div className="input-group">
          <label>Website Type</label>
          <input
            type="text"
            placeholder="e.g. Portfolio"
            value={websiteType}
            onChange={(e) => setWebsiteType(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Mood / Style</label>
          <input
            type="text"
            placeholder="e.g. Modern"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Brand Color</label>
          <input
            type="text"
            placeholder="#3498db"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
          />
        </div>
        <button onClick={handleGenerate} disabled={loading} className={loading ? "loading" : ""}>
          {loading ? "Generating..." : "Generate Palette"}
        </button>
      </section>

      {palette.length > 0 && !loading && (
        <div className="palette-tools">
          <div className="tabs">
            <button
              className={activeTab === "visual" ? "active" : ""}
              onClick={() => setActiveTab("visual")}
            >
              Visual
            </button>
            <button
              className={activeTab === "tailwind" ? "active" : ""}
              onClick={() => setActiveTab("tailwind")}
            >
              Tailwind
            </button>
            <button
              className={activeTab === "css" ? "active" : ""}
              onClick={() => setActiveTab("css")}
            >
              CSS
            </button>
          </div>
          <div className="action-buttons">
            <button className="tool-btn" onClick={downloadJSON}>
              Download JSON
            </button>
            <button className="tool-btn" onClick={copyFullPalette}>
              Copy Full Palette
            </button>
          </div>
        </div>
      )}

      <section className="results-section">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Creating your perfect palette...</p>
          </div>
        ) : palette.length > 0 ? (
          <div className="tab-content">
            {activeTab === "visual" && <PaletteDisplay palette={palette} />}
            {activeTab === "tailwind" && fullData?.tailwind && (
              <div className="tailwind-grid">
                {Object.entries(fullData.tailwind).map(([name, shades]) => (
                  <div key={name} className="shade-row">
                    <h3>{name}</h3>
                    <div className="shades">
                      {Object.entries(shades).map(([shade, hex]) => (
                        <div
                          key={shade}
                          className="shade-box"
                          style={{ backgroundColor: hex }}
                          title={`${name}-${shade}: ${hex}`}
                        >
                          <span>{shade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "css" && fullData?.cssVariables && (
              <pre className="css-preview">
                <code>{fullData.cssVariables}</code>
              </pre>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Home;
