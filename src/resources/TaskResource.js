import Resource from '../resource.js'

let taskId = 1
export default class TaskResource extends Resource {
  type = 'Task'
  constructor({ chunk = 1, task }) {
    super()
    this.name = 'task' + taskId++
    this.chunk = chunk
    this.task = task
  }

  async request(ctx, next) {
    await this.task(ctx)
    return next()
  }
}
