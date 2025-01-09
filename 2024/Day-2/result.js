import { readFile } from 'fs'
import { logToFile } from '../../utils.js'

readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const testArray = [
    // '7 6 4 2 1',
    // '1 2 7 8 9',
    // '9 7 6 2 1',
    // '1 3 2 4 5',
    // '8 6 4 4 1',
    // '1 3 6 7 9',
    '6 4 7 8 10 11', // unsafe at i[0]
  ]

  const lines =
    testArray
    // data.split('\n')
      .map((line) => line.split(' '))
      .map((line) => line.map(Number))

  const safe = lines.map((line) => {
    logToFile('\n')
    logToFile(line)

    let direction = '-'
    let unsafeOccurence = 0

    for (let i = 0; i < line.length - 1; i++) {
      const current = line[i]
      const next = line[i + 1]
      const diff = current - next
      const diff2 = current - line[i + 2]

      const unsafeTest = (diffTest) =>
        diffTest === 0 ||
        Math.abs(diffTest) >= 4 ||
        (direction === 'up' && diffTest > 0) ||
        (direction === 'down' && diffTest < 0)

      logToFile(
        `i = ${i}`,
        current,
        next,
        'diff = ',
        diff,
        'prev direction: ',
        direction,
        'new direction: ',
        diff > 0 ? 'down' : 'up',
        unsafeTest(diff) ? 'unsafe' : ''
      )

      if (unsafeTest(diff)) {
        // return 0 // -> P1
        unsafeOccurence++

        if (unsafeOccurence > 1) {
          logToFile('UnsafeOccurence P2', unsafeOccurence)
          return 0
        }

        if (i + 2 >= line.length) {
          logToFile('Safe', 'unsafeOccurence:', unsafeOccurence)
          return 1
        }
        // logToFile(i + 2)
        logToFile('testing diff2 with :', current, line[i + 2])
        if (unsafeTest(diff2)) {
          logToFile(
            '=> ',
            current,
            line[i + 2],
            'diff2 = ',
            diff2,
            diff2 > 0 ? 'down' : 'up',
            unsafeTest(diff2) ? 'unsafe' : ''
          )
          unsafeOccurence++
          logToFile('Unsafe P2', 'unsafeOccurence:', unsafeOccurence)
          return 0
        } else {
          logToFile('Spliced', line[i + 1], 'from :', line)
          line.splice(i + 1, 1)
          i--
          continue
        }
      }

      diff > 0 ? (direction = 'down') : (direction = 'up')

      if (i + 1 === line.length - 1) {
        logToFile('line', line)

        logToFile('Safe', 'unsafeOccurence:', unsafeOccurence)
        return 1
      }
      logToFile('current', current, 'next', next)
    }

    logToFile('Unsafe', 'unsafeOccurence:', unsafeOccurence)
    return 0
  })

  const result = safe.reduce((acc, curr) => acc + curr, 0)
  logToFile(result) // P1 631
  logToFile('lines.length', lines.length)

  // Part 2
})
