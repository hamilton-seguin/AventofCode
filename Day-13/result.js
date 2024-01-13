import fs from "fs";

const data = fs.readFileSync("test.txt", { encoding: "utf8" });

const lines = data.split("\n");
// console.log("lines", lines);

const blocks = [];
let currentGroup = [];

for (let line of lines) {
  line !== ""
    ? currentGroup.push(line)
    : currentGroup.length > 0 &&
      blocks.push(currentGroup) &&
      (currentGroup = []);
}
currentGroup.length > 0 && blocks.push(currentGroup);
console.log(blocks);

// function findHorizontalSymmetry(block) {
//   let foundSymmetry = false;
//   let removedSymb = 0;
//   let symmetryIndex = 0;
//   for (let line of block) {
//     let symbols = line.split("");
//     while (!foundSymmetry && symbols.length > 0) {
//       let halfLength = Math.floor(symbols.length / 2);
//       if (symbols[0] === symbols[symbols.length - 1]) {
//         let isSymmetric = true;
//         for (let i = 0; i < halfLength; i++) {
//           if (symbols[i] !== symbols[symbols.length - 1 - i]) {
//             isSymmetric = false;
//             break;
//           }
//         }
//         if (isSymmetric) {
//           foundSymmetry = true;
//           symmetryIndex = halfLength + removedSymb;
//           break;
//         }
//       }
//       symbols.splice(0, 1);
//       removedSymb++;
//     }
//     if (!foundSymmetry) {
//       return 0;
//     }
//     if (foundSymmetry) {
//       let nextLineSymbols = line.split("");
//       nextLineSymbols.splice(0, removedSymb);
//       if (nextLineSymbols[0] !== nextLineSymbols[nextLineSymbols.length - 1]) {
//         return 0;
//       }
//     }
//   }
//   return symmetryIndex;
// }

function findHorizontalSymmetry(block) {
  let removedSymb = 0;
  for (let line of block) {
    let symbols = line.split("");
    let halfLength = Math.floor(symbols.length / 2);
    let isSymmetric =
      symbols.slice(0, halfLength).join("") ===
      symbols.slice(-halfLength).reverse().join("");
    while (symbols.length > 0) {
      if (isSymmetric) break;
      symbols.shift();
      removedSymb++;
    }
    if (isSymmetric) {
      let nextLineSymbols = line.split("");
      nextLineSymbols.splice(0, removedSymb);
      if (nextLineSymbols[0] !== nextLineSymbols[nextLineSymbols.length - 1]) {
        return 0;
      }
      return halfLength + removedSymb;
    }
  }
  return 0;
}

const resultP1 = blocks.map((block, i) => {
  let total = 0;
  const symmetryIndex = findHorizontalSymmetry(block);
  console.log(`block ${i} symmetryIndex`, symmetryIndex);
  symmetryIndex ? (total += symmetryIndex) : total;
  return total;
});
console.log("resultP1", resultP1);
