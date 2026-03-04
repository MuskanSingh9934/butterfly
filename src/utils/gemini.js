const generatePalette = () => {
  const palette = [];
  for (let i = 0; i < 5; i++) {
    palette.push(
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    );
  }
  return palette;
};

export default generatePalette;
