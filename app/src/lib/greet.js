export function generateGreeting(name) {
  const target = String(name || "").trim() || "Mundo";
  return `Hola, ${target}!`;
}



