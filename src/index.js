import EventEmitter from 'eventemitter3'
import compose from 'koa-compose'
import Resource, { determineResourceType } from './resource.js'
import { MockResource, TextResource, JSONResource, TextureResource, SpritesheetResource } from './resources'
export { MockResource, TextResource, JSONResource, TextureResource, SpritesheetResource }
import { resolvePromise } from './middlewares/resolve-promise.js'

const { RESOURCE_STATE, RESOURCE_TYPE } = Resource

export class Loader extends Resource {
  constructor() {
    super({ type: 'LOADER' })
    this.groups = {}
    this.resources = {}
    this.timeout = 3000
    this._handlers = []
    this._queue = []
    this._links = {}
  }

  use(fn) {
    if (this.progressing) {
      throw new Error('add middleware when progressing')
    }
    this._handlers.push(fn)
    this.handle = compose(this._handlers)
  }

  _structure(params) {
    if (params instanceof Resource) {
      return params
    }

    params = typeof params === 'string' ? { url: params } : params
    const type = determineResourceType(params)
    let res
    switch (type) {
      case RESOURCE_TYPE.JSON:
        res = new JSONResource(params)
        break
      case RESOURCE_TYPE.TEXT:
        res = new JSONResource(params)
        break
      case RESOURCE_TYPE.IMAGE:
        res = new TextureResource(params)
        break
      case RESOURCE_TYPE.SPRITESHEET:
        res = new SpritesheetResource(params)
        break
      case RESOURCE_TYPE.MOCK:
        res = new MockResource(params)
        break
      default:
        throw new Error('unknown resource')
    }

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
    let res = this._structure(params)
    res = this.resources[res.name] || res
    this.resources[res.name] = res

    if (this._queue.find((r) => r.name === res.name)) return res

    res.on('progress', this.emitProgress, this)
    res.on('complete', this.emitProgress, this)
    this._queue.push(res)
    this.chunk = this._queue.reduce((s, v) => s + v.chunk, 0)
    return res
  }

  emitProgress() {
    const all = this._queue.reduce((s, v) => s + v.chunk, 0)
    const complete = this._queue.reduce((s, v) => s + v.completeChunk, 0)
    this.emit('update', { progress: (complete / all) * 100 })
    this.emit('progress', { progress: (complete / all) * 100 })
  }

  remove(params) {
    if (this.progressing) {
      throw new Error('remove resource when progressing')
    }
    const res = this._structure(params)
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
    Promise.all(_queue.map((res) => loader.load(res).promise))
      .then(() => {
        this._queue.length = 0
        this.resolve()
      })
      .catch((e) => console.log(e))
  }

  request() {
    return this.run()
  }

  load(params) {
    let res = this._structure(params)
    res = this.resources[res.name] || res
    if (res.progressing) return res
    if (res.complete) return res

    res.state = RESOURCE_STATE.LOADING
    this.resources[res.name] = res
    const onerror = (err) => console.log(err)
    this.handle(new Context(res, this)).catch(onerror)
    return res
  }

  group(name) {
    if (this.groups[name]) return this.groups[name]
    const g = new Group(name, this)
    this.groups[name] = g
    return g
  }

  find(name) {
    const r = this.resources[name]
    if (r) return r
    return Object.values(this.resources).find((r) => r.name === name || r.url === name)
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

    if (this.progressing) {
      throw new Error('add resource when progressing')
    }

    let res = loader._structure(params)
    res = loader.resources[res.name] || res
    loader.resources[res.name] = res

    if (_queue.find((r) => r.name === res.name)) return res

    loader._link(res)
    _queue.push(res)

    this.chunk = this._queue.reduce((s, v) => s + v.chunk, 0)
    return res
  }

  run() {
    const { _queue, loader } = this
    Promise.all(_queue.map((res) => loader.load(res).promise)).then(() => {
      this._queue.length = 0
      this.resolve()
    })
  }

  request() {
    return this.run()
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

class Context {
  constructor(res, loader) {
    this.res = res
    this.loader = loader
  }

  throw(code, message) {
    throw { code, message }
  }
}

// TODO children resource

const loader = new Loader()

export default loader
