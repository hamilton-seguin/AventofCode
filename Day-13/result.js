import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);