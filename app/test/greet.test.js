// Tests unitarios para la función generateGreeting
import test from "node:test";
import assert from "node:assert/strict";
import { generateGreeting } from "../src/lib/greet.js";

// Test: Verificar que cuando se pasa un string vacío, devuelve el saludo por defecto
test("generateGreeting returns default when empty", () => {
  assert.equal(generateGreeting(""), "Hola, Mundo!");
});

// Test: Verificar que cuando se pasa un nombre válido, lo interpola correctamente
test("generateGreeting interpolates name", () => {
  assert.equal(generateGreeting("Cesar"), "Hola, Cesar!");
});



