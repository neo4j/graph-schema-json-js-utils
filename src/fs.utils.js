import fs from "fs";

export function readFile(filename) {
    const contents = fs.readFileSync(filename, { encoding: "utf-8" });
    let obj = JSON.parse(contents);
    return obj;
}
