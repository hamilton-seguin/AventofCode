import fs from "fs";

const testArray = [
  "Card   2: 17  9  7 91 32 97 76 39 83 88 | 88 25 46 50 91 18 39 76 17 22 28 82 44 66 52  7 11 56 77  9 40 83 97 32 47",
];

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");
  console.log("lines", lines);

  // split into 2 list of numbers
  const cards = lines.map((line, i) => {
    const test = line.split(":").splice(1, 1);
    const [winNumStr, myNumStr] = test[0].split("|");
    const winNum = winNumStr.trim().split(" ").map(Number);
    const myNum = myNumStr.trim().split(" ").filter((str) => str !== "").map(Number);
    return { card: i + 1, winNum, myNum };
  });
  // console.log("cards", cards);

  // find in myNum which are also winNum, return them
  const totalWinNum = cards.map((card) => {
    const { winNum, myNum } = card;
    const match = myNum.filter((num) => winNum.includes(num));
    return { card: card.card, match };
  });
  // console.log("totalWinNum", totalWinNum);

  // calculate total winNum points (1 power of match.length)
  const matchResult = totalWinNum.map((card) => {
    const { match } = card;
    if (match.length === 0) return 0;
    let points = 1;
    for (let i = 0; i < match.length - 1; i++) {
      points *= 2;
    }
    return points;
  });
  // console.log("matchResult", matchResult);

  // calculate total points
  const totalPoints = matchResult.reduce((a, b) => a + b, 0);
  console.log("totalPoints", totalPoints);
});
