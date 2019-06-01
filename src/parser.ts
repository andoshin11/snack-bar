import * as glob from 'glob'
import { parse } from 'acorn'
import * as fs from 'fs'
import { ITargets } from './types'

// Create target dictionary
export function parseTargets(src: string | string[]): ITargets {
  let targets: ITargets = {}
  const fileNames = glob.sync(typeof src === 'object' ? src[0] : src)

  // Parse test names and fixture name for each files
  targets = fileNames.reduce((acc, ac) => {
    const fileName = ac
    const file = fs.readFileSync(fileName, 'utf8')

    const parsed = parse(file, { sourceType: 'module' }) as any
    const fixtureName = parseFixture(parsed)
    if (!fixtureName) return acc

    const testNames = parseTests(parsed)

    acc[fixtureName] = {
      fileName,
      testNames
    }
    return acc
  }, {} as any)

  return targets
}

function parseFixture(parsed: any): string | null {
  const nodes = parsed['body'] || []
  const expressionStatements = getExpressionStatements(nodes)
  const target = expressionStatements.find(node => {
    const expression = node['expression'] || {}
    const callee = expression['callee'] || {}
    if (callee['type'] === 'Identifier' && callee['name'] === 'fixture') return true

    const _object = callee['object'] || {}
    const _callee = _object['callee'] || {}

    return _callee['type'] === 'Identifier' && _callee['name'] === 'fixture'
  })

  if (!target) return null

  const expression = target['expression'] || {}
  const callee = expression['callee'] || {}
  if (callee['type'] === 'Identifier' && callee['name'] === 'fixture') {
    const argument = (expression['arguments'] || [])[0]
    if (!argument) return null

    return argument['value'] || null
  }

  const _object = callee['object'] || {}
  const _callee = _object['callee'] || {}

  if (_callee['type'] === 'Identifier' && _callee['name'] === 'fixture') {
    const argument = (_object['arguments'] || [])[0]
    if (!argument) return null

    return argument['value'] || null
  }

  return null
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

function getExpressionStatements(nodes: any[] = []) {
  return nodes.filter(node => node.type === 'ExpressionStatement')
}
