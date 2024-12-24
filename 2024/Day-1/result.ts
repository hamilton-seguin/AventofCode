import { readFile } from 'fs'

readFile('2024/Day-1/input.txt', 'utf8', (err: any, data: string) => {
  if (err) {
    console.error(err)
    return
  }
  const numbers = data.split(/\s+/).filter(Boolean).map(Number)

  const evenArray = numbers
    .filter((_, index) => index % 2 === 0)
    .sort((a, b) => a - b)
  const oddArray = numbers
    .filter((_, index) => index % 2 !== 0)
    .sort((a, b) => a - b)

  const resultP1 = evenArray.reduce((acc, evenNum, index) => {
    const oddNum = oddArray[index]
    return acc + Math.abs(evenNum - oddNum)
  }, 0)
  // console.log(resultP1) //1722302


  // Part 2
  const similarityScore = []

  for (let i = 0; i < evenArray.length; i++) {
    similarityScore.push(
      oddArray.filter((num) => num === evenArray[i]).length * evenArray[i]
    )
  }

  const resultP2 = similarityScore.reduce((acc, score) => acc + score, 0)
  // console.log(resultP2) //20373490
})
