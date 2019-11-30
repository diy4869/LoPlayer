import LoPlayer from './js/index'

const player = new LoPlayer('#player', {
  src: [{
    src: '~/video/(ドラマ)ガリレオ 第01話[1280×720 DivX6.xx]v2.avi'
  },
  {
    src: 'http://7xlv47.com1.z0.glb.clouddn.com/4k.mp4',
    type: 'video/mp4'
  },
  {
    src: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
    type: 'video/mp4'
  },
  {
    src: 'http://7xlv47.com1.z0.glb.clouddn.com/xxx004.m3u8',
    type: 'hls'
  },
  {
    src: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    type: 'dash'
  }],
  autoplay: true,
  loop: true,
  fullScreen: false
})
console.log(player)

export default LoPlayer
