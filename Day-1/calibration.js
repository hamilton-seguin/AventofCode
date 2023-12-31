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

// Replace words with their numeric values
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

// Read the file and process the data
fs.readFile("calibration-value.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Split the data into an array of strings
  const lines = data.split("\n");

  // Retrieve the numbers from each line
  const lineNumbers = lines.map((line) => {
    const replacedNumbers = replaceNumericValues(line);
    const allLineNumbers = replacedNumbers.match(/\d+/g).map(Number);
    const allDigits = allLineNumbers.join("").split("").map(Number);
    return allDigits;
  });

  // Concatenate the numbers from each line
  const lineResult = lineNumbers
    .map((line) => {
      const a = line[0].toString();
      const b = line[line.length - 1].toString();
      if (line.length - 1 === 0) {
        return a + a;
      }
      return a + b;
    })
    .map(Number);

  // Add up the final result
  const finalResult = lineResult.reduce((a, b) => a + b, 0);

  console.log("finalResult:", finalResult);
});
