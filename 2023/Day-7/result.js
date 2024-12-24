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
  highCard: 0,
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
  let numberOfJokers = 0;
  if (cardCount.hasOwnProperty("J")) {
    numberOfJokers = cardCount["J"];
  }
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
  return { hand, handValue: handValues[handType], bid, numberOfJokers };
};

let result = [];
hands.map((hand) => {
  result.push(whatHand(hand));
});
// result = result.filter((item) => item.hand.includes("J")); // TO REMOVE AFTER TESTING
// console.log("result", result);

//Function to filter from lowest to highest hand
function sortResultsByHandValue(results) {
  return results.sort((a, b) => a.handValue - b.handValue);
}
const sortedResult = sortResultsByHandValue(result);
// console.log("sorted result", sortedResult);

//Function to compare similar handValues
function groupResultsByHandValue(results) {
  return results
    .reduce((groups, item) => {
      const group = groups[item.handValue] || [];
      group.push(item);
      groups[item.handValue] = group;
      return groups;
    }, [])
    .filter((item) => item !== undefined);
}
const groupedResult = groupResultsByHandValue(sortedResult);
// console.log("grouped result", groupedResult);

//Reorder each similar handValue from lowest to highest hand value
const sortGroupedResult = (groupedResult, cardToValueFunction) => {
  groupedResult.forEach((group) => {
    group.sort((a, b) => {
      const aValues = a.hand.split("").map(cardToValueFunction);
      const bValues = b.hand.split("").map(cardToValueFunction);
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
const sortedGroupedResult = sortGroupedResult(groupedResult, cardToValue);
// console.log("sorted grouped result", sortedGroupedResult);

//Flatten grouped+sorted array
const flattenedResult = sortedGroupedResult.flat();
// console.log("flattened result", flattenedResult);

//Multiply each bid by the index+1
function multiplyBidsByIndex(results) {
  return results.map((item, index) => item.bid * (index + 1));
}
const multipliedResult = multiplyBidsByIndex(flattenedResult);
// console.log("multiplied result", multipliedResult);

//Sum all the multiplied bids
const resultP1 = multipliedResult.reduce((a, b) => a + b);
console.log("resultP1", resultP1);

//Part 2
// Transform handValue into new value wth Jokers
function calculateHandValue(hand) {
  let { handValue, numberOfJokers } = hand;
  if (numberOfJokers > 0) {
    if (numberOfJokers === 5) return handValue;
    if (numberOfJokers === 4) return handValue + 1;
    if (handValue === 3 && numberOfJokers === 3) return 5;
    if (handValue === 4 && numberOfJokers === 3) return 6;
    const isSpecialCase = handValue === 1 && numberOfJokers === 2;
    const isValueInRange = handValue >= 1 && handValue <= 3;
    if (isSpecialCase || !isValueInRange) {
      return handValue + numberOfJokers;
    } else {
      return handValue + 1 + numberOfJokers;
    }
  }
  return handValue;
}

const result2 = result.map((hand) => {
  const handValue = calculateHandValue(hand);
  return { ...hand, handValue };
});
// console.log("result2", result2);

// Function to filter from lowest to highest hand
const sortedResult2 = sortResultsByHandValue(result2);
// console.log("sorted result2", sortedResult2);

//Function to compare similar handValues
const groupedResult2 = groupResultsByHandValue(sortedResult2);
// console.log("grouped result2", groupedResult2);

// New values for Joker
function cardToValue2(card) {
  switch (card) {
    case "T":
      return 10;
    case "J":
      return 1;
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

//Reorder each similar handValue from lowest to highest hand value
const sortedGroupedResult2 = sortGroupedResult(groupedResult2, cardToValue2);
// console.log("sorted grouped result2", sortedGroupedResult2);

//Flatten grouped+sorted array
const flattenedResult2 = sortedGroupedResult2.flat();
console.log("flattened result2", flattenedResult2);

//Multiply each bid by the index+1
const multipliedResult2 = multiplyBidsByIndex(flattenedResult2);
console.log("multiplied result2", multipliedResult2);

//Sum all the multiplied bids
const resultP2 = multipliedResult2.reduce((a, b) => a + b);
console.log("resultP2", resultP2);