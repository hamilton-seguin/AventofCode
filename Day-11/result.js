import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

function calculateSteps(lines, expansionFactor) {
  // Identify the lines that will be expanded
  let expandedRows = lines.map((line) => !line.includes("#"));
  let expandedColumns = lines[0]
    .split("")
    .map((_, i) => !lines.some((line) => line[i] === "#"));
  // Find the coordinates of all galaxies
  let galaxies = [];
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "#") {
        galaxies.push([i, j]);
      }
    }
  });
  // Calculate the number of steps between each pair of galaxies
  let steps = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let [x1, y1] = galaxies[i];
      let [x2, y2] = galaxies[j];
      let distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      // Add the expansion factor for each expanded line that is crossed
      for (let k = Math.min(x1, x2); k <= Math.max(x1, x2); k++) {
        if (expandedRows[k]) {
          distance += expansionFactor - 1;
        }
      }
      for (let k = Math.min(y1, y2); k <= Math.max(y1, y2); k++) {
        if (expandedColumns[k]) {
          distance += expansionFactor - 1;
        }
      }
      steps.push(distance);
    }
  }
  return steps.reduce((acc, curr) => acc + curr, 0);
}
const resultP1 = calculateSteps(lines, 2);
console.log("resultP1", resultP1);
const resultP2 = calculateSteps(lines, 1000000);
console.log("resultP2", resultP2);


//! old P1
// // Expand the universe
// function expandLines(lines, expansionFactor) {
//   let expandedLines = [...lines];
//   let numberOfCopies = 0;
//   lines.forEach((line, i) => {
//     if (!line.includes("#")){
//       for (let j = 0; j < expansionFactor; j++) {
//         expandedLines.splice(i + numberOfCopies, 0, line);
//         numberOfCopies++;
//       }
//     }
//   });

//   return expandedLines;
// }

// function transposeArray(array) {
//   return array[0].map((_, i) => array.map(row => row[i]));
// }

// let expansionFactor = 2-1;
// // Expand horizontally
// let expandedLines = expandLines(lines, expansionFactor) ;
// // Split each line into an array of characters
// let expandedLinesArray = expandedLines.map(line => line.split(''));
// // Transpose the array
// let transposedLines = transposeArray(expandedLinesArray);
// // Expand vertically
// let expandedTransposedLines = expandLines(transposedLines, expansionFactor);
// // Transpose back to the original orientation
// let finalExpandedLinesArray = transposeArray(expandedTransposedLines);
// // Join each line back into a string
// let finalExpandedLines = finalExpandedLinesArray.map(line => line.join(''));
// console.log("finalExpandedLines", finalExpandedLines);

//? not needed
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
//?

// // Find the coordinates of all galaxies
// let galaxies = [];
// function findGalaxies(lines) {
//   lines.forEach((line, i) => {
//     for (let j = 0; j < line.length; j++) {
//       if (line[j] === '#') {
//         galaxies.push([i, j]);
//       }
//     }
//   });
// }
// findGalaxies(finalExpandedLines);
// // findGalaxies(lines)
// // Calculate the number of steps between each pair of galaxies
// let steps = [];
// for (let i = 0; i < galaxies.length; i++) {
//   for (let j = i + 1; j < galaxies.length; j++) {
//     let [x1, y1] = galaxies[i];
//     let [x2, y2] = galaxies[j];
//     let distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
//     steps.push(distance);
//   }
// }
// // console.log("steps", steps);

// const resultP1 = steps.reduce((acc, curr) => acc + curr, 0);
// console.log("resultP1", resultP1);
