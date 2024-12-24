const { exec } = require('child_process')
const path = require('path')

const filePath = '2024/Day-1/' + process.argv[2]

if (!filePath) {
  console.error('Please provide a TypeScript file to run.')
  process.exit(1)
}

const tsFile = path.resolve(filePath)
const jsFile = tsFile.replace(/\.ts$/, '.js')

exec(`tsc ${tsFile}`, (err) => {
  if (err) {
    console.error(`Error compiling ${tsFile}:`, err)
    process.exit(1)
  }

  setTimeout(() => {
    exec(`node ${jsFile}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running ${jsFile}:`, err)
        process.exit(1)
      }

      console.log(stdout)
      console.error(stderr)
    })
  }, 1000)
})
