import { Spritesheet } from 'pixi.js'
import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'
import Texture from './Texture.js'
import JSONResource from './JSON.js'
import path from 'path'

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
    const config = await loader.load(new JSONResource(res.json)).promise
    this.completeChunk += 1
    const imgPath = res.image || config.data.meta.image
    const image = await loader.load(new Texture(imgPath)).promise
    this.completeChunk += 1
    // old version
    if (Array.isArray(config.data.frames)) {
      config.data.frames = config.data.frames
        .reduce((m, f) => (m[res.name+f.filename] = f) && m, {})
    }
    res.spritesheet = new Spritesheet(image.texture.baseTexture, config.data)
    res.spritesheet.parse(next)
  }
}
