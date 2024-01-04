import fs from "fs";

const data = fs.readFileSync("test.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

//Find the starting point S coordinates
const sPos = {};
lines.some((line, index) => {
  if (line.indexOf("S") !== -1) {
    sPos.x = line.indexOf("S");
    sPos.y = index;
    return true;
  }
});
// console.log("sPos", sPos);

const startingPoint = { value: lines[sPos.y][sPos.x], x: sPos.x, y: sPos.y };
// console.log("currentPoint", startingPoint);

function tryMove(lines, currentPoint, dx, dy, direction, validChars) {
  let { x, y } = currentPoint;
  x += dx;
  y += dy;
  if (x < 0 || y < 0 || y === lines.length || x === lines[y].length || !validChars.includes(lines[y][x])) {
    return false;
  }
  return {
    value: lines[y][x],
    x: x,
    y: y,
    direction: direction,
  };
}

// Lookup table for the different directions
const directionLogic = {
  "-": (x, y, direction) => direction === "left" ? [x + 1, y, "left"] : [x - 1, y, "right"],
  "|": (x, y, direction) => direction === "up" ? [x, y + 1, "up"] : [x, y - 1, "down"],
  "7": (x, y, direction) => direction === "left" ? [x, y + 1, "up"] : [x - 1, y, "right"],
  "F": (x, y, direction) => direction === "right" ? [x, y + 1, "up"] : [x + 1, y, "left"],
  "J": (x, y, direction) => direction === "up" ? [x - 1, y, "right"] : [x, y - 1, "down"],
  "L": (x, y, direction) => direction === "up" ? [x + 1, y, "left"] : [x, y - 1, "down"],
};

function getNextPoint(lines, currentPoint) {
  let { value, x, y, direction } = currentPoint;
  if (value === "S") {
    let nextPoint = false;
    while (!nextPoint) {
      nextPoint =
        tryMove(lines, currentPoint, 1, 0, "left", ["-", "7", "J"]) ||
        tryMove(lines, currentPoint, -1, 0, "right", ["-", "F", "L"]) ||
        tryMove(lines, currentPoint, 0, 1, "up", ["|", "L", "J"]) ||
        tryMove(lines, currentPoint, 0, -1, "down", ["|", "F", "7"]);
    }
    if (nextPoint) return nextPoint;
  }
  if (value in directionLogic) {
    [x, y, direction] = directionLogic[value](x, y, direction);
  }
  if (value === ".") return console.error("Error: no path found");
  return {
    value: lines[y][x],
    x: x,
    y: y,
    direction: direction,
  };
}

let path = [];

function findEndOfMaze(lines) {
  let steps = 0;
  let currentPoint;
  currentPoint = getNextPoint(lines, startingPoint);
  while (currentPoint.value !== "S") {
    steps++; 
    path.push({x: currentPoint.x, y: currentPoint.y});
    // console.log("currentPoint", currentPoint);
    const nextPoint = getNextPoint(lines, currentPoint);
    // console.log("nextPoint", nextPoint);
    currentPoint = nextPoint;
  }
  return steps;
}

const steps = findEndOfMaze(lines);
// console.log("steps", steps);


const resultP1 = steps / 2 + 0.5;
// console.log("resultP1", resultP1);

// Part 2
path.push({x: startingPoint.x, y: startingPoint.y});
// console.log("path", path);

function markPath(lines, path) {
  let linesCopy = lines.map(line => [...line]);
  for (let point of path) {
    linesCopy[point.y][point.x] = 'X';
  }
  linesCopy = linesCopy.map((line, i) => line.map((char, j) => char === 'X' ? lines[i][j] : '.').join(''));
  return linesCopy;
}

const markedLines = markPath(lines, path);
console.log("markedLines", markedLines);



/** FLOOD FILL ALGORITHM that actually is not needed
 * 
function clearEdgeDots(markedLines) {
  const height = markedLines.length;
  const width = markedLines[0].length;
  const visited1 = Array(height).fill().map(() => Array(width).fill(false));

  // Flood fill function to find all dots connected to the edge
  function floodFill(y, x, visited) {
    if (y < 0 || x < 0 || y >= height || x >= width || visited[y][x] || markedLines[y][x] !== '.') {
      return;
    }
    visited[y][x] = true;
    floodFill(y - 1, x, visited);
    floodFill(y + 1, x, visited);
    floodFill(y, x - 1, visited);
    floodFill(y, x + 1, visited);
  }
  // Start first flood fill from all edge points
  for (let x = 0; x < width; x++) {
    floodFill(0, x, visited1);
    floodFill(height - 1, x, visited1);
  }
  for (let y = 0; y < height; y++) {
    floodFill(y, 0, visited1);
    floodFill(y, width - 1, visited1);
  }
  // Clear all dots that were visited by the first flood fill but not the second
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((markedLines[y][x] === '.' && visited1[y][x]) ) { // || (markedLines[y][x] === '.' && !visited2[y][x])
        markedLines[y] = markedLines[y].substring(0, x) + ' ' + markedLines[y].substring(x + 1);
      }
    }
  }
  return markedLines;
}

const clearedLines = clearEdgeDots(markedLines);
// console.log("clearedLines", clearedLines);
*
*/


const replacedLines = markedLines.map(line => line.replace('S', 'F'));
// console.log("replacedLines", replacedLines);

function removeOutsideDots(markedLines) {
  const height = markedLines.length;
  const width = markedLines[0].length;
  for (let y = 0; y < height; y++) {
    let inside = false;
    for (let x = 0; x < width; x++) {
      const cell = markedLines[y][x];
      if (cell === '|' || cell === 'F' || cell === '7') {
        inside = !inside;
      } else if (cell === '.' && !inside) {
        markedLines[y] = markedLines[y].substring(0, x) + ' ' + markedLines[y].substring(x + 1);
      }
    }
  }
  return markedLines;
}


const removedOutsideDots = removeOutsideDots(replacedLines);
// console.log("removedOutsideDots", removedOutsideDots);

const toAscii = removedOutsideDots.map(line => line      
  .replaceAll('|', '│')
  .replaceAll('-', '─')
  .replaceAll('L', '└')
  .replaceAll('J', '┘')
  .replaceAll('7', '┐')
  .replaceAll('F', '┌')
  .replaceAll('S', '█')).join('\n');
// console.log("toAscii\n", toAscii);

fs.writeFile('output.txt', toAscii, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});

const resultP2 = removedOutsideDots.map(line => line.split('').filter(char => char === '.').length).reduce((a, b) => a + b);
console.log("resultP2", resultP2);
