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
  let mask2 = mask;
  for (let i = 0; i < pos.length; i++) {
    arr2[pos[i]] = mask2 % 2 ? '#' : '.';
    mask2 = Math.floor(mask2 / 2);
  }
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

// Part 2
// Function to parse a row into an object
function parseRowP2(row, scaleFactor) {
  let [arr, conf] = row.split(' ');
  return {
    arr: Array.from({ length: scaleFactor }, () => arr).join('?').split(''),
    conf: Array.from({ length: scaleFactor }, () => conf.split(',').map(x => parseInt(x))).flat()
  };
}

// Function to initialize the dp array
function initializeDp(n, m, p) {
  return Array.from({ length: n + 1 },
    () => Array.from({ length: m + 1 },
      () => Array.from({ length: p + 1 }, () => 0)
    )
  );
}

// Function to fill the base cases in the dp array
function fillBaseCases(dp, arr, n) {
  dp[0][0][0] = 1;
  let cnt = 0;
  for (let i = 1; i <= n; i++) {
    if (arr[i - 1] === '#') cnt++;
    else cnt = 0;
    if (cnt) dp[i][0][cnt] = 1;
  }
  for (let i = 1; i <= n; i++) {
    if (arr[i - 1] === '#') break;
    else dp[i][0][0] = 1;
  }
}

// Function to fill the rest of the dp array
function fillDp(dp, arr, conf, n, m, p) {
  for (let i = 1; i <= n; i++) {
    if (arr[i - 1] === '.') {
      for (let j = 1; j <= m; j++) {
        dp[i][j][0] = dp[i - 1][j - 1][conf[j - 1]] + dp[i - 1][j][0];
      }
    } else if (arr[i - 1] === '#') {
      for (let j = 0; j <= m; j++) {
        for (let k = 0; k < p; k++) {
          dp[i][j][k + 1] = dp[i - 1][j][k];
        }
      }
    } else {
      for (let j = 1; j <= m; j++) {
        dp[i][j][0] = dp[i - 1][j - 1][conf[j - 1]] + dp[i - 1][j][0];
      }
      for (let j = 0; j <= m; j++) {
        for (let k = 0; k < p; k++) {
          dp[i][j][k + 1] = dp[i - 1][j][k];
        }
      }
    }
  }
}

// Main function
function processRows(rows, scaleFactor) {
  return rows
    .map(row => parseRowP2(row, scaleFactor))
    .reduce((acc, { arr, conf }) => {
      let n = arr.length;
      let m = conf.length;
      let p = Math.max(...conf);
      let dp = initializeDp(n, m, p);
      fillBaseCases(dp, arr, n);
      fillDp(dp, arr, conf, n, m, p);
      return acc + dp[n][m][0] + dp[n][m - 1][conf[m - 1]];
    }, 0);
}

let scaleFactor = 5;
const resultP2 = processRows(lines, scaleFactor);
console.log("resultP2", resultP2);


// OTHER SOLUTION, much longer but more readable
// let cache = {};
// let nums = [];

// function poss(template, len, numpos) {
//   let hid = [len, numpos];
//   if (cache[hid]) return cache[hid];
//   if (
//     nums.slice(numpos).reduce((a, b) => a + b, 0) + nums.length - 1 - numpos >
//     len
//   )
//     return 0;

//   let ret = 0;
//   let num = nums[numpos];

//   if (numpos === nums.length - 1) {
//     for (let i = 0; i <= len - num; i++) {
//       if (
//         !template.slice(0, i).includes("#") &&
//         !template.slice(i, i + num).includes(".") &&
//         !template.slice(i + num).includes("#")
//       ) {
//         ret++;
//       }
//     }
//   } else {
//     if (!template.slice(0, num).includes(".") && template[num] !== "#") {
//       ret += poss(template.slice(num + 1), len - num - 1, numpos + 1);
//     }
//     if (template[0] !== "#") {
//       ret += poss(template.slice(1), len - 1, numpos);
//     }
//   }

//   return (cache[hid] = ret);
// }

// console.log(
//   lines
//     .map((line) => {
//       let [template, numsStr] = line.trim().split(" ");
//       nums = numsStr.split(",").map(Number);

//       // part 1
//       cache = {};
//       let p1 = poss(template, template.length, 0);

//       // part 2
//       template = Array(5).fill(template).join("?");
//       nums = Array(5).fill(nums).flat();
//       cache = {};
//       let p2 = poss(template, template.length, 0);

//       return [p1, p2];
//     })
//     .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
// );
