const concurrentLimit = (limit = 10) => {
  let count = 0
  return (ctx, next) => {
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
