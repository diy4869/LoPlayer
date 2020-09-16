/*
 * @Author: last order
 * @Date: 2020-05-01 13:08:58
 * @LastEditTime: 2020-05-01 13:09:06
 */
declare module '*.art'

type srcType = SourceOptions[] | string

interface SourceOptions {
    src: string,
    type?: string  
}

declare interface LoPlayerOptions {
    src: srcType,
    autoPlay?: boolean,
    loop?: boolean,
    speed?: number[],
    fullScreen?: boolean
}

