import Bull from 'bull'
import Logger from '@ioc:Adonis/Core/Logger'
import OriginScheduleImport from './jobs/OriginScheduleImport'

export interface QueueHandler {
  name: string
  handler: Bull.ProcessCallbackFunction<any>
  bull: Bull.Queue
}

export default class Queue {
  public queues: QueueHandler[] = []

  constructor() {
    Logger.info('queue service started')
    this.addQueue(OriginScheduleImport.key, OriginScheduleImport.handler)
  }

  public findQueue<T = Record<string, any>>(name: string) {
    const queue = this.queues.find((q) => q.name === name)

    return queue ? (queue.bull as Bull.Queue<T>) : null
  }

  public addQueue<T = Record<string, any>>(
    name: string,
    callback: Bull.ProcessCallbackFunction<T>
  ) {
    const queue = new Bull<T>(name)

    queue.process(callback)

    queue.on('completed', () => Logger.info('%s complete', name))
    queue.on('progress', (_, progress) => Logger.info('%s current progress: %s', name, progress))
    queue.on('error', (err) => Logger.error(err.message))

    this.queues.push({
      name,
      handler: callback,
      bull: queue,
    })

    return queue
  }
}
