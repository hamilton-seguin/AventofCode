"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
(0, fs_1.readFile)('2024/Day-1/input.txt', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    var numbers = data.split(/\s+/).filter(Boolean).map(Number);
    var evenArray = numbers
        .filter(function (_, index) { return index % 2 === 0; })
        .sort(function (a, b) { return a - b; });
    var oddArray = numbers
        .filter(function (_, index) { return index % 2 !== 0; })
        .sort(function (a, b) { return a - b; });
    var resultP1 = evenArray.reduce(function (acc, evenNum, index) {
        var oddNum = oddArray[index];
        return acc + Math.abs(evenNum - oddNum);
    }, 0);
    // console.log(resultP1) //1722302
    var similarityScore = [];
    var _loop_1 = function (i) {
        similarityScore.push(oddArray.filter(function (num) { return num === evenArray[i]; }).length * evenArray[i]);
    };
    for (var i = 0; i < evenArray.length; i++) {
        _loop_1(i);
    }
    var resultP2 = similarityScore.reduce(function (acc, score) { return acc + score; }, 0);
    console.log(resultP2);
});
