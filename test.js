const { parse, format } = require("./dist/index");

console.log("=== Duration Parser Demo ===\n");

const testCases = [
  "2h30m",
  "1.5 days",
  "90s",
  "1w2d",
  "PT2H30M",
  "P1DT3H45M30S",
];

for (const input of testCases) {
  const ms = parse(input);
  const compact = format(ms);
  const long = format(ms, { long: true });
  console.log(`Parse "${input}" -> ${ms}ms`);
  console.log(`  Compact: ${compact}`);
  console.log(`  Long: ${long}\n`);
}

const original = "3d4h15m";
const parsed = parse(original);
const formatted = format(parsed);
console.log(`Round-trip: "${original}" -> ${parsed}ms -> "${formatted}"`);
