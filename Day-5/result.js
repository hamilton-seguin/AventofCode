import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

const seedList = lines[0].split(": ").splice(1)[0].split(" ").map(Number);
console.log("seedList", seedList);

/** Cut the data by map */
let currentMap = [];
let allMaps = [];

lines.forEach((line) => {
  if (line.trim() !== "") {
    currentMap.push(line);
  } else {
    if (currentMap.length > 0) {
      allMaps.push(currentMap);
      currentMap = [];
    }
  }
});
if (currentMap.length > 0) {
  allMaps.push(currentMap);
}

function removeText(str) {
  return str.splice(0, 1);
}
function numbersToArray(str) {
  const newArray = str.map((str) => {
    const string = str.split(" ");
    return string.map(Number);
  });
  return newArray;
}

// allMaps = allMaps.splice(1, allMaps.length - 1)
removeText(allMaps);
// console.log("allMaps", allMaps);

const newMap = allMaps.map((map, i) => {
  const noText = map.splice(1, allMaps[i].length - 1);
  const numbersArray = numbersToArray(noText);
  return numbersArray;
});
// console.log("newMap", newMap);

function getLocation(seedArray, mapArray) {
  let seedsLocation = [];
  seedArray.forEach((seed) => {
    let currentSeed;

    mapArray.map((map, i) => {
      if (i === 0) currentSeed = seed;
      const mapLength = map.length;
      let foundIt;

      map.forEach((map, i) => {
        if (i === 0) foundIt = false;
        if (foundIt === true) return;
        const [destination, source, range] = map;
        if (currentSeed >= source && currentSeed <= range - 1 + source) {
          const aToB = currentSeed + (destination - source);
          foundIt = true;
          return (currentSeed = aToB);
        }
        if (i === mapLength - 1 && !foundIt) return currentSeed;
      });

      if (i === mapArray.length - 1) return seedsLocation.push(currentSeed);
    });
  });
  return seedsLocation;
}

const result = getLocation(seedList, newMap);
// console.log("result", result);

const closestLocation = Math.min(...result);
console.log("result Part 1", closestLocation);

// PART 2
const newMapReverse = newMap.reverse();
console.log("newMapReverse", newMapReverse);

const minSeed = Math.min(...seedList);

let seedRanges = [];

for (let i = 0; i < seedList.length; i += 2) {
  seedRanges.push(seedList.slice(i, i + 2));
}
console.log("seedRanges", seedRanges);

const doWeHaveThatSeed = (seed) =>
  seedRanges.some(([seedStart, length]) => {
    return seedStart <= seed && seedStart + length >= seed;
  });

function getSeedGivenLocation(step) {
  for (const map of newMapReverse) {
    for (const [destination, source, length] of map) {
      if (destination <= step && destination + length > step) {
        step = source + step - destination;
        break;
      }
    }
  }
  return step;
}

let resultPart2;
for (let i = minSeed; i < 1_000_000_000; i++) {
  const seed = getSeedGivenLocation(i);
  if (doWeHaveThatSeed(seed)) {
    resultPart2 = i;
    break;
  }
}

console.log("result Part 2", resultPart2);