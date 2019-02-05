const EventEmitter = require('eventemitter3')
const compose = require( 'koa-compose')
const Resource = require( './resource.js')

const { RESOURCE_STATE, RESOURCE_TYPE } = Resource

class Loader extends Resource {
  constructor() {
    super({ type: 'LOADER' })
    this.groups = {}
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

  _normalize(params) {
    let res = params instanceof Resource ? params : new Resource(params)
    res = this.resources[res.name] || res
    this.resources[res.name] = res
    return res
  }

  add(params) {
    if (this.progressing) {
      throw new Error('add resource when progressing')
    }
    const res = this._normalize(params)
    if (this.queue.indexOf(res) > -1) return res
    this.queue.push(res)
    return res
  }

  run() {
    const { resources, queue } = this
    queue.forEach(res => {
      if (res.complete) return
      this.load(res)
    })
  }

  load(params) {
    const res = this._normalize(params)
    if (res.progressing) return res

    res.state = RESOURCE_STATE.LOADING
    this.resources[res.name] = res
    this.handle({ res, loader: this })
    return res
  }

  group(name) {
    if (this.groups[name]) return this.groups[name]
    const g = new Group(name, this)
    this.groups[name] = g
    return g
  }
}

class Group extends Resource {
  constructor(name, loader) {
    super({ type: 'GROUP' })
    this.queue = []
    this.name = name
    this.loader = loader
  }

  get resources() {
    return this.loader.resources
  }

  add(params) {
    const res = this.loader._normalize(params)
    if (this.queue.indexOf(res) > -1) return res
    this.queue.push(res)
    return res
  }

  run() {
    const { queue, loader } = this
    Promise.all(queue.map(res => loader.load(res).promise))
    .then(() => {
      this.emit('complete')
      this.resolve()
    })
  }
}

const loader = new Loader()

module.exports = loader
module.exports.Loader = Loader
