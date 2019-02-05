const { RESOURCE_TYPE }  = require('../resource.js')
const PIXI = require('pixi.js')

const textureParser = (ctx, next) => {
  const { res } = ctx

  if (res.type !== RESOURCE_TYPE.IMAGE) return next()

  res.texture = PIXI.Texture.fromLoader(res.source, res.url, res.name)
  next()
}

async function spritesheetParser(ctx, next) {
  const { res, loader } = ctx

  if (res.type !== RESOURCE_TYPE.SPRITESHEET) return next()

  const config = await loader.load(res.url).promise
  const image = await loader.load(config.data.meta.image).promise
  res.spritesheet = new PIXI.Spritesheet(image.texture.baseTexture, config.data)
  res.spritesheet.parse(next)
}

exports.textureParser = textureParser
exports.spritesheetParser = spritesheetParser
