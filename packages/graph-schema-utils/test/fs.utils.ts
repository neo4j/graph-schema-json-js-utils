import fs from "fs";

export function readFile(filename: string) {
  return fs.readFileSync(filename, { encoding: "utf-8" });
}
