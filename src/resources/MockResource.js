import Resource from '../resource.js'

const MODE_FIX = 'fix'
const MODE_AUTO = 'auto'
let mid = 0

export default class MockResource extends Resource {
  type = 'MOCK'
  constructor({ duration, chunk, mode = MODE_FIX }) {
    super()
    mid += 1
    this.name = '$$mock$$' + mid
    this.duration = duration
    this.chunk = chunk
    this.msRate = chunk / duration
    this.mode = mode
    this.tickCount = 0
  }

  async request(ctx, next) {
    this.startAt = Date.now()
    this.ctx = ctx

    await new Promise((resolve) => {
      this.loopResolve = resolve
      this.loop()
    })

    return next()
  }

  isLoaderComplete() {
    const { ctx, chunk: c0, completeChunk: c1 } = this
    const { chunk: l0, completeChunk: l1 } = ctx.loader.getProgress()
    return l0 - l1 == c0 - c1
  }

  loop = () => {
    this.tickCount += 1
    if (this.tickCount < 10) {
      return requestAnimationFrame(this.loop)
    }
    this.tickCount = 0

    const { chunk, completeChunk, duration, startAt, msRate, mode } = this

    if (mode == MODE_AUTO && this.isLoaderComplete()) {
      return this.loopResolve()
    }

    const now = Date.now()
    const elapse = now - startAt
    if (elapse > duration) {
      return this.loopResolve()
    }
    this.completeChunk = Math.floor(elapse * msRate)
    this.emit('progress', this)
    requestAnimationFrame(this.loop)
  }
}
