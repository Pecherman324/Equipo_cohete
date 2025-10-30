import test from "node:test";
import assert from "node:assert/strict";
import { generateGreeting } from "../src/lib/greet.js";

test("generateGreeting returns default when empty", () => {
  assert.equal(generateGreeting(""), "Hola, Mundo!");
});

test("generateGreeting interpolates name", () => {
  assert.equal(generateGreeting("Cesar"), "Hola, Cesar!");
});



