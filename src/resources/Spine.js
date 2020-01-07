import Resource, { RESOURCE_TYPE } from '../resource.js'
import { request } from '../requesters'
import Texture from './Texture.js'
import JSONResource from './JSON.js'
import TextResource from './Text.js'
import path from 'path'
//import { TextureAtlas } from 'pixi-spine/bin/core/TextureAtlas'
//import { AtlasAttachmentLoader } from 'pixi-spine/bin/core/AtlasAttachmentLoader'
//import { SkeletonJson } from 'pixi-spine/bin/core/SkeletonJson'

import spine from 'pixi-spine.es'
// FIXME now need expose spine
const { TextureAtlas, AtlasAttachmentLoader, SkeletonJson } = spine.core

export default class Spine extends Resource {
  type = RESOURCE_TYPE.SPINE

  constructor({ name, url, json, atlas, images }) {
    super()
    json = json || url
    const ext = path.extname(json)
    this.name = name || path.basename(json, ext)
    this.json = json
    this.atlas = atlas
    this.images = images
    this.chunk = 4
  }

  async request(ctx, next) {
    const { loader, res } = ctx
    const { json, atlas, images = {} } = res

    async function textureLoader(path, callback) {
      const img = images[path] || path
      const item = await loader.load(new Texture(img)).promise
      callback(item.texture.baseTexture)
    }

    const config = await loader.load(new JSONResource(json)).promise
    this.completeChunk++
    const atlasPath = atlas || json.replace(/\.json$/, '.atlas')
    const atlasRes = await loader.load(new TextResource(atlasPath)).promise
    this.completeChunk++
    new TextureAtlas(atlasRes.source, textureLoader, spineAtlas => {
      const attachmentLoader = new AtlasAttachmentLoader(spineAtlas)
      const json = new SkeletonJson(attachmentLoader)
      const skeletonData = json.readSkeletonData(config.data)
      res.spineData = skeletonData
      res.spineAtlas = spineAtlas
      next()
    })
  }
}
