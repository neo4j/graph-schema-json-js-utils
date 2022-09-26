import fs from "fs";
function main() {
    const content = fs.readFileSync("./schema.json", { encoding: "utf-8" });
    console.log(content);

    const obj = JSON.parse(content);
    console.log(obj.graphDescription.nodeSpecs[0]);
}
main();
