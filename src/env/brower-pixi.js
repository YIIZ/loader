import loader from '../index'
import resolvePromise from '../middlewares/resolve-promise.js'

loader.afterFetch(resolvePromise)
