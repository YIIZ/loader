import Resource from '../resource.js'

export default class MockResource extends Resource {
  type = 'MOCK'
  constructor({ duration, chunk }) {
    super()
    this.name = '$$mock$$'
    this.duration = duration
    this.chunk = chunk
    this.msRate = chunk / duration
  }

  async request(ctx, next) {
    this.startAt = Date.now()

    await new Promise((resolve) => {
      this.loopResolve = resolve
      this.loop()
    })

    return next()
  }

  loop = () => {
    const { chunk, completeChunk, duration, startAt, msRate } = this
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
