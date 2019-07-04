import Resource  from '../resource.js'

export default class MockResource extends Resource {
  type = 'MOCK'
  constructor({ duration, chunk }) {
    super()
    this.name = '$$mock$$'
    this.duration = duration
    this.chunk = chunk
    this.msRate = chunk / duration
  }

  request(ctx, next) {
    this.startAt = Date.now()
    this.next = next
    this.loop()
  }

  loop = () => {
    const { chunk, completeChunk, duration, startAt, msRate, next } = this
    const now = Date.now()
    const elapse = now - startAt
    if (elapse > duration) {
      return next()
    }
    this.completeChunk = Math.floor(elapse * msRate)
    this.emit('progress', this)
    requestAnimationFrame(this.loop)
  }
}