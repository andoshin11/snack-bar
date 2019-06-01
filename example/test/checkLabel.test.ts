import { Selector } from 'testcafe';

fixture('My fixture').page('https://devexpress.github.io/testcafe/example/')

test('My first test', async t => {
  await t
    .expect(Selector('h1').withText('Example').textContent).eql('Example')
});