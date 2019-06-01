export type Resolve<T> = T extends Promise<infer U> ? U : T

export type Browser = 'chromium' | 'chrome' | 'chrome-canary' | 'ie' | 'edge' | 'firefox' | 'opera' | 'safari'

export type ReporterOption = {
  name: string
  output?: string
}

export type VideoOption = {
  failedOnly?: boolean
  singleFile?: boolean
  ffmpegPath?: string
  pathPattern?: string
}

export type FilterOpiton = {
  test?: string
  testGrep?: string
  fixture?: string
  fixtureGrep?: string
  testMeta?: Record<string, string>
  fixtureMeta?: Record<string, string>
}

export interface RCJSON {
  browsers: Browser | Browser[]
  src: string | string[]
  reporter: string | ReporterOption | ReporterOption[]
  screenshotPath: string
  takeScreenshotsOnFails: boolean
  screenshotPathPattern: string
  videoPath: string
  videoOptions: VideoOption
  videoEncodingOptions: object
  quarantineMode: boolean
  debugMode: boolean
  debugOnFail: boolean
  skipJsErrors: boolean
  skipUncaughtErrors: boolean
  filter?: FilterOpiton
  appCommand?: string
  appInitDelay?: number
  concurrency?: number
  selectorTimeout?: number
  assertionTimeout?: number
  pageLoadTimeout?: number
  speed?: number
  port1?: number
  port2?: number
  hostname?: string
  proxy?: string
  proxyBypass?: string | string[]
  ssl?: object
  developmentMode?: boolean
  qrCode?: boolean
  stopOnFirstFail?: boolean
  color?: boolean
  noColor?: boolean
}

export interface ITargets {
  [fixtureName: string]: {
    fileName: string
    testNames: string[]
  }
}
