import fs from "fs";
function main() {
    //som en sträng
    const content = fs.readFileSync("./moviesSchema.json", { encoding: "utf-8" });
    console.log("ettan" + content);

    //som ett objekt
    const obj = JSON.parse(content);
    console.log("pars" + obj.graphDescription.nodeSpecs[0]);
    console.log(obj.graphDescription.nodeSpecs[1]);
}
main();