/*
 * @Author: last order
 * @Date: 2020-02-11 13:05:39
 * @LastEditTime: 2020-05-02 14:39:23
 */

interface EventsInterface {
  [propName: string]: Function[]
}

export default class Events {
  events: EventsInterface
  container: HTMLVideoElement
  
  constructor (container: HTMLVideoElement) {
    this.container = container
    this.events = {}
  }

  // 绑定原生事件
  nativeOn (event: string, fn: Function) {
    console.log(this.container)
    this.container.addEventListener.call(this.container, event, fn as EventListenerOrEventListenerObject, false)
  }

  // 移除原生事件
  removeNative (event: string, fn: Function) {
    this.container.removeEventListener.call(this.container, event, fn as EventListenerOrEventListenerObject)
  }

  // 绑定事件
  on (eventName: string, fn: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [fn, ...this.events[eventName]]
    }
  }

  // 触发事件
  emit (eventName: string, ...args: any[]) {
    if (!eventName) throw Error(`${eventName} is not defined`)

    for (const event of Object.entries(this.events)) {
      console.log(eventName, event[0])
      if (eventName === event[0]) {
        event[1].map(fn => {
          fn.call(this, ...args)
        })
      }
    }
  }

  // 移除事件
  remove (eventName: string, fn?: Function) {
    if (fn) {
      const index = this.events[eventName].findIndex(item => fn === item)
      this.events[eventName].splice(index, 1)
    } else {
      Reflect.deleteProperty(this.events, eventName)
      // delete this.events[eventName]
    }
  }
}
