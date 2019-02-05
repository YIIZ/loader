const { RESOURCE_TYPE } = require('../resource.js')

const jsonParser = (ctx, next) => {
  const { res } = ctx
  if (res.type  !== RESOURCE_TYPE.JSON) return next()
  res.data = JSON.parse(res.source)
  next()
}

module.exports = jsonParser
