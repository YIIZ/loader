import { Spritesheet } from 'pixi.js'
import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'
import Texture from './Texture.js'
import JSONResource from './JSON.js'
import path from 'path-browserify'

export default class SpritesheetRes extends Resource {
  type = RESOURCE_TYPE.SPRITESHEET

  constructor({ name, url, json, image }) {
    super()
    this.chunk = 3
    json = json || url
    const ext = path.extname(json)
    this.name = name || path.basename(json, ext)
    this.json = json
    this.image = image
  }

  async request(ctx, next) {
    const { loader, res } = ctx
    this.jsonRes = loader.load(new JSONResource(res.json))
    const config = await this.jsonRes.promise
    this.completeChunk += 1
    res.emit('progress')
    const imgPath = res.image || config.data.meta.image
    this.imageRes = loader.load(new Texture(imgPath))
    const image = await this.imageRes.promise
    this.completeChunk += 1
    res.emit('progress')
    // old version
    if (Array.isArray(config.data.frames)) {
      config.data.frames = config.data.frames.reduce((m, f) => (m[res.name + f.filename] = f) && m, {})
    }
    res.spritesheet = new Spritesheet(image.texture.baseTexture, config.data)
    await new Promise((r) => res.spritesheet.parse(r))
    return next()
  }

  subres = (name) => {
    const res = this
    return {
      name,
      res,
      get texture() {
        return res.spritesheet?.textures?.[name]
      },
    }
  }

  texture = (name) => {
    return this.spritesheet?.textures?.[name]
  }
}
