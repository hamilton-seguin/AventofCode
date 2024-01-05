import fs from "fs";

const data = fs.readFileSync("test.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

// Expand the universe
function expandLines(lines) {
  let expandedLines = [...lines];
  let numberOfCopies = 0;
  lines.forEach((line, i) => {
    if (!line.includes("#")){
      expandedLines.splice(i + numberOfCopies, 0, line);
      numberOfCopies++;
    }
  });
  return expandedLines;
}

function transposeArray(array) {
  return array[0].map((_, i) => array.map(row => row[i]));
}

// Expand horizontally
let expandedLines = expandLines(lines);
// Split each line into an array of characters
let expandedLinesArray = expandedLines.map(line => line.split(''));
// Transpose the array
let transposedLines = transposeArray(expandedLinesArray);
// Expand vertically
let expandedTransposedLines = expandLines(transposedLines);
// Transpose back to the original orientation
let finalExpandedLinesArray = transposeArray(expandedTransposedLines);
// Join each line back into a string
let finalExpandedLines = finalExpandedLinesArray.map(line => line.join(''));
// console.log("finalExpandedLines", finalExpandedLines);

// // Count number of galaxies //435
// function countGalaxies(lines) {
//   let count = 0;
//   lines.forEach(line => {
//     count += line.split('#').length - 1;
//   });
//   return count;
// }
// let numberOfGalaxies = countGalaxies(finalExpandedLines);
// // console.log("numberOfGalaxies", numberOfGalaxies);

// // Calculate number of pairs //94395
// function combinations(n, r) {
//   let result = 1;
//   for (let i = 0; i < r; i++) {
//     result *= (n - i) / (i + 1);
//   }
//   return result;
// }
// let numberOfPairs = combinations(numberOfGalaxies, 2);
// // console.log("numberOfPairs", numberOfPairs);

// Find the coordinates of all galaxies
let galaxies = [];
function findGalaxies(lines) {
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '#') {
        galaxies.push([i, j]);
      }
    }
  });
}
findGalaxies(finalExpandedLines);
// findGalaxies(lines)
// Calculate the number of steps between each pair of galaxies
let steps = [];
for (let i = 0; i < galaxies.length; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    let [x1, y1] = galaxies[i];
    let [x2, y2] = galaxies[j];
    let distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    steps.push(distance);
  }
}
// console.log("steps", steps);

const resultP1 = steps.reduce((acc, curr) => acc + curr, 0);
console.log("resultP1", resultP1);