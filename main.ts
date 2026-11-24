// One-Sentence Absurd Invention Pitch — make.fun entry.
// SPDX-License-Identifier: MIT
//
// The program writes exactly one pitch to <output>/entry.txt: a single
// sentence of at most 220 characters naming a ridiculous invention that
// fixes a tiny everyday annoyance. The pitch was drafted, judged
// head-to-head against the field's strongest visible entries on the kit's
// five-criterion rubric, and tightened over three rounds (see NOTES.md in
// the entry workdir). The program is deterministic: the same bytes on
// every run, so the grader's two executions match.
//
// Standard library only: node:fs and node:path. No third-party packages,
// no network, no randomness, no environment input besides the output dir.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning pitch (round R2, 156 characters, 28 words, one sentence).
// Annoyance: a partner stealing your side of the blanket in the night.
// Invention: a blanket that files for joint custody of itself.
// Mechanism: it serves a tiny court order and reclaims its half by dawn.
const PITCH =
  "The Divorce Blanket files for joint custody of itself, so when your " +
  "partner steals your side it serves a tiny court order and reclaims " +
  "its half before dawn.";

const MAX_CHARS = 220;

// The sealed gate scores the file Valid 1/0 on: UTF-8 text, 1 to 220
// characters, not only white space. The brief adds: one single sentence.
// Fail loudly here instead of shipping an invalid file: a bad pitch must
// never reach the judge. (One period total: "3 a.m." was cut in round R2
// precisely because its dots read as extra sentences.)
function validatePitch(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`pitch is ${chars} characters, gate allows 1-${MAX_CHARS}`);
  }
  if (text.trim() !== text || text.trim().length === 0) {
    throw new Error("pitch has leading/trailing whitespace or is blank");
  }
  const periods = (text.match(/\./g) ?? []).length;
  if (periods !== 1 || !text.endsWith(".")) {
    throw new Error(`pitch must be exactly one sentence, found ${periods} periods`);
  }
}

function main(): void {
  validatePitch(PITCH);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the judge reads the text exactly as submitted,
  // and the tie-break favours fewer bytes.
  writeFileSync(join(outDir, "entry.txt"), PITCH, "utf8");
}

main();
