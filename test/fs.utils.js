import fs from "fs";

export function readFile(filename) {
  return fs.readFileSync(filename, { encoding: "utf-8" });
}
