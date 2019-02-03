import { Resource, Loader } from './index'
import { requestByXHR as request } from './request'

let urls = []

test('loader', async () => {
  const loader = new Loader()
  loader.use(request)
  const res = await loader.load({ url: urls[0] }).promise
});
