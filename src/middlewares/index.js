export resolvePromise from './resolve-promise.js'
export concurrentLimit from './concurrent-limit.js'

export const resourceRequest = (ctx, next) => {
  return ctx.res.request(ctx, next)
}
