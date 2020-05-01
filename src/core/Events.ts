/*
 * @Author: last order
 * @Date: 2020-02-11 13:05:39
 * @LastEditTime: 2020-05-01 14:54:03
 */

interface EventsInterface {
  [propName: string]: Function[]
}

export default class Events {
  events: EventsInterface
  handlerName: string[]
  container: HTMLVideoElement

  constructor (container: HTMLVideoElement) {
    this.container = container
    this.handlerName = ['canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'play', 'pause', 'playing', 'progress', 'ratechange', 'readystatechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
    this.events = {}

    console.log(this)
  }

  // 绑定原生事件
  nativeOn (event: string, fn: Function) {
    this.container.addEventListener.call(this, event, fn as EventListenerOrEventListenerObject)
  }
  removeNative (event: string, fn: Function) {
    this.container.removeEventListener.call(this, event, fn as EventListenerOrEventListenerObject)
  }

  // 绑定事件
  on (eventName: string, callback: Function) {
    // if (eventName && (typeof eventName !== 'string')) throw TypeError(`${eventName} is not a string`)
    if (typeof callback !== 'function') throw TypeError(`${callback} is not a function`)
    const findEvent = this.handlerName.find(item => item === eventName)
    if (findEvent) {
      if (!this.events[eventName]) {
        this.events[eventName] = []
      }
      this.events[eventName] = [callback, ...this.events[eventName]]
    }
    // this.emit(eventName)
  }

  // 触发事件
  emit (eventName: string, ...args: any[]) {
    if (!eventName) throw Error(`${eventName} is not defined`)

    for (const event of Object.entries(this.events)) {
      console.log(eventName, event[0])
      if (eventName === event[0]) {
        event[1].map(fn => {
          fn.call(this.container, ...args)
        })
      }
    }
  }

  // 移除事件
  remove () {
    console.log('remove successd')
  }
}
