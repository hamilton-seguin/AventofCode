import fs from "fs";

const testArray = [
  "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
  "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
  "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
  "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
  "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
  "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
];

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");
  // console.log("lines", lines);

  // split into 2 list of numbers
  const cards = lines.map((line, i) => {
    const test = line.split(":").splice(1, 1);
    const [winNumStr, myNumStr] = test[0].split("|");
    const winNum = winNumStr.trim().split(" ").map(Number);
    const myNum = myNumStr
      .trim()
      .split(" ")
      .filter((str) => str !== "")
      .map(Number);
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
  const resultPart1 = matchResult.reduce((a, b) => a + b);
  // console.log("resultPart1", resultPart1);


      // PART 2
  // refactor totalWinNum match to only be the length of match
  const winLength = totalWinNum;
  winLength.map((card) => {
    const matchLength = card.match.length;
    card.match = matchLength;
  });
  // console.log("winLength", winLength);

  // create a new array with all the card copies
  let totalCards = 0; // to keep track of all the cards that have been copied and looped through
  let initCardList = [...winLength];
  totalCards += initCardList.length;

  function loopCards(initialCards) {
    if (initialCards.length === 0) return totalCards;
    let cardCopy = [];
    initialCards.forEach((card) => {
      const { card: cardNum, match } = card;
      if (match > 0) {
        for (let i = 0; i < match; i++) {
          cardCopy.push(winLength[i + cardNum]);
          totalCards ++;
        }
      }
    });
    return loopCards(cardCopy);
  }

  const resultPart2 = loopCards(initCardList);
  console.log("resultPart2", resultPart2);
});
