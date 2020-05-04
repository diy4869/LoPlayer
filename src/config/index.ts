/*
 * @Author: last order
 * @Date: 2020-05-04 13:06:56
 * @LastEditTime: 2020-05-04 14:32:58
 */
interface SourceOptions {
  src: string,
  type?: string  
}
type srcType = SourceOptions[] | string

export interface LoPlayerOptions {
  src: srcType,
  autoPlay?: boolean,
  loop?: boolean,
  screenShot?: boolean,
  speed?: number[],
  fullScreen?: boolean
}

const options: LoPlayerOptions = {
  src: [],
  autoPlay: false,
  loop: false,
  screenShot: false,
  speed: [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2],
  fullScreen: false
}

export default options
