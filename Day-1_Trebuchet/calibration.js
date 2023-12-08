const fs = require("fs");

const numbersInLetters = [
  { one: 1 },
  { two: 2 },
  { three: 3 },
  { four: 4 },
  { five: 5 },
  { six: 6 },
  { seven: 7 },
  { eight: 8 },
  { nine: 9 },
];

// Iterate through the array and replace words with their numeric values
function replaceNumericValues(inputString) {
  numbersInLetters.forEach((numberObj) => {
    const word = Object.keys(numberObj)[0];
    const numericValue = numberObj[word];
    const regex = new RegExp(word, "g");
    inputString = inputString.replace(regex, (match) => {
      const firstLetter = match[0];
      const lastLetter = match[match.length - 1];
      return `${firstLetter}${numericValue}${lastLetter}`;
    });
  });
  return inputString;
}

let lineNumbers;
let lineResult;

fs.readFile("calibration-value.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Splitting the data into an array of strings
  const lines = data.split("\n");

  // Retreiving the numbers from each line
  lineNumbers = lines.map((line) => {
    const replacedNumbers = replaceNumericValues(line);
    const allLineNumbers = replacedNumbers.match(/\d+/g).map(Number);
    const allDigits = allLineNumbers.join("").split("").map(Number);
    return allDigits;
  });
  console.log("lineNumbers", lineNumbers);

  // Concatenating the numbers from each line
  lineResult = lineNumbers.map((line) => {
    let a = line[0].toString();
    let b = line[line.length - 1].toString();
    if (line.length - 1 === 0) {
      return a + a;
    }
    return a + b;
  });
  lineResult = lineResult.map(Number);
  console.log("lineResult", lineResult);

  // Adding up the final result
  const finalResult = lineResult.reduce((a, b) => a + b, 0);

  console.log("finalResult", finalResult);
});
