/*
 * @Author: last order
 * @Date: 2019-08-13 16:51:16
 * @LastEditTime: 2020-02-21 12:29:30
 */
import player from '../template/player.art'

export default class Template {
  constructor (options) {
    this.container = options.container
    this.options = options
    this.init()
  }

  init () {
    console.log(this.options)
    this.container.innerHTML = player({
      options: this.options
    })
    this.playerBox = this.container.querySelectorAll('.playerBox')[0]
    this.prevBtn = this.container.querySelectorAll('.playerBox .prevBtn')[0]
    this.nextBtn = this.container.querySelectorAll('.playerBox .nextBtn')[0]
    this.playBtn = this.container.querySelectorAll('.playerBox #play')[0]
    this.player = this.container.querySelectorAll('.playerBox #video')[0]
    this.currentTime = this.container.querySelectorAll('.playerBox .duration span:nth-of-type(1)')[0]
    this.duration = this.container.querySelectorAll('.playerBox .duration span:nth-of-type(3)')[0]
    this.controlBox = this.container.querySelectorAll('.playerBox .controlBox')[0]
    // 进度条
    this.videoProgressLine = this.container.querySelectorAll('.playerBox .progressLine')[0]
    this.videoProgress = this.container.querySelectorAll('.playerBox .progress')[0]
    this.preload = this.container.querySelectorAll('.playerBox .preload')[0]
    this.videoProgressBar = this.container.querySelectorAll('.playerBox .progressBar')[0]
    // 音量控制条
    this.volumeBox = this.container.querySelectorAll('.playerBox .volumeBox')[0]
    this.volumeLine = this.container.querySelectorAll('.playerBox .volumeBox .progressLine')[0]
    this.volumeProgress = this.container.querySelectorAll('.playerBox .volumeBox .progress')[0]
    this.volumeBar = this.container.querySelectorAll('.playerBox .volumeBox .progressBar')[0]
    this.volumeBtn = this.container.querySelectorAll('.playerBox .volumeBtn')[0]
    this.volumeBtn = this.container.querySelectorAll('.playerBox .volumeBtn')[0]
    this.fullScreen = this.container.querySelectorAll('.playerBox .fullscreen')[0]
    this.volumeBtn = this.container.querySelectorAll('.playerBox .volumeBtn')[0]
    this.volumeBtn = this.container.querySelectorAll('.playerBox .volumeBtn')[0]
    this.loading = this.container.querySelectorAll('.playerBox .loading')[0]
    this.volumeBtn = this.container.querySelectorAll('.playerBox .volumeBtn')[0]
    this.logo = this.container.querySelectorAll('.playerBox .playStatus')[0]
    this.speedPanel = this.container.querySelectorAll('.playerBox .speed-panel')[0]
    this.setting = this.container.querySelectorAll('.playerBox .setting')[0]
    this.settingPanel = this.container.querySelectorAll('.playerBox .setting-panel')[0]
    if (this.options.screenShot) {
      this.screenshot = this.container.querySelectorAll('.playerBox .screenshot')[0]
    }
  }
}
