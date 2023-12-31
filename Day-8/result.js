import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

// Part 1
// Divide direction from the rest
const instructions = lines.splice(0, 2)[0].split("");
console.log("instructions", instructions);

// Divide nodes into objects
const pattern = /(\w+)\s=\s\((\w+),\s(\w+)\)/;
const nodes = lines
  .map((line) => {
    const match = line.match(pattern);
    if (match) {
      return {
        nodeName: match[1],
        L: match[2],
        R: match[3],
      };
    }
  })
  .filter(Boolean);
console.log("nodes", nodes);

// Loop through nodes following instructions
function followInstructions(instructions, nodes) {
  let currentNode = nodes.find(node => node.nodeName === 'AAA');
  let steps = 0;
  while (true) {
    for (let instruction of instructions) {
      currentNode = nodes.find(node => node.nodeName === currentNode[instruction]);
      steps++;
      if (currentNode.nodeName === 'ZZZ') {
        return steps;
      }
    }
  }
}
const result = followInstructions(instructions, nodes);
console.log("result", result);