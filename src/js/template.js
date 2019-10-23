/**
 * @author last order
 * @description html模板
 */
import player from '../template/player.art'
export default class Template {
  constructor (el, options, currentIndex, loading, playStatus) {
    this.el = el
    this.options = options
    this.currentIndex = currentIndex
    this.playStatus = false
    this.loading = true
    this.init()
  }

  init () {
    this.el.el.innerHTML = player({
      options: this.options,
      currentIndex: this.currentIndex,
      loading: this.loading,
      playStatus: this.playStatus
    })
    this.playerBox = document.querySelectorAll('.playerBox')[0]
    this.prevBtn = document.querySelectorAll('.prevBtn')[0]
    this.nextBtn = document.querySelectorAll('.nextBtn')[0]
    this.playBtn = document.querySelectorAll('#play')[0]
    this.player = document.querySelectorAll('#video')[0]
    this.source = document.querySelectorAll('#player source')[0]
    this.currentTime = document.querySelectorAll('.duration span:nth-of-type(1)')[0]
    this.duration = document.querySelectorAll('.duration span:nth-of-type(3)')[0]
    this.controlBox = document.querySelectorAll('.controlBox')[0]
    // 进度条
    this.videoProgressLine = document.querySelectorAll('.progressLine')[0]
    this.videoProgress = document.querySelectorAll('.progress')[0]
    this.preload = document.querySelectorAll('.preload')[0]
    this.videoProgressBar = document.querySelectorAll('.progressBar')[0]
    // 音量控制条
    this.volumeBox = document.querySelectorAll('.volumeBox')[0]
    this.volumeLine = document.querySelectorAll('.volumeBox .progressLine')[0]
    this.volumeProgress = document.querySelectorAll('.volumeBox .progress')[0]
    this.volumeBar = document.querySelectorAll('.volumeBox .progressBar')[0]
    this.volumeBtn = document.querySelectorAll('.volumeBtn')[0]
    this.fullScreen = document.querySelectorAll('.fullscreen')[0]
    this.screenshot = document.querySelectorAll('.screenshot')[0]
  }
}
