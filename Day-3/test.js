function removeConsecutiveIndexes(arr) {
  // Iterate in reverse order to safely remove elements from the array
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[i].indexOfNumber === arr[i - 1].indexOfNumber + 1) {
      arr.splice(i, 1);
    }
  }
}

const linesAndIndexes = [
  { character: '-', lineOfNumber: 1, number: 5, indexOfNumber: 3 },
  { character: '-', lineOfNumber: 1, number: 2, indexOfNumber: 8 },
  { character: '-', lineOfNumber: 2, number: 5, indexOfNumber: 10 },
  { character: '-', lineOfNumber: 1, number: 5, indexOfNumber: 16 },
  { character: '-', lineOfNumber: 1, number: 2, indexOfNumber: 17 },
  { character: '-', lineOfNumber: 3, number: 5, indexOfNumber: 16 },
  { character: '-', lineOfNumber: 3, number: 2, indexOfNumber: 17 }
];

removeConsecutiveIndexes(linesAndIndexes);

console.log(linesAndIndexes);