const resolvePromise = (ctx, next) => {
  const { loader, res } = ctx
  res.resolve()
}

export default resolvePromise
