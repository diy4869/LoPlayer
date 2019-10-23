/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 20:36:02
 * @LastEditTime: 2019-09-04 19:49:58
 * @LastEditors: Please set LastEditors
 */
import LoPlayer from './js/index'

const player = new LoPlayer('#player', {
  src: [
    // {
    //   src: 'http://7xlv47.com1.z0.glb.clouddn.com/4k.mp4',
    //   type: 'video/mp4'
    // },
    {
      src: 'http://7xlv47.com1.z0.glb.clouddn.com/xxx004.m3u8',
      type: 'hls'
    },
    {
      src: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
      type: 'dash'
    },
    {
      src: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
      type: 'video/mp4'
    },
    {
      src: 'http://bangumi.xyz/video.mp4',
      type: 'video/mp4'
    }
  ],
  autoplay: true,
  loop: true,
  fullScreen: false
})
console.log(player)

export default LoPlayer
