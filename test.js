require('./env/brower-pixi.js')
const loader = require('./index')

let urls = []

test('loader', async () => {
  const res = await loader.load({ url: urls[0] }).promise
})
