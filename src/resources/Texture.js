import { Texture } from 'pixi.js'
import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'

export default class TextureRes extends Resource {
  type = RESOURCE_TYPE.IMAGE

  async request(ctx, next) {
    const { res } = ctx
    await request(ctx)
    res.texture = Texture.fromLoader(res.source, res.url, res.name)
    next()
    return
  }
}
