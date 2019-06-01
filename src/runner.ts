import createTestCafe from 'testcafe'

export async function createRunner() {
  const _createTestCafe = require('testcafe') as typeof createTestCafe

  const testcafe = await _createTestCafe()
  const runner = await testcafe.createRunner()
  return runner
}
