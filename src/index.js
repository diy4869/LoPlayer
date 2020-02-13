/*
 * @Author: last order
 * @Date: 2019-08-15 20:36:02
 * @LastEditTime : 2020-02-13 18:12:36
 */
import LoPlayer from './js/index'

const player = new LoPlayer('#player', {
  src: [
    // {
    //   src: 'http://7xlv47.com1.z0.glb.clouddn.com/4k.mp4',
    //   type: 'video/mp4'
    // },
    // {
    //   src: 'http://7xlv47.com1.z0.glb.clouddn.com/xxx004.m3u8',
    //   type: 'hls'
    // },
    // {
    //   src: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    //   type: 'dash'
    // },
    {
      src: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
      type: 'video/mp4'
    },
    {
      src: 'https://pl.dogecloud.com/vcloud/hls/m3u8/117256?tm=1581569593&vtype=10&uid=450&sign=6eb1695366e23beb18f5095172598a95&icp=0&durlimit=0&server=s4&vkey=6595DA30F5D09E1FF19D895C42C66097100F753EF88B4F5876F222AD90D1DECD98F43CE79C57BCF95F610FB226616D2F4FC699DDF869E0B7CBAEF1D7E2953A1B2777EF091229E095CC5DEC84C279725179D496FB32E247BBCF9C346954855F186CB33A638302E56AA1F5391665BA8A786420B1CB2E0919B598927B080362162A6E12F16AC86B58229A906BFECCB6B1A1&token=f506040a36b56df6142a0824117c0200&ext=.m3u8',
      type: 'hls'
    },
    {
      src: 'https://pl.dogecloud.com/vcloud/hls/m3u8/117259?tm=1581582767&vtype=10&uid=450&sign=621ef96348062ef9c219a5590a171e5d&icp=0&durlimit=0&server=s4&vkey=989A0FEF77EF4FE19E136EF9BB818EF331319D0281B9523E0986CC37CE602723D3BA23F456F521DEC7BF7EC34B134E6ACF0FA6FC8ACB955F227E2A581A84E5BF2D8B136D35F1A715ECE110A701216CB8D8DD99A69228187B395BA6B7EDB5E2845AB13337F62FA3181F2F4BAFA8691AA5456EC4F046D9832C8C2DEB5F51E84574C9BC319AF1420EDBAB3A01450F2752DB&token=d18be8930473c28651f28202789bee20&ext=.m3u8',
      type: 'hls'
    }
    // {
    //   src: 'http://bangumi.xyz/video.mp4',
    //   type: 'video/mp4'
    // }
  ],
  autoplay: true,
  loop: true,
  fullScreen: false
})
console.log(player)

export default LoPlayer
