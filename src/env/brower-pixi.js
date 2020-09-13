import loader from '../index'
import { resolvePromise, resourceRequest } from '../middlewares'

loader.use(resourceRequest)
loader.use(resolvePromise)
