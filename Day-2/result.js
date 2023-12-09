import fs from "fs";

const limit = { red: 12, blue: 14, green: 13 };
const testArray = [
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
];

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Format data.txt into an array of strings
  const lines = data.split("\n");

  // Divide each line into ID and sets where each set is an object with color:number pairs = { red: 3, blue: 14, green: 15 }
  const refactoredData = lines.map((line) => {
    const [id] = line.match(/\d+/);
    const sets = line
      .split(/[:;]+/g)
      .splice(1)
      .map((set) => {
        const colorNumberPairs = set.split(",");
        const colorNumberObject = {};
        colorNumberPairs.forEach((pair) => {
          const [number, color] = pair.trim().split(" ");
          colorNumberObject[color] = Number(number);
        });
        return colorNumberObject;
      });
    return { id, sets };
  });

  // PART 1 -> loop through each id, and loop through each sets and return the id of the games that are equal or under the limit
  const gameResultsUnderLimit = refactoredData
    .filter((game) =>
      game.sets.every((set) =>
        Object.keys(set).every((color) => set[color] <= limit[color])
      )
    )
    .map((game) => game.id);

  // Add up the final result of PART 1: the sum of all the IDs of the games that are equal or under the limit
  const resultPart1 = gameResultsUnderLimit.reduce(
    (a, b) => Number(a) + Number(b)
  );
  console.log("resultPart1:", resultPart1);

  //PART 2 -> group up each set by color and return the highest number of each color
  class cubeAmountPerColor {
    constructor() {
      this.id = "";
      this.red = [];
      this.blue = [];
      this.green = [];
    }
  }

  // Loop through each game and each set and push the number of cubes of each color into an array
  const cubeAmountPerColorPerGame = refactoredData.map((game) => {
    const cubeAmount = new cubeAmountPerColor();
    cubeAmount.id = game.id;
    game.sets.forEach((set) => {
      Object.keys(set).forEach((color) => {
        cubeAmount[color].push(set[color]);
      });
    });
    return cubeAmount;
  });

  // Extract only the maximum number of cubes of each color per game and multiply each color for each game
  const minimumCubeAmountPerGameSquared = cubeAmountPerColorPerGame.map((game) => {
      Object.keys(game).forEach((color) => {
        game[color] = Math.max(...game[color]);
      });
      const totalForGame = game.red * game.blue * game.green;
      return totalForGame;
    }
  );

  // Add up the final result of PART 2: sum all of the minimumCubeAmountPerGameSquared
  const resultPart2 = minimumCubeAmountPerGameSquared.reduce(
    (a, b) => Number(a) + Number(b)
  );
  console.log("resultPart2:", resultPart2);
});
