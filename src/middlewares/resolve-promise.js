const resolvePromise = (ctx) => {
  const { loader, res } = ctx
  res.resolve()
}

export default resolvePromise
