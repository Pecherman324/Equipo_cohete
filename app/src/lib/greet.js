/**
 * Genera un mensaje de saludo personalizado
 * @param {string} name - Nombre a saludar (opcional)
 * @returns {string} Mensaje de saludo
 */
export function generateGreeting(name) {
  // Normalizar el nombre: convertir a string, limpiar espacios, usar "Mundo" si está vacío
  const target = String(name || "").trim() || "Mundo";
  return `Hola, ${target}!`;
}



