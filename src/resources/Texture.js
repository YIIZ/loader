import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'

export default class Texture extends Resource {
  type = RESOURCE_TYPE.IMAGE

  async request(ctx, next) {
    const { res } = ctx
    await request(ctx)
    res.texture = PIXI.Texture.fromLoader(res.source, res.url, res.name)
    next()
    return
  }
}
