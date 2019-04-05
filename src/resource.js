import EventEmitter from 'eventemitter3'

const RESOURCE_TYPE = {
  IMAGE: 'IMAGE',
  TEXT: 'TEXT',
  JSON: 'JSON',
  SPRITESHEET: 'SPRITESHEET',
  SPINE: 'SPINE',
  FONT: 'FONT',
  UNKNOWN: 'UNKNOWN',
}
const RESOURCE_STATE = {
  ERROR: -1,
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  COMPLETE: 3,
}

class Resource extends EventEmitter {
  constructor(arg) {
    super()

    this.chunk = 1
    this.completeChunk = 0
    this.state = RESOURCE_STATE.INIT

    const params = typeof arg === 'string' ? { url: arg } : arg
    Object.assign(this, params)
    this.type = params.type || Resource.determineResourceType(params)
    this.name = params.name || params.url

    this.promise = new Promise((resolve, reject) => {
      this.resolve = () => {
        this.completeChunk = this.chunk
        this.state = RESOURCE_STATE.COMPLETE
        this.emit('complete')
        resolve(this)
      }
      this.reject = (err) => {
        this.state = RESOURCE_STATE.ERROR
        this.emit('reject')
        reject(this)
      }
    })
  }

  get complete() {
    return this.state === RESOURCE_STATE.COMPLETE
  }

  get progressing() {
    return this.state > RESOURCE_STATE.INIT && this.state < RESOURCE_STATE.COMPLETE
  }
}

function determineResourceType(params) {
  const { url } = params
  if (url.match(/\.json$/)) return RESOURCE_TYPE.JSON
  if (url.match(/\.png|\.jpg|\.jpeg|\.svg/)) return RESOURCE_TYPE.IMAGE
  if (url.match(/^data:image/)) return RESOURCE_TYPE.IMAGE
  if (url.match(/\.atlas/)) return RESOURCE_TYPE.TEXT
  return RESOURCE_TYPE.UNKNOWN
}

Resource.determineResourceType = determineResourceType
Resource.RESOURCE_STATE = RESOURCE_STATE
Resource.RESOURCE_TYPE = RESOURCE_TYPE

export {
  RESOURCE_STATE,
  RESOURCE_TYPE,
}

export default Resource
