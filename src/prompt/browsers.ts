import { prompt } from 'enquirer'
import { Browser } from '../types'
import { BROWSERS, DEVICES } from '../const'

async function selectBrowsers(browsers?: Browser | Browser[]): Promise<string | string[]> {
  if (browsers) {
    console.log(`Target Browser found in config. \u001b[36m(${browsers})\u001b[0m`)
    return browsers
  }

  const input = await prompt<{ browsers: Browser[] }>({
    type: 'multiselect',
    choices: BROWSERS,
    message: 'Choose browsers',
    name: 'browsers',
  })

  const useHeadless = await Promise.all(input.browsers.map(configureHeadless))
  const useEmulate = await Promise.all(useHeadless.map(configureEmulate))
  return useEmulate
}

async function configureHeadless(browser: Browser): Promise<string> {
  if (browser !== 'chrome' && browser !== 'firefox') return browser

  const { useHeadless } = await prompt<{ useHeadless: Boolean }>({
    type: 'confirm',
    message: 'Use Headless mode?',
    name: 'useHeadless'
  })

  return useHeadless ? `${browser}:headless` : browser
}

async function configureEmulate(browser: string): Promise<string> {
  if (!browser.match(/^chrome.*/)) return browser

  const { device } = await prompt<{ device: string }>({
    type: 'select',
    choices: DEVICES,
    message: 'Choose a device',
    name: 'device',
  })

  return `${browser}:emulation:device=${device}`
}

export default selectBrowsers
