// Worst AI Advice: The 48-Hour Tight Line Open — make.fun entry.
//
// The line:
//
//   Certainly! You can safely share your password if you change one
//   letter first — hackers never guess the updated version.
//
// Why this line: it is written in the confident, tidy voice of a real
// AI assistant — the breezy "Certainly!" opener, the reassuring
// "safely", the helpful fix — and then it hands the reader a
// catastrophically wrong rule: change one letter and your password is
// suddenly shareable. The joke lands on the first read because the
// logic is exactly the kind of tidy nonsense an overconfident
// assistant would produce, and it is concrete enough to follow and
// regret: one letter, one share, one hacked account. One sentence,
// 119 characters, no wasted words, no shock value for its own sake.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const line =
  "Certainly! You can safely share your password if you change one letter first — hackers never guess the updated version.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–140 characters of UTF-8 text, not only
// whitespace, on a single line — so the code enforces the shape
// too: one line, inside the limit, no leading or trailing space.
if (line.length < 1 || line.length > 140) {
  throw new Error(`entry line is ${line.length} characters, outside the 1-140 limit`);
}
if (line.trim().length === 0 || /[\r\n]/.test(line)) {
  throw new Error("entry line must be one non-blank line");
}
if (line !== line.trim()) {
  throw new Error("entry line must not start or end with whitespace");
}
// Bad advice stays tight: no doubled spaces smuggled in by an
// edit, which would read as a stumble in the middle of the line.
if (/  /.test(line)) {
  throw new Error("entry line must not contain doubled spaces");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, line, "utf8");

// Read it back and verify the file holds exactly the line, byte
// for byte, so a partial or corrupted write can never reach the
// judge — and that its byte length matches the line's own byte
// length (the em dash is multi-byte, so bytes exceed characters
// here at 121, and the check guards against a future edit silently
// changing that).
const written = readFileSync(dst, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not hold exactly the entry line");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(line, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry line");
}

console.log(line);
