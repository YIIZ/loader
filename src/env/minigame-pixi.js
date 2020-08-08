import loader from '../index'
import request, { setRequest, minigameRequest } from '../requesters'
import { resourceRequest, resolvePromise } from '../middlewares'

setRequest(minigameRequest)
loader.use(resourceRequest)
loader.use(resolvePromise)
