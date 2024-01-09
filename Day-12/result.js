import fs from "fs";

const data = fs.readFileSync("data.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

// Function to parse a row into an object
function parseRow(row) {
  let [arr, conf] = row.split(' ');
  return {
    arr: arr.split(''),
    pos: Array.from(arr.matchAll(/\?/g)).map(x => x.index),
    conf: conf.split(',').map(x => parseInt(x))
  };
}

// Function to generate a new array based on the mask
function generateArray(arr, pos, mask) {
  let arr2 = [...arr];
  console.log("arr2 bfore", arr2);
  let mask2 = mask;
  console.log("mask2", mask2);
  for (let i = 0; i < pos.length; i++) {
    arr2[pos[i]] = mask2 % 2 ? '#' : '.';
    mask2 = Math.floor(mask2 / 2);
  }
  console.log("arr2", arr2);
  return arr2;
}

// Function to check if the generated array matches the configuration
function checkArray(arr2, conf) {
  let confId = 0;
  let cnt = 0;
  let flag = true;
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === '#') {
      ++cnt;
    } else if (cnt) {
      if (confId >= conf.length || cnt !== conf[confId++]) {
        flag = false;
        break;
      }
      cnt = 0;
    }
  }
  if (cnt && (confId >= conf.length || cnt !== conf[confId++])) {
    flag = false;
  }
  return flag && confId === conf.length;
}

// Main function
function processArray(array) {
  return array
    .map(parseRow)
    .reduce((acc, { arr, pos, conf }) => {
      let confCnt = 0;
      for (let mask = 0; mask < 2 ** pos.length; mask++) {
        let arr2 = generateArray(arr, pos, mask);
        if (checkArray(arr2, conf)) {
          ++confCnt;
        }
      }
      return acc + confCnt;
    }, 0);
}

const resultP1 = processArray(lines);
console.log("resultP1", resultP1);
