import EventEmitter from 'eventemitter3'
import compose from 'koa-compose'

export const resolvePromise = (ctx, next) => {
  const { loader, res } = ctx
  ctx.res.resolve()
  const ok = loader.resources.every(r => r.complete)
  if (ok) loader.resolve()
}

export class Resource extends EventEmitter {
  constructor(params) {
    super()

    this.chunk = 1
    this.loaded = false
    this.complete = false
    Object.assign(this, params)

    this.promise = new Promise((resolve, reject) => {
      this.resolve = () => {
        this.complete = true
        resolve(this)
      }
      this.reject = reject
    })
  }
}


export class Loader extends EventEmitter {
  resouces = {}
  middlewares =[]
  timeout = 3000

  use(...fn) {
    if (this.loading) {
      throw new Error('add middleware when loading')
    }
    this.middlewares.push(...fn)
    this.handle = compose([...this.middlewares, resolvePromise])
  }

  add(res) {
    this.resouces[url] = new Resource()
  }

  load(params) {
    let res
    if (!(params instanceof Resource)) {
      res = new Resource(params)
    }
    this.handle({ res, loader: this })
    return res
  }

  loadAll() {
    const { resouces } = this
    Object.keys(resouces).map(k => {
      const res = resouces[k]
      if (res.complete) return
      this.load(res)
    })
  }

  get(key) {

  }
}

