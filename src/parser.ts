import * as glob from 'glob'
import { parse } from 'acorn'
import * as fs from 'fs'
import { ITargets } from './types'

// Create target dictionary
export function parseTargets(src: string | string[]): ITargets {
  let targets: ITargets = {
    fixtures: {},
    meta: {}
  }

  // TODO: Handle multi globs
  const fileNames = glob.sync(typeof src === 'object' ? src[0] : src)

  // Parse test names and fixture name for each files
  targets = fileNames.reduce((acc, ac) => {
    const fileName = ac
    const file = fs.readFileSync(fileName, 'utf8')

    const parsed = parse(file, { sourceType: 'module' }) as any
    const fixtureName = parseFixture(parsed)
    if (!fixtureName) return acc

    const meta = parseMeta(parsed)
    const testNames = parseTests(parsed)

    // Set fixture info
    acc.fixtures = {
      ...acc.fixtures,
      [fixtureName]: {
        fileName,
        testNames
      }
    }

    //Set meta.need to be improved :(
    for (const data of Object.entries(meta)) {
      const [key, val] = data
      const fixtureNames = (acc.meta[key] ? acc.meta[key][val] || [] : [])
      fixtureNames.push(fixtureName)
      acc.meta[key] = {
        ...acc.meta[key],
        [val]: fixtureNames
      }
    }

    return acc
  }, targets)

  return targets
}

function parseFixture(parsed: any): string | null {
  const nodes = parsed['body'] || []
  const expressionStatements = getExpressionStatements(nodes)

  const findFixture = (parent: any): string | null => {
    if (!parent) return null
    const callee = parent['callee'] || {}
    const type = callee['type']
    const name = callee['name']

    if (type === 'Identifier' && name === 'fixture') {
      const argument = (parent['arguments'] || [])[0]
      return argument ? argument['value'] || null : null
    }

    return findFixture(callee['object'])
  }

  const target = expressionStatements.map(node => {
    const expression = node['expression'] || {}
    return findFixture(expression)
  }).find(Boolean)

  return target || null
}

function parseTests(parsed: any): string[] {
  const nodes = parsed['body'] || []
  const expressionStatements = getExpressionStatements(nodes)
  const targets = expressionStatements.filter(node => {
    const expression = node['expression'] || {}
    const callee = expression['callee'] || {}
    return callee['type'] === 'Identifier' && callee['name'] === 'test'
  })

  return targets.map(target => {
    const expression = target['expression'] || {}
    const argument = (expression['arguments'] || [])[0]
    if (!argument) return null
    return argument['value'] || null
  }).filter(Boolean)
}

function parseMeta(parsed: any): Record<string, string> {
  const nodes = parsed['body'] || []
  const expressionStatements = getExpressionStatements(nodes)
  const meta: Record<string, string> = {}

  const findMeta = (parent: any): void => {
    if (!parent) return
    const callee = parent['callee'] || {}
    const property = callee['property'] || {}
    const type = property['type']
    const name = property['name']

    if (type === 'Identifier' && name === 'meta') {
      const args: any[] = parent['arguments'] || []
      if (args.length < 2) return
      const key = (args[0] || {})['value']
      const val = (args[1] || {})['value']

      meta[key] = val
    }

    findMeta(callee['object'])
  }

  expressionStatements.forEach(node => {
    const expression = node['expression'] || {}
    findMeta(expression)
  })

  return meta
}

function getExpressionStatements(nodes: any[] = []) {
  return nodes.filter(node => node.type === 'ExpressionStatement')
}
