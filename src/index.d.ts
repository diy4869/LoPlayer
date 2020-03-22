/*
 * @Author: last order
 * @Date: 2020-02-29 15:37:37
 * @LastEditTime: 2020-03-04 14:22:17
 */
import LoPlayer from '@/index'

interface SourceOptions {
  src: string,
  type?: string  
}

interface LoPlayerOptions {
  src: string | SourceOptions[],
  autoplay?: boolean,
  loop?: boolean,
  screenShot?: boolean,
  spped: number[],
  defaultSpeed?: number
}

declare namespace loPlayer {
  class LoPlayer {
    constructor (el: HTMLDivElement, options: LoPlayerOptions)
    getCurrentTime(): number
    getDuration(): number
  }
}

export default loPlayer