import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'

export default class JSONResource extends Resource {
  type = RESOURCE_TYPE.JSON

  async request(ctx, next) {
    const { res } = ctx
    await request(ctx)
    res.data = JSON.parse(res.source)
    next()
    return
  }
}
