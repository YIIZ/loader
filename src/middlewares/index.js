import resolvePromise from './resolve-promise.js'
import concurrentLimit from './concurrent-limit.js'

export const resourceRequest = (ctx, next) => {
  return ctx.res.request(ctx, next)
}
export { resolvePromise, concurrentLimit }
