import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'
import Texture from './Texture.js'
import JSONResource from './JSON.js'
import path from 'path'

export default class Spritesheet extends Resource {
  type = RESOURCE_TYPE.SPRITESHEET

  constructor({ url, json, image }) {
    super()
    this.chunk = 3
    json = json || url
    const ext = path.extname(json)
    this.name = path.basename(json, ext)
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
    res.spritesheet = new PIXI.Spritesheet(image.texture.baseTexture, config.data)
    res.spritesheet.parse(next)
  }
}
