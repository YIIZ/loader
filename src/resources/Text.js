import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'

export default class TextResource extends Resource {
  type = RESOURCE_TYPE.TEXT

  async request(ctx, next) {
    const { res } = ctx
    await request(ctx)
    next()
    return
  }
}
