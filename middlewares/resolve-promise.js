const resolvePromise = (ctx, next) => {
  const { loader, loader: { queue }, res } = ctx
  res.resolve()

  const done = queue.every(r => r.complete)
  if (done) {
    loader.resolve()
    queue.length = 0
  }
}

module.exports = resolvePromise
