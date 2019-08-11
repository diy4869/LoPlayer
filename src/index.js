import './assets/css/iconfont.css'
import './assets/css/player.scss'
import TEMPLATE from './template'
import { Format } from './utils'
class LoPlayer {
  constructor (el, options) {
    this.el = el
    this.options = options
    this.playStatus = false
    this.loading = true
    this.volumeIcon = 'icon-yinliang'
    this.player = undefined
    this.currentTime = '00:00:00'
    this.duration = '00:00:00'
    this.init()
  }

  init () {
    if (!this.getEl(this.el)) {
      throw new Error(this.el + ' is not found')
    } else {
      const container = document.getElementById('player')
      container.innerHTML = TEMPLATE
      const { player } = this.getEl()
      this.player = player
      this.player.src = this.options.src[0].src
      this.canplay()
      this.play()
      this.timeupdate()
      this.jump()
      this.ended()
      this.fullScreen()
      this.shortcutKey()
      this.preload()
    }
  }

  getEl () {
    return {
      playerBox: document.querySelectorAll('.playerBox')[0],
      playBtn: document.querySelectorAll('#play')[0],
      player: document.querySelectorAll('#video')[0],
      currentTime: document.querySelectorAll('.duration span:nth-of-type(1)')[0],
      duration: document.querySelectorAll('.duration span:nth-of-type(3)')[0],
      controlBox: document.querySelectorAll('controlBox')[0],
      // 进度条
      videoProgressLine: document.querySelectorAll('.progressLine')[0],
      videoProgress: document.querySelectorAll('.progress')[0],
      preload: document.querySelectorAll('.preload')[0],
      videoProgressBar: document.querySelectorAll('.progressBar')[0],
      // 音量控制条
      volumeBox: document.querySelectorAll('.volumeBox')[0],
      volumeLine: document.querySelectorAll('volumeLine')[0],
      volumeProgress: document.querySelectorAll('.volumeProgress')[0],
      volumeBar: document.querySelectorAll('.volumeBar')[0],
      fullScreen: document.querySelectorAll('.fullscreen')[0]
    }
  }

  // 快捷键
  shortcutKey () {
    window.onkeydown = ev => {
      /**
       * 32 空格播放暂停
       * 70 F 进入和退出全屏
       * 77 M 调整是否静音
       */
      switch (ev.keyCode) {
        case 27:
          this.options.fullScreen = false
          break
        case 32:
          this.play()
          break
        case 70:
          this.fullScreen()
          break
        case 77:
          this.muted()
          break
        default:
          console.log('无效按键：' + ev.keyCode)
          break
      }
    }
  }

  preload () {
    const len = this.player.buffered.length - 1
    const { videoProgressLine, preload } = this.getEl()
    const end = this.player.buffered.end(len)
    const position = (end / this.player.duration) * videoProgressLine.offsetWidth
    preload.style.width = position.toFixed(2) + 'px'
  }

  canplay () {
    const { duration } = this.getEl()
    this.player.addEventListener('canplay', () => {
      duration.innerHTML = Format(this.player.duration)
      this.preload()
    })
  }

  play () {
    const { playBtn } = this.getEl()
    playBtn.addEventListener('click', () => {
      if (this.player.paused) {
        this.playStatus = true
        this.player.play()
        playBtn.className = 'icon iconfont icon-tingzhi'
      } else {
        this.playStatus = false
        this.player.pause()
        playBtn.className = 'icon iconfont icon-caret-right'
      }
    })
  }

  timeupdate () {
    const { currentTime, videoProgressLine, videoProgressBar, videoProgress } = this.getEl()
    this.player.addEventListener('timeupdate', () => {
      this.preload()
      this.currentTime = Format(this.player.currentTime)
      currentTime.innerHTML = this.currentTime

      const position = (this.player.currentTime / this.player.duration) * videoProgressLine.offsetWidth
      let max
      if (videoProgressBar.offsetLeft >= (videoProgressLine.offsetWidth - videoProgressBar.offsetWidth)) {
        max = videoProgressLine.offsetWidth - videoProgressBar.offsetWidth
      } else {
        max = position
      }
      this.currentTime = Format(this.player.currentTime, false)
      videoProgress.style.width = position + 'px'
      videoProgressBar.style.left = max + 'px'
    })
  }

  // 点击跳转
  jump () {
    const { videoProgress, videoProgressLine, videoProgressBar } = this.getEl()
    videoProgressLine.addEventListener('click', (event) => {
      const e = window.event || event
      const currentTime = e.offsetX / videoProgressLine.offsetWidth * this.player.duration
      const position = e.offsetX
      this.preload()
      this.currentTime = Format(currentTime)
      this.player.currentTime = currentTime
      videoProgress.style.width = position + 'px'
      videoProgressBar.style.left = position + 'px'
    })
  }

  ended () {
    const { playBtn } = this.getEl()
    this.player.addEventListener('ended', () => {
      this.playStatus = false
      playBtn.className = 'icon iconfont icon-caret-right'
    })
  }

  // 进入全屏
  FullScreen () {
    const { playerBox } = this.getEl()
    const el = playerBox
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.webkitRequestFullScreen) {
      el.webkitRequestFullScreen()
    }
  }

  // 退出全屏
  ExitFullscreen () {
    var doc = document
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen()
    } else if (doc.webkitCancelFullScreen) {
      doc.webkitCancelFullScreen()
    }
  }

  // 全屏
  fullScreen () {
    const { fullScreen } = this.getEl()
    fullScreen.addEventListener('click', () => {
      this.options.fullScreen = !this.options.fullScreen
      this.options.fullScreen ? this.FullScreen() : this.ExitFullscreen()
    })
  }
}

const player = new LoPlayer('#player', {
  src: [{
    src: 'http://bangumi.xyz/video.mp4',
    type: 'video/mp4'
  },
  {
    src: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
    type: 'video/mp4'
  }],
  autoplay: true,
  loop: true,
  fullScreen: false
})
console.log(player)
