/*
 * @Author: last order
 * @Date: 2020-02-29 15:37:37
 * @LastEditTime: 2020-03-04 14:22:17
 */
import player from './index'

interface SourceOptions {
  src: string,
  type?: string  
}

interface LoPlayerOptions {
  src: string | SourceOptions[],
  autoplay?: boolean,
  loop?: boolean,
  screenShot?: boolean,
  speed?: number[],
  defaultSpeed?: number
}

declare class LoPlayer {
  constructor (options: LoPlayerOptions)
  autoPlay(): void
  screenShot(): void
  error(): void
  getExt(str: string): string
  mediaSourceExtensions(): void
  preload(): void
  togger(): void
  play(): void
  pause(): void
  prev(): void
  next(): void
  seekTo(time: number): void
  fullScreen(): void
  setVolume(): void
  muted(): void
}

export default LoPlayer
