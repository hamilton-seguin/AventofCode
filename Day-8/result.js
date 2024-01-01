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
// console.log("nodes", nodes);

// Loop through nodes following instructions
function followInstructionsP1(instructions, nodes) {
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
const resultP1 = followInstructionsP1(instructions, nodes);
console.log("resultP1", resultP1);

// Part 2
// Find all nodeNames ending in A
const startingNodes = nodes.filter((node) => node.nodeName.endsWith("A"));
// console.log("startingNodes", startingNodes);

// Loop through nodes following instructions
function followInstructionsP2(instructions, nodes) {
  let nodesMap = new Map(nodes.map((node) => [node.nodeName, node]));
  let stepsArray = [];
  for (let startingNode of startingNodes) {
    let currentNodes = new Set([startingNode]);
    let nextNodes = new Set();
    let steps = 0;
    while (true) {
      for (let instruction of instructions) {
        for (let currentNode of currentNodes) {
          let nextNode = nodesMap.get(currentNode[instruction]);
          nextNodes.add(nextNode);
        }
        if (nextNodes.size === currentNodes.size) {
          [currentNodes, nextNodes] = [nextNodes, currentNodes];
          nextNodes.clear();
          steps++;
        }
      }
      if (Array.from(currentNodes).every((node) => node.nodeName.endsWith("Z"))) {
        stepsArray.push(steps);
        break;
      }
    }
  }
  return stepsArray;
}

// Calculate the least common multiple of the numbers of steps for each starting node
  // greatest common divisor
function gcd(a, b) {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}
  // least common multiple
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmArray(numbers) {
  let multiple = 1;
  for (let number of numbers) {
    multiple = lcm(multiple, number);
  }
  return multiple;
}

const stepsArray = followInstructionsP2(instructions, nodes);

const resultP2 = lcmArray(stepsArray);
console.log("resultP2", resultP2);