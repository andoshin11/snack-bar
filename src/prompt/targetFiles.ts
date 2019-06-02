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
  const { fixtures, meta } = parseTargets(_src)
  let fixtureNames: string[] = []

  const { selectFrom } = await prompt<{ selectFrom: string }>({
    type: 'select',
    choices: [
      {
        name: 'From meta',
        value: 'meta'
      },
      {
        name: 'List all fixtures',
        value: 'all'
      }
    ],
    message: 'Select type.',
    name: 'selectFrom',
  })

  if (selectFrom === 'From meta') {
    const { metaKey } = await prompt<{ metaKey: string }>({
      type: 'select',
      choices: Object.keys(meta),
      message: 'Select meta key',
      name: 'metaKey',
    })

    const { metaValue } = await prompt<{ metaValue: string }>({
      type: 'select',
      choices: Object.keys(meta[metaKey]),
      message: 'Select meta key',
      name: 'metaValue',
    })

    fixtureNames = meta[metaKey][metaValue]
  } else {
    fixtureNames = Object.keys(fixtures)
  }

  const selectList = fixtureNames.map(name => `${name}:\n    - ${fixtures[name].testNames.join('\n    - ')}`)

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
  const input = await prompt<{ fixtureNames: string[] }>({
    type: 'multiselect',
    choices: selectList,
    message: 'Choose fixture names to run',
    name: 'fixtureNames',
    result: parseInput,
    format: parseInput
  })

  const fileNames = input.fixtureNames.map(name => fixtures[name]['fileName'])
  return fileNames
}

export default selectTargetFiles
