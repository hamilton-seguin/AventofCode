import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

const handValues = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPairs: 2,
  onePair: 1,
  highCard: 0
};

function cardToValue(card) {
  switch (card) {
    case "T":
      return 10;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    case "A":
      return 14;
    default:
      return Number(card);
  }
}

//Split hand from bid in an array
const hands = lines.map((line) => {
  const [hand, bid] = line.split(" ");
  return [hand, bid];
});
// console.log("hands", hands);

//Function to recognize what hand is it
const whatHand = (hands) => {
  const [hand, bid] = hands;
  const cards = hand.split("");
  const cardCount = {};
  cards.forEach((card) => {
    cardCount[card] = (cardCount[card] || 0) + 1;
  });
  const values = Object.values(cardCount);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const countOfPairs = values.filter((value) => value === 2).length;
  let handType;
  if (max === 5) {
    handType = "fiveOfAKind";
  } else if (max === 4) {
    handType = "fourOfAKind";
  } else if (max === 3 && min === 2) {
    handType = "fullHouse";
  } else if (max === 3) {
    handType = "threeOfAKind";
  } else if (countOfPairs === 2) {
    handType = "twoPairs";
  } else if (countOfPairs === 1) {
    handType = "onePair";
  } else {
    handType = "highCard";
  }
  return { hand, handValue: handValues[handType], bid };
};

let result = [];
hands.map((hand) => {
  result.push(whatHand(hand));
});
// console.log("result", result);

//Function to filter from lowest to highest hand
const sortedResult = result.sort((a, b) => a.handValue - b.handValue);
// console.log("sorted result", sortedResult);

//Function to compare similar handValues
const groupedResult = sortedResult
  .reduce((groups, item) => {
    const group = groups[item.handValue] || [];
    group.push(item);
    groups[item.handValue] = group;
    return groups;
  }, [])
  .filter((item) => item !== undefined);
// console.log("grouped result", groupedResult);

//Reorder each similar handValue from lowest to highest hand value
const sortGroupedResult = (groupedResult) => {
  groupedResult.forEach((group) => {
    group.sort((a, b) => {
      const aValues = a.hand.split("").map(cardToValue);
      const bValues = b.hand.split("").map(cardToValue);

      for (let i = 0; i < aValues.length; i++) {
        if (aValues[i] !== bValues[i]) {
          return aValues[i] - bValues[i];
        }
      }

      return 0;
    });
  });

  return groupedResult;
};
const sortedGroupedResult = sortGroupedResult(groupedResult);
// console.log("sorted grouped result", sortedGroupedResult);

//Flatten grouped+sorted array
const flattenedResult = sortedGroupedResult.flat();
// console.log("flattened result", flattenedResult);

//Multiply each bid by the index+1
const multipliedResult = flattenedResult.map((item, index) => {
  return item.bid * (index + 1);
});
// console.log("multiplied result", multipliedResult);

//Sum all the multiplied bids
const resultP1 = multipliedResult.reduce((a, b) => a + b);
console.log("resultP1", resultP1);
