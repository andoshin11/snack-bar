import * as path from 'path'
import * as commander from 'commander'
import { createRunner } from '../runner'
import { getConfig } from '../config'
import selectTargetFiles from '../prompt/targetFiles'
import selectBrowsers from '../prompt/browsers'

const pkg = require('../../package.json')

const receiver = async () => {
  const currentDir = process.cwd()
  const configFile = getConfig(currentDir)

  try {
    // Select Targer Files
    const fileNames = await selectTargetFiles(configFile.src)
    const srcFiles = fileNames.map(name => path.resolve(currentDir, name))

    // Select Browser
    const browsers = await selectBrowsers(configFile.browsers)

    const runner = await createRunner()
    await runner
      .src(srcFiles)
      .browsers(browsers)
      .reporter('json')
      .run()

    process.exit()
  } catch (e) {
    console.error(e)
    process.exit(2)
  }
}


commander
  .version(pkg.version)
  .description("Generate type definitions from swagger specs")
  .action(receiver)

commander.parse(process.argv)
