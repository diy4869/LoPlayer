/*
 * @Author: last order
 * @Date: 2019-08-10 21:12:49
 * @LastEditTime: 2020-02-29 16:28:58
 */
export const Format = (time) => {
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
  return Hour + ':' + Minute + ':' + Second
}
