import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

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

function findEndOfMaze(lines) {
  let steps = 0;
  let currentPoint;
  currentPoint = getNextPoint(lines, startingPoint);
  while (currentPoint.value !== "S") {
    steps++;
    // console.log("currentPoint", currentPoint);
    const nextPoint = getNextPoint(lines, currentPoint);
    // console.log("nextPoint", nextPoint);
    currentPoint = nextPoint;
  }
  return steps;
}

const steps = findEndOfMaze(lines);
console.log("steps", steps);

const resultP1 = steps / 2 + 0.5;
console.log("resultP1", resultP1);
