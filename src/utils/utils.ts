/*
 * @Author: last order
 * @Date: 2019-08-10 21:12:49
 * @LastEditTime: 2020-05-04 13:55:29
 */
export const Format = (time: number): string => {
  const date = {
    day: Math.floor(time / 86400),
    second: Math.floor(time % 60),
    minute: Math.floor(time / 60 % 60),
    hour: Math.floor(time / 3600 % 24)
  }
  const { hour, second, minute } = date
  const Hour = hour < 10 ? '0' + hour : hour
  const Second = second < 10 ? '0' + second : second
  const Minute = minute < 10 ? '0' + minute : minute

  return time > 3600 ? `${Hour}:${Minute}:${Second}` : `${Minute}:${Second}`
}

export const base64ToBlob = (dataurl: string) => {
  let arr = dataurl.split(',')
  let _arr = arr[1].substring(0, arr[1].length - 2)
  let mime = arr[0].match(/:(.*?);/) as string[]
  let bstr = atob(_arr)
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], {
    type: mime[1]
  })
}
