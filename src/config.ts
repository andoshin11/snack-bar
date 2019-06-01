import * as fs from 'fs'
import * as path from 'path'
import { RCJSON } from './types'

const CONFIG_FILE_NAME = '.testcaferc.json'

export function getConfig(currentDir: string): Partial<RCJSON> {
  const configPath = path.resolve(currentDir, CONFIG_FILE_NAME)

  if (!fs.existsSync(configPath)) return {}
  const configFile = fs.readFileSync(configPath, 'utf8')

  return JSON.parse(configFile) as RCJSON
}
