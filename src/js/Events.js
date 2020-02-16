/*
 * @Author: last order
 * @Date: 2020-02-11 13:05:39
 * @LastEditTime: 2020-02-16 20:41:58
 */
export default class Events {
  constructor () {
    this.handlerName = ['canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'play', 'pause', 'playing', 'progress', 'ratechange', 'readystatechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
    this.events = {}
  }

  // 绑定事件
  on (eventName, callback) {
    // if (eventName && (typeof eventName !== 'string')) throw TypeError(`${eventName} is not a string`)
    if (typeof callback !== 'function') throw TypeError(`${callback} is not a function`)
    const findEvent = this.handlerName.find(item => item === eventName)
    if (findEvent) {
      if (!this.events[eventName]) {
        this.events[eventName] = []
      }
      this.events[eventName].push(callback)
    }
    // this.emit(eventName)
  }

  // 触发事件
  emit (eventName, ...args) {
    if (!eventName) throw Error(`${eventName} is not defined`)
    for (const event of Object.entries(this.events)) {
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
