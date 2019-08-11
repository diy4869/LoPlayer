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
    this.player = undefined
    this.currentTime = '00:00:00'
    this.duration = '00:00:00'
    this.volumeIcon = ''
    this.init()
  }

  init () {
    if (!this.getEl(this.el)) {
      throw new Error(this.el + ' is not found')
    } else {
      const container = document.querySelectorAll(this.el)[0]
      container.innerHTML = TEMPLATE
      const { player } = this.getEl()
      this.player = player
      this.player.src = this.options.src[1].src
      this.bindEvent()
      this.canplay()
      this.volumeChangeIcon()
      this.timeupdate()
      this.jump()
      this.ended()
      this.shortcutKey()
      this.progressMove()
      this.mouseUp()
      this.volume()
      this.volumeMove()
    }
  }

  getEl () {
    return {
      playerBox: document.querySelectorAll('.playerBox')[0],
      playBtn: document.querySelectorAll('#play')[0],
      player: document.querySelectorAll('#video')[0],
      currentTime: document.querySelectorAll('.duration span:nth-of-type(1)')[0],
      duration: document.querySelectorAll('.duration span:nth-of-type(3)')[0],
      controlBox: document.querySelectorAll('.controlBox')[0],
      // 进度条
      videoProgressLine: document.querySelectorAll('.progressLine')[0],
      videoProgress: document.querySelectorAll('.progress')[0],
      preload: document.querySelectorAll('.preload')[0],
      videoProgressBar: document.querySelectorAll('.progressBar')[0],
      // 音量控制条
      volumeBox: document.querySelectorAll('.volumeBox')[0],
      volumeLine: document.querySelectorAll('.volumeBox .progressLine')[0],
      volumeProgress: document.querySelectorAll('.volumeBox .progress')[0],
      volumeBar: document.querySelectorAll('.volumeBox .progressBar')[0],
      volumeBtn: document.querySelectorAll('.volumeBtn')[0],
      fullScreen: document.querySelectorAll('.fullscreen')[0]
    }
  }

  bindEvent () {
    const { playBtn, volumeBtn, fullScreen } = this.getEl()
    playBtn.addEventListener('click', () => {
      this.play()
    })
    volumeBtn.addEventListener('click', () => {
      this.muted()
    })
    fullScreen.addEventListener('click', () => {
      this.fullScreen()
    })
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
    console.log(this)
    if (this.player.paused) {
      this.playStatus = true
      this.player.play()
      playBtn.className = 'icon iconfont icon-tingzhi'
    } else {
      this.playStatus = false
      this.player.pause()
      playBtn.className = 'icon iconfont icon-caret-right'
    }
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

  // 拖拽调整进度
  progressMove () {
    const { videoProgress, videoProgressLine, videoProgressBar, controlBox, playerBox } = this.getEl()
    videoProgressBar.onmousedown = () => {
      document.onmousemove = (event) => {
        const ev = event || window.event
        ev.preventDefault()
        console.log(6)
        let position = ev.clientX - controlBox.offsetLeft - playerBox.offsetLeft
        const maxMovePoint = videoProgressLine.offsetWidth - videoProgressBar.offsetWidth
        if (position > maxMovePoint) {
          position = maxMovePoint
        } else if (position < 0) {
          position = 0
        }
        const currentTime = (position / maxMovePoint) * this.player.duration
        this.currentTime = Format(currentTime)
        this.player.currentTime = currentTime
        videoProgress.style.width = position + 'px'
        videoProgressBar.style.left = position + 'px'
      }
    }
  }

  mouseUp () {
    document.onmouseup = () => {
      document.onmousemove = null
    }
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
    const doc = document
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
    this.options.fullScreen = !this.options.fullScreen
    this.options.fullScreen ? this.FullScreen() : this.ExitFullscreen()
  }

  // 修改音量图标
  volumeChangeIcon () {
    const { volumeBtn } = this.getEl()
    const volume = this.player.volume
    if (volume > 0.75) {
      this.volumeIcon = 'icon-yinliang'
    } else if (volume > 0.4 && volume < 0.75) {
      this.volumeIcon = 'icon-yinliangdaxiao'
    } else if (volume > 0 && volume < 0.4) {
      this.volumeIcon = 'icon-zuixiaoyinliang'
    } else if (volume === 0) {
      this.volumeIcon = 'icon-guanbiyinliang'
    }
    volumeBtn.classList.replace(volumeBtn.classList[volumeBtn.classList.length - 1], this.volumeIcon)
  }

  // 拖拽调整音量大小
  volumeMove () {
    const { volumeLine, volumeBar, volumeProgress, volumeBox, playerBox } = this.getEl()
    volumeBar.onmousedown = () => {
      document.onmousemove = (ev) => {
        let position = ev.clientX - volumeBox.offsetLeft - playerBox.offsetLeft
        const maxMovePoint = volumeLine.offsetWidth - volumeBar.offsetWidth
        if (position > maxMovePoint) {
          position = maxMovePoint
        } else if (position < 0) {
          position = 0
        }
        const volumeSize = Number((position / maxMovePoint).toFixed(2))
        volumeProgress.style.width = position + 'px'
        volumeBar.style.left = position + 'px'
        this.player.volume = volumeSize
        this.volumeChangeIcon()
      }
    }
  }

  // 点击调整音量大小
  volume () {
    const { volumeLine, volumeBar, volumeProgress } = this.getEl()
    console.log(volumeProgress)
    volumeProgress.addEventListener('click', (event) => {
      const e = window.event || event
      let position = e.offsetX
      const volumeSize = Number((position / volumeLine.offsetWidth).toFixed(2))
      if ((position - volumeBar.offsetWidth) <= 0) {
        position = 0
      } else if (position > (volumeLine.offsetWidth - volumeBar.offsetWidth)) {
        position = volumeLine.offsetWidth - volumeBar.offsetWidth
      }
      volumeProgress.style.width = position + 'px'
      volumeBar.style.left = position + 'px'
      this.player.volume = volumeSize
      this.volumeChangeIcon()
    })
  }

  // 静音
  muted () {
    const { volumeBtn } = this.getEl()
    this.player.muted = !this.player.muted
    this.player.muted ? this.volumeIcon = 'icon-guanbiyinliang' : this.volumeIcon = 'icon-yinliang'
    volumeBtn.classList.replace(volumeBtn.classList[volumeBtn.classList.length - 1], this.volumeIcon)
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
  },
  {
    src: 'https://player.dogecloud.com/web/player.html?vcode=d87d57617666bc9b&userId=450&autoPlay=false&inFrame=true&vtype=10',
    type: 'video/mp4'
  }],
  autoplay: true,
  loop: true,
  fullScreen: false
})
console.log(player)
