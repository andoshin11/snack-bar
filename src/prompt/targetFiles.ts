import { prompt } from 'enquirer'
import { parseTargets } from '../parser'

async function selectTargetFiles(src?: string | string[]) {
  let _src = src
  if (!_src) {
    const input = await prompt<{ src: string }>({
      type: 'input',
      message: 'Type test source files glob',
      name: 'src'
    })
    _src = input.src
  }

  if (!_src) throw new Error('Test source files not selected.')
  const candidates = parseTargets(_src)
  const selectList = Object.entries(candidates).map(([key, val]) => ({
    name: `${key}:\n    - ${val.testNames.join('\n    - ')}`,
    value: val.fileName
  }))

  // This function indeed only accepts string[]
  const parseInput = (input: any): any => {
    if (typeof input !== 'object') return []
    const list = input as string[]
    const parsed = list
      .map((item: string) => item.match(/^(.*):\n.*/))
      .filter(Boolean)
      .map(match => (match as RegExpMatchArray)[1])
    return parsed
  }

  // Select Targer Files
  const { fixtureNames } = await prompt<{ fixtureNames: string[] }>({
    type: 'multiselect',
    choices: selectList,
    message: 'Choose fixture names to run',
    name: 'fixtureNames',
    result: parseInput,
    format: parseInput
  })

  const fileNames = fixtureNames.map(name => candidates[name]['fileName'])
  return fileNames
}

export default selectTargetFiles
