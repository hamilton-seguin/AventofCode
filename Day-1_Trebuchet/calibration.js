const fs = require("fs");

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

    const allLineNumbers = line.match(/\d+/g).map(Number);
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
