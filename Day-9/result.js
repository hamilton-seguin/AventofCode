import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

const linesToNumbers = lines.map((line) =>
  line.split(" ").map((n) => parseInt(n))
);
// console.log("lines to numbers", linesToNumbers);

function allElementsAreSame(arr) {
  return new Set(arr).size === 1;
}

function calculateDifferences(arr) {
  let arrays = [arr];
  while (
    arrays[arrays.length - 1].length > 1 &&
    !allElementsAreSame(arrays[arrays.length - 1])
  ) {
    let lastArray = arrays[arrays.length - 1];
    let differences = [];
    for (let i = 1; i < lastArray.length; i++) {
      differences.push(lastArray[i] - lastArray[i - 1]);
    }
    arrays.push(differences);
  }
  return arrays;
}

function nextValue(arr) {
  let nextValue = 0;
  arr.forEach((num) => {
    nextValue += num[num.length - 1];
  });
  return nextValue;
}

const diffArray = linesToNumbers.map((line) => calculateDifferences(line));
// console.log("diffArray", diffArray);

const nextValueArray = diffArray.map((line) => nextValue(line));
// console.log("nextValueArray", nextValueArray);

const resultP1 = nextValueArray.reduce((a,b) => a+b, 0)
console.log("resultP1", resultP1);