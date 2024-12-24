import fs from "fs";

const testArray = [
  "............................................................................................................................................", // 0
  "........954......104.......52......70..............206.806........708..........................217...............................440........", // 1
  ".......@...................*.............................*.664..............677................@....459.........687.........................", // 2
  "..................378.....398........548..495..........983....*................*..282.................*...........$.248.....409.......165...", // 3
  "......261........................704.&.......*................943...615.504.....6....*773..........687..../973.2*.....=.311*....*..../......", // 4
  "187..-....&...............828....*......*268..488....534.........................................................244.........722.286........", // 5
  "........663.254.723.@.......*.842....696............../...163.512&.............797.......................749................................", // 6
  "230.........*.....*.442...563...............................*.....................*716...................*...395............352..594&.......", // 7
  "...........468.522............................+33........660....&......................................891......-...#.......................", // 8
  "......929...........*261..680............-...........@.........29.312.............972.......................704.....545.56*274......537.....", // 9
  "............................................................................................................................................", // 10
];
const smallTest = [
  "............................................................................................................................................", // 0
  "............................................................................................................................................", // 1
  ".......@...................*...........................22+.664................1................@............................................", // 2
  "....................................98........................*................=......................*...........$.........................",
  ".....................................&.......*................943...............6....*..................../.....*.....=....*....*..../......",
  "............................................................................................................................................",
  "............................................................................................................................................",
  "............................................................................................................................................",
];

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");

  // remove numbers and . from the array
  const linesWithoutNumbers = lines.map((line) => line.replace(/[0-9.]/g, ""));
  // Make an Array of all the special characters
  const setOfSpecialCharacters = new Set(
    linesWithoutNumbers.join("").split("")
  );
  const specialCharacters = Array.from(setOfSpecialCharacters);
  // console.log("specialCharacters", specialCharacters);

  // Find special characters indexes
  const specialCharactersIndexes = [];
  specialCharacters.forEach((character) => {
    lines.forEach((line, index) => {
      let characterIndex = line.indexOf(character);
      while (characterIndex !== -1) {
        specialCharactersIndexes.push({
          character,
          lineIndex: index,
          characterIndex,
        });
        characterIndex = line.indexOf(character, characterIndex + 1);
      }
    });
  });
  specialCharactersIndexes.sort(
    (a, b) => a.lineIndex - b.lineIndex || a.characterIndex - b.characterIndex
  );
  // console.log("specialCharactersIndexes", specialCharactersIndexes);

  // Find if there is a number in the line above, in the current line, or the line below at the same index, +1 && -1, return number infos.
  let linesAndIndexes = [];
  specialCharactersIndexes.forEach((character) => {
    const { characterIndex, lineIndex } = character;
    const lineAbove = { lineAbove: lines[lineIndex - 1] };
    const characterIndexMinusOne = {
      characterIndexMinusOne: characterIndex - 1,
    };
    const currentLine = { currentLine: lines[lineIndex] };
    const currentCharacterIndex = { characterIndex: characterIndex };
    const lineBelow = { lineBelow: lines[lineIndex + 1] };
    const characterIndexPlusOne = { characterIndexPlusOne: characterIndex + 1 };

    // Get number and location infos
    const getNumber = (lineObj, indexObj) => {
      const lineKey = Object.keys(lineObj)[0];
      const indexKey = Object.keys(indexObj)[0];
      const line = lineObj[lineKey];
      const index = indexObj[indexKey];
      let lineOfNumber;
      if (lineKey === "lineAbove") lineOfNumber = lineIndex - 1;
      if (lineKey === "currentLine") lineOfNumber = lineIndex;
      if (lineKey === "lineBelow") lineOfNumber = lineIndex + 1;
      const coordinates = {
        character: character.character,
        lineOfCharacter: lineIndex,
        indexOfCharacter: characterIndex,
        number: Number(line[index]),
        lineOfNumber,
        indexOfNumber: index,
      };
      return !isNaN(line[index]) ? coordinates : null;
    };

    const validNumbersAndIndex = [
      getNumber(lineAbove, characterIndexMinusOne),
      getNumber(lineAbove, currentCharacterIndex),
      getNumber(lineAbove, characterIndexPlusOne),

      getNumber(currentLine, characterIndexMinusOne),
      getNumber(currentLine, characterIndexPlusOne),

      getNumber(lineBelow, characterIndexMinusOne),
      getNumber(lineBelow, currentCharacterIndex),
      getNumber(lineBelow, characterIndexPlusOne),
    ].filter((number) => number !== null);

    linesAndIndexes.push(validNumbersAndIndex);
  });
  linesAndIndexes = linesAndIndexes.flat();
  // console.log("linesAndIndexes", linesAndIndexes);

  // Filter out consecutive indexes if they are on the same line
  function removeConsecutiveIndexes(arr) {
    // Iterate in reverse order to safely remove elements from the array
    for (let i = arr.length - 1; i > 0; i--) {
      if (
        arr[i].lineOfNumber === arr[i - 1].lineOfNumber &&
        arr[i].indexOfNumber === arr[i - 1].indexOfNumber + 1
      ) {
        // console.log("arr[i]", arr[i]);
        arr.splice(i, 1);
      }
    }
  }
  removeConsecutiveIndexes(linesAndIndexes);

  linesAndIndexes.sort((a, b) => a.lineOfNumber - b.lineOfNumber);
  // console.log("linesAndIndexes after reduce", linesAndIndexes);

  // Count how many times a unique character touches a number, each character is unique if character, lineOfCharacter, indexOfCharacter are all the same
  let numberTouchList = linesAndIndexes;
  const numberTouches = numberTouchList.reduce((acc, cur) => {
    const existingIndex = acc.findIndex(
      (obj) =>
        obj.character === cur.character &&
        obj.lineOfCharacter === cur.lineOfCharacter &&
        obj.indexOfCharacter === cur.indexOfCharacter
    );
    if (existingIndex >= 0) {
      acc[existingIndex].numberTouches++;
      acc[existingIndex].numberTouched.push({
        lineOfNumber: cur.lineOfNumber,
        indexOfNumber: cur.indexOfNumber,
        number: cur.number,
      });
    } else {
      acc.push({
        character: cur.character,
        lineOfCharacter: cur.lineOfCharacter,
        indexOfCharacter: cur.indexOfCharacter,
        numberTouched: [
          {
            lineOfNumber: cur.lineOfNumber,
            indexOfNumber: cur.indexOfNumber,
            number: cur.number,
          },
        ],
        numberTouches: 1,
      });
    }
    return acc;
  }, []);
  // console.log("numberTouches", numberTouches);

  // Filter out numbers that are not touched exaclty twice
  const filteredNumberTouches = numberTouches.filter(
    (obj) => obj.numberTouches === 2
  );
  // console.log("filteredNumberTouches", filteredNumberTouches);

  // Regroup interesting indexes by line
  const newArray = linesAndIndexes.flat().reduce((acc, cur) => {
    const existingIndex = acc.findIndex(
      (obj) => obj.lineOfNumber === cur.lineOfNumber
    );
    if (existingIndex >= 0) {
      acc[existingIndex].indexOfNumber.push(cur.indexOfNumber);
    } else {
      acc.push({
        lineOfNumber: cur.lineOfNumber,
        indexOfNumber: [cur.indexOfNumber],
        number: cur.number,
      });
    }
    return acc;
  }, []);

  // Sort indexes in ascending order
  newArray.forEach((obj) => {
    obj.indexOfNumber.sort((a, b) => a - b);
  });
  // console.log("newArray", newArray);

  // Get the full number out of its index in each line
  const getNumberList = (testStrings, indexOfNumber) => {
    let fullNumber = [];
    let searchStartIndex = 0;
    while (true) {
      // Find all sequences of digits in the string from searchStartIndex
      const matches = testStrings.slice(searchStartIndex).match(/\d+/g);
      if (!matches) break;
      // Find the match that includes the known index
      for (let match of matches) {
        const matchIndex = testStrings.indexOf(match, searchStartIndex);
        if (
          matchIndex <= indexOfNumber &&
          matchIndex + match.length > indexOfNumber
        ) {
          fullNumber = match;
          break;
        }
      }
      if (fullNumber.length > 0) break;
      // If the match doesn't include the index, remove it from the string and continue searching
      searchStartIndex += matches[0].length;
    }
    return fullNumber;
  };

  // Retrieve the full numbers with their indexes
  let results = [];
  newArray.forEach((obj) => {
    const { lineOfNumber, indexOfNumber } = obj;
    indexOfNumber.forEach((index) => {
      const result = getNumberList(lines[lineOfNumber], index);
      results.push(result);
      // console.log("result loop", result);
    });
  });
  // console.log("results", results);

  let resultPart2 = [];
  filteredNumberTouches.forEach((obj) => {
    const { numberTouched } = obj;
    numberTouched.forEach((number) => {
      const { lineOfNumber, indexOfNumber } = number;
      const result = getNumberList(lines[lineOfNumber], indexOfNumber);
      resultPart2.push(result);
    });
  });
  // console.log("resultPart2", resultPart2);

  // Loop until array is empty, multiply first 2 numbers, remove them from the array, add the result to the result array
  let resultToAddUp = []
  while (resultPart2.length > 0) {
    const multiplyBySymbol = resultPart2[0] * resultPart2[1];
    resultPart2.splice(0, 2);
    resultToAddUp.push(multiplyBySymbol);
  }

  // Final result Part 2 add up
  const finalResultPart2 = resultToAddUp.reduce((a, b) => Number(a) + Number(b));
  console.log("finalResultPart2", finalResultPart2);

  // Add up final result
  const finalResult = results.reduce((a, b) => Number(a) + Number(b));
  console.log("finalResult", finalResult);
});
