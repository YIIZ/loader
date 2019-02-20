const resolvePromise = (ctx, next) => {
  const { loader, res } = ctx
  res.resolve()
}

module.exports = resolvePromise
