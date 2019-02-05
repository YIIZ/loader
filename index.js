const EventEmitter = require('eventemitter3')
const compose = require( 'koa-compose')
const Resource = require( './resource.js')

const { RESOURCE_STATE, RESOURCE_TYPE } = Resource

class Loader extends Resource {
  constructor() {
    super({ type: 'LOADER' })
    this.resources = {}
    this.queue = []
    this.middlewares =[]
    this.timeout = 3000
  }

  use(...fn) {
    if (this.progressing) {
      throw new Error('add middleware when progressing')
    }
    this.middlewares.push(...fn)
    this.handle = compose(this.middlewares)
  }

  add(params) {
    if (this.progressing) {
      throw new Error('add resource when progressing')
    }
    const res = params instanceof Resource ? params : new Resource(params)
    if (this.resources[res.name]) return this.resources[res.name]

    this.resources[res.name] = res
    this.queue.push(res)
    return res
  }

  load(params) {
    let res = params instanceof Resource ? params : new Resource(params)
    if (this.resources[res.name]) res = this.resources[res.name]
    if (res.progressing) return res

    res.state = RESOURCE_STATE.LOADING
    this.resources[res.name] = res
    this.handle({ res, loader: this })
    return res
  }

  loadAll() {
    const { resources, queue } = this
    queue.forEach(res => {
      if (res.complete) return
      this.load(res)
    })
  }

  get(key) {

  }

  clone() {
    const m = new Loader()
    m.timeout = this.timeout
    m.use(...this.middlewares)
    return m
  }
}

const loader = new Loader()

module.exports = loader
module.exports.Loader = Loader
