const colors: Record<string, { backgroundColor: string; color: string }> = {
  A: { backgroundColor: "#FF5733", color: "white" },
  B: { backgroundColor: "#33FF57", color: "black" },
  C: { backgroundColor: "#3357FF", color: "white" },
  D: { backgroundColor: "#FF33A1", color: "black" },
  E: { backgroundColor: "#A133FF", color: "white" },
  F: { backgroundColor: "#33FFF5", color: "black" },
  G: { backgroundColor: "#09005E", color: "white" },
  H: { backgroundColor: "#FF8C33", color: "black" },
  I: { backgroundColor: "#8C33FF", color: "white" },
  J: { backgroundColor: "#33FF8C", color: "black" },
  K: { backgroundColor: "#FF33D4", color: "white" },
  L: { backgroundColor: "#33D4FF", color: "black" },
  M: { backgroundColor: "#D433FF", color: "white" },
  N: { backgroundColor: "#FF33B5", color: "black" },
  O: { backgroundColor: "#33FF33", color: "white" },
  P: { backgroundColor: "#FF3333", color: "black" },
  Q: { backgroundColor: "#FF33FF", color: "black" },
  R: { backgroundColor: "#33FF33", color: "black" },
  S: { backgroundColor: "#FF5733", color: "white" },
  T: { backgroundColor: "#33FF57", color: "black" },
  U: { backgroundColor: "#3357FF", color: "white" },
  V: { backgroundColor: "#FF33A1", color: "black" },
  W: { backgroundColor: "#A133FF", color: "white" },
  X: { backgroundColor: "#33FFF5", color: "black" },
  Y: { backgroundColor: "#09005E", color: "white" },
  Z: { backgroundColor: "#FF8C33", color: "black" },
  "0": { backgroundColor: "#8C33FF", color: "white" },
  "1": { backgroundColor: "#33FF8C", color: "black" },
  "2": { backgroundColor: "#FF33D4", color: "white" },
  "3": { backgroundColor: "#33D4FF", color: "black" },
  "4": { backgroundColor: "#D433FF", color: "white" },
  "5": { backgroundColor: "#FF33B5", color: "black" },
  "6": { backgroundColor: "#33FF33", color: "white" },
  "7": { backgroundColor: "#FF3333", color: "black" },
  "8": { backgroundColor: "#FF33FF", color: "white" },
  "9": { backgroundColor: "#33FF33", color: "black" },
};

const getAvatarStyles = (letter: string): { backgroundColor: string; color: string } => {
  const upperCaseLetter = letter.toUpperCase();
  return colors[upperCaseLetter] || { backgroundColor: "#CCCCCC", color: "black" }; // Default styles
};

export default getAvatarStyles;