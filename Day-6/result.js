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

let errorMargins = [];
groupedRaces.map((race) => {
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
  errorMargins.push(errorMargin);
});
// console.log("errorMargins", errorMargins);

const lenghtx2 = errorMargins.map((map, i) => {
  if (
    (map.length % 2 !== 0 && groupedRaces[i][0] % 2 !== 0) ||
    map.length % 2 === 0
  ) {
    return map.length * 2;
  }
  return map.length * 2 - 1;
});
// console.log("lenghtx2", lenghtx2);

const resultP1 = lenghtx2.reduce((a, b) => a * b);
console.log("resultP1", resultP1);

// const waysToWin = ([raceTime, record]) => {
//   let lessThanRecord = 0;
//   let pressTime = 1;
//   while (pressTime * (raceTime - pressTime) < record) {
//     lessThanRecord++;
//     pressTime++;
//   }
//   return raceTime - lessThanRecord * 2 - 1;
// };

// const result = groupedRaces.map((race) => waysToWin(race));
// console.log("result", result);
// console.log(
//   "result",
//   result.reduce((a, b) => a * b)
// );

//
