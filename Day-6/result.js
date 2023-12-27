import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

const races = lines.map((map) =>
  map.split(": ").splice(1)[0].split(/\s+/).filter(Boolean).map(Number)
);
// console.log("races", races);

let groupedRaces = races[0].map((race, i) => [race, races[1][i]]);
// console.log("groupedRaces", groupedRaces);

const halfOfWaysToWin = (race) => {
  const [raceTime, minDist] = race;
  let errorMargin = [];
  const optimalTime = Math.floor(raceTime / 2);
  for (let i = optimalTime; i > 0; i--) {
    const timeLeft = raceTime - i;
    const distance = i * timeLeft;
    if (distance <= minDist) {
      break;
    }
    errorMargin.push(i);
  }
  return errorMargin;
};

let errorMargins = [];
groupedRaces.map((race) => {
  const errorMargin = halfOfWaysToWin(race);
  errorMargins.push(errorMargin);
});
// console.log("errorMargins", errorMargins);

const normalizeResult = (arrayOfWins, groupedRacesArray) => {
  if (groupedRacesArray[0] % 2 !== 0) {
    return arrayOfWins.length * 2;
  }
  return arrayOfWins.length * 2 - 1;
};

const allWaysToWin = errorMargins.map((map, i) => {
  return normalizeResult(map, groupedRaces[i]);
});
// console.log("allWaysToWin", allWaysToWin);

const resultP1 = allWaysToWin.reduce((a, b) => a * b);
console.log("resultP1", resultP1);


// Part 2
const groupedRaces2 = races
  .map((race) => race.map(String).reduce((a, b) => a + b))
  .map(Number);
// console.log("groupedRaces2", groupedRaces2);

const errorMargins2 = halfOfWaysToWin(groupedRaces2);
// console.log("errorMargins2.length", errorMargins2.length);

const resultP2 = normalizeResult(errorMargins2, groupedRaces2);
console.log("resultP2", resultP2);
