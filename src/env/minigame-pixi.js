import loader from '../index'
import request, { setRequest, minigameRequest } from '../requesters'
import resolvePromise from '../middlewares/resolve-promise.js'

setRequest(minigameRequest)
loader.afterRequest(resolvePromise)
