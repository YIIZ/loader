import { RESOURCE_TYPE }  from '../resource.js'
import * as PIXI from 'pixi.js'

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

async function spineParser(ctx, next) {
  const { res, loader } = ctx
  if (res.type !== RESOURCE_TYPE.SPINE) return next()

  const spine = PIXI.spine.core
  const { url, atlas, images = {} } = res

  async function textureLoader(path, callback) {
    const img = images[path] || path
    const item = await loader.load(img).promise
    callback(item.texture.baseTexture)
  }

  const config = await loader.load({ name: `json:${url}`, url: url }).promise
  const atlasPath = atlas || url.replace(/\.json$/, '.atlas')
  const atlasRes = await loader.load(atlasPath).promise
  new spine.TextureAtlas(atlasRes.source, textureLoader, (spineAtlas) => {
    const attachmentLoader = new spine.AtlasAttachmentLoader(spineAtlas)
    const json = new spine.SkeletonJson(attachmentLoader)
    const skeletonData = json.readSkeletonData(config.data)
    res.spineData = skeletonData
    res.spineAtlas = spineAtlas
    next()
  })
}

export {
  textureParser,
  spritesheetParser,
  spineParser,
}
