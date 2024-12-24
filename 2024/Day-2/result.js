import { readFile } from 'fs'

readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data
    .split('\n')
    .map((line) => line.split(' '))
    .map((line) => line.map(Number))

  const safe = lines.map((line) => {
    let direction = ''
    for (let i = 0; i < line.length - 1; i++) {
      const diff = line[i] - line[i + 1]

      if (diff === 0 || Math.abs(diff) >= 4 || (direction === 'up' && diff > 0) || (direction === 'down' && diff < 0)) return 0

      diff > 0 ? (direction = 'down') : (direction = 'up')

      if (i + 1 === line.length - 1) return 1
    }
    return 0
  })

  const resultP1 = safe.reduce((acc, curr) => acc + curr, 0)
  // console.log(resultP1)

  // Part 2
})
