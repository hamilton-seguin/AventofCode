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
console.log("allMaps", allMaps);

const newMap = allMaps.map((map, i) => {
  const noText = map.splice(1, allMaps[i].length - 1);
  const numbersArray = numbersToArray(noText);
  return numbersArray;
});
console.log("newMap", newMap);

function findLocation(seedArray, mapArray) {
  let seedsLocation = [];
  seedArray.forEach((seed) => {
    // console.log( "\n", "NEW SEED", seed);
    let currentSeed;
    mapArray.map((map, i) => {
      if (i === 0) currentSeed = seed;
      const mapLength = map.length;
      // console.log("next group of maps", map);
      // console.log("currentSeed", currentSeed);
      // console.log("mapLength", mapLength);
      let foundIt;
      map.forEach((map, i) => {
        if (i === 0) foundIt = false;
        if (foundIt === true) return;
        const [destination, source, range] = map;
        // console.log("currentSeed in map", currentSeed);
        // console.log("map", map);
        if (currentSeed >= source && currentSeed <= range - 1 + source) {
          const aToB = currentSeed + (destination - source);
          // console.log("A2B", aToB);
          foundIt = true;
          // console.log("foundIt", foundIt);
          return (currentSeed = aToB);
        }
        // console.log("not this map");
        if (i === mapLength - 1 && !foundIt) {
          // console.log("nextSeed = currentSeed", currentSeed);
          return currentSeed;
        }
      });
      if (i === mapArray.length - 1) {
        // console.log("final currentSeed", currentSeed);
        return seedsLocation.push(currentSeed);
      }
    });
  });
  return seedsLocation;
}

const result = findLocation(seedList, newMap);
console.log("result", result);

const closestLocation = Math.min(...result);
console.log("closestLocation", closestLocation);
