import fs from "fs";

const limit = { red: 12, blue: 14, green: 13 };

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Format data.txt into an array of strings
  const lines = data.split("\n");

  // Divide each line into ID and sets where each set is an object with color:number pairs = { red: 3, blue: 14, green: 15 }
  const gameResults = lines.map((line) => {
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
  // console.log(gameResults[0].sets);

  // loop through each id, and loop through each sets and return the id of the games that are equal or under the limit
  const gameResultsUnderLimit = gameResults
    .filter((game) =>
      game.sets.every((set) =>
        Object.keys(set).every((color) => set[color] <= limit[color])
    ))
    .map((game) => game.id);
  // console.log(gameResultsUnderLimit);

  // add up the final result
  const finalResult = gameResultsUnderLimit.reduce((a, b) => Number(a) + Number(b));
  console.log("finalResult:", finalResult);
});
