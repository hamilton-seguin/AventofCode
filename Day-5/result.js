import fs from "fs";
import { nextTick } from "process";

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");
  // console.log("lines", lines);

  /**
   * Destination - Source - Range
   * const
   * if (seed >= source && seed <= range + source { return seed + (destination - source)}
   * else continue
   *
   * Create new array for each map
   * create a function that takes in a seed and goes through each array
   */

  const seedList = lines[0].split(": ").splice(1, 1)[0].split(" ").map(Number);
  // console.log("seedList", seedList);  // seedList [ 79, 14, 55, 13 ]

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
      return str.split(" ");
    });
    return newArray;
  }

  // allMaps = allMaps.splice(1, allMaps.length - 1)
  removeText(allMaps);
  // console.log("allMaps", allMaps);

  const newMap = allMaps.map((map) => {
    const noText = map.splice(1, allMaps.length - 1);
    const numbersArray = numbersToArray(noText);
    return numbersArray;
  });
  // console.log("newMap", newMap);

  const fakeSeeds = [79]
  const fakeMaps = [[[50, 98, 2], [52, 50, 48]]]
  function findLocation(seedArray, mapArray) {
    seedArray.forEach((seed) => {
      mapArray.map((map) => {
        console.log("each map", map);
        map.forEach((map) => {
          const [destination, source, range] = map;
          console.log("map", map);
          console.log("seed", seed);
          if (seed >= source && seed <= ((range-1) + source)) {
            const aToB = seed + (destination - source);
            console.log("A2B", aToB);
            return aToB
          }
          console.log("not this map");
          if (seed < source) return seed;

        });
      });
    });
  }

  // findLocation(seedList, newMap);
  findLocation(fakeSeeds, fakeMaps);

  // const seetToSoil = ["blabla", "50 98 2", "52 50 48"];
  // function findLocation(seedArray) {
  //   seedArray.map((seed) => {
  //     allMaps.forEach((map) => {});
  //   });
  // }
});
