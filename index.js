const EventEmitter = require('eventemitter3')
const compose = require( 'koa-compose')
const Resource = require( './resource.js')

const { RESOURCE_STATE, RESOURCE_TYPE } = Resource

class Loader extends Resource {
  constructor() {
    super({ type: 'LOADER' })
    this.groups = {}
    this.resources = {}
    this.timeout = 3000
    this._middlewares =[]
    this._queue = []
    this._links = {}
  }

  use(...fn) {
    if (this.progressing) {
      throw new Error('add middleware when progressing')
    }
    this._middlewares.push(...fn)
    this.handle = compose(this._middlewares)
  }

  _normalize(params) {
    let res = params instanceof Resource ? params : new Resource(params)
    res = this.resources[res.name] || res
    this.resources[res.name] = res
    return res
  }

  _link(res) {
    this._links[res.name] = this._links[res.name] || 0
    this._links[res.name]++
  }

  _unlink(res) {
    this._links[res.name]--
  }

  add(params) {
    if (this.progressing) {
      throw new Error('add resource when progressing')
    }
    const res = this._normalize(params)
    if (this._queue.indexOf(res) > -1) return res
    res.on('update', this.emitUpdate, this)
    res.on('complete', this.emitUpdate, this)
    this._queue.push(res)
    return res
  }

  emitUpdate() {
    const all = this._queue.reduce((s, v) => s + v.chunk, 0)
    const complete = this._queue.reduce((s, v) => s + v.completeChunk, 0)
    this.emit('update', { progress: complete / all * 100 })
  }

  remove(params) {
    if (this.progressing) {
      throw new Error('remove resource when progressing')
    }
    const res = this._normalize(params)
    if (this._links[res.name] > 0) {
      console.error(res.name, 'has link')
    }
    delete this.resources[res.name]
    delete this._links[res.name]
    const index = this._queue.indexOf(res)
    if (index > -1) this._queue.splice(index, 1)
    return res
  }

  run() {
    const { resources, _queue } = this
    Promise.all(_queue.map(res => loader.load(res).promise))
    .then(() => {
      this.resolve()
      this._queue.length = 0
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
    this.name = name
    this.loader = loader
    this._queue = []
  }

  get resources() {
    return this.loader.resources
  }

  add(params) {
    const { loader, _queue } = this
    const res = loader._normalize(params)
    if (_queue.indexOf(res) > -1) return res
    loader._link(res)
    _queue.push(res)
    return res
  }

  run() {
    const { _queue, loader } = this
    Promise.all(_queue.map(res => loader.load(res).promise))
    .then(() => {
      this.resolve()
      this._queue.length = 0
    })
  }

  unique() {
    const { loader, _queue } = this
    return _queue.filter((res) => loader._links[res.name] === 1)
  }

  destory() {
    const { loader, _queue } = this
    _queue.forEach((res) => {
      loader._unlink(res)
      if (loader._links[res] > 0) return
      loader.remove(res)
    })
  }
}

// TODO children resource

const loader = new Loader()

module.exports = loader
module.exports.Loader = Loader
