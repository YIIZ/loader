// spritesheet等资源在载入时, 会load别的资源导致死锁

const concurrentLimit = (limit = 10) => {
  let count = 0
  return async (ctx, next) => {
    const check = async () => {
      if (count >= limit) {
        requestAnimationFrame(check)
      } else {
        count++
        await next()
        count--
      }
    }
    check()
  }
}

export default concurrentLimit
