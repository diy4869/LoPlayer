import './assets/css/iconfont.css'
import './assets/css/player.scss'
import TEMPLATE from './template'
import { Format } from './utils'
import Hls from 'hls.js'
import dashjs from 'dashjs'
import './canvas.js'

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
    this.currentIndex = 4
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
      this.stream()
      this.prev()
      this.next()
      this.durationChange()
      console.log(this.player)
    }
  }

  error () {
    this.player.addEventListener('error', () => {
      console.log()
      /*
      readyState表示音频/视频元素的就绪状态：
        0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息
        1 = HAVE_METADATA - 关于音频/视频就绪的元数据
        2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
        3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
        4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
      video.error：
        MEDIA_ERR_ABORTED(数字值为1)，媒体数据的下载过程由于用户的操作原因而被终止。
        MEDIA_ERR_NETWORK(数字值为2)，确认媒体资源可用，但是在下载出现网络错误，媒体数据的下载过程被中止。
        MEDIA_ERR_DECODE(数字值为3)，确认媒体资源可用，但是解码时发生错误。
        MEDIA_ERR_SRC_NOT_SUPPORTED(数字值为4)，媒体资源不可用或媒体格式不被支持。

      video.networkState：
        NETWORK_EMPTY（数字值为0）：元素处于初始状态。
        NETWORK_IDLE(数字值为1)，浏览器已选择好用什么编码格式来播放媒体，但是尚未建立网络连接。
        NETWORK_LOADING(数字值为2)：媒体数据加载中
        NETWORK_NO_SOURCE(数字值为3)，没有支持的编码格式，不执行加载。
    */
    })
  }

  stream () {
    const { source } = this.getEl()
    switch (this.options.src[this.currentIndex].type) {
      case 'hls':
        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(this.options.src[this.currentIndex].src)
          hls.attachMedia(this.player)
          console.log(hls)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.play()
          })
        } else if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
          source.src = this.options.src[this.currentIndex].src
          this.player.addEventListener('loadedmetadata', () => {
            this.play()
          })
        }
        break
      case 'dash':
        console.log(6)
        console.log(this.options.src[this.currentIndex].src)
        const player = dashjs.MediaPlayer().create()
        player.initialize(this.player, this.options.src[this.currentIndex].src, true)
        console.log(player)
        break
      default:
        console.log('未知')
        break
    }
  }

  getEl () {
    console.log(document.querySelectorAll('#video source'))
    return {
      playerBox: document.querySelectorAll('.playerBox')[0],
      prevBtn: document.querySelectorAll('.prevBtn')[0],
      nextBtn: document.querySelectorAll('.nextBtn')[0],
      playBtn: document.querySelectorAll('#play')[0],
      player: document.querySelectorAll('#video')[0],
      source: document.querySelectorAll('#video source')[0],
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
      this.toggle()
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
          this.toggle()
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
    console.log(this.player.buffered)
    const len = this.player.buffered.length - 1
    console.log(len)
    const { videoProgressLine, preload } = this.getEl()
    if (len >= 0) {
      const end = this.player.buffered.end(len)
      const position = (end / this.player.duration) * videoProgressLine.offsetWidth
      preload.style.width = position.toFixed(2) + 'px'
    }
  }

  canplay () {
    const { duration } = this.getEl()
    this.player.addEventListener('canplay', () => {
      duration.innerHTML = Format(this.player.duration)
      this.preload()
    })
  }

  toggle () {
    this.playStatus = !this.playStatus
    this.playStatus ? this.play() : this.pause()
  }

  play () {
    const { playBtn } = this.getEl()

    this.playStatus = true
    this.player.play()
    playBtn.className = 'icon iconfont icon-tingzhi'
  }

  pause () {
    const { playBtn } = this.getEl()
    this.playStatus = false
    this.player.pause()
    playBtn.className = 'icon iconfont icon-caret-right'
  }

  prev () {
    const { prevBtn } = this.getEl()
    prevBtn.addEventListener('click', () => {
      console.log('prev')
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.durationChange()
      }
    })
  }

  next () {
    const { nextBtn } = this.getEl()
    nextBtn.addEventListener('click', () => {
      console.log('next')
      console.log(this.player)
      if (this.currentIndex < this.options.src.length) {
        console.log(this.currentIndex)
        this.currentIndex++
        this.durationChange()
      }
    })
  }

  durationChange () {
    const { currentTime, preload, videoProgressBar, videoProgress, source } = this.getEl()
    // this.player.load()
    source.src = this.options.src[this.currentIndex].src
    source.type = this.options.src[this.currentIndex].type
    console.log('src：' + source.src)
    this.pause()
    this.stream()
    console.log('错误信息' + this.player.error)
    console.log('就绪状态' + this.player.readyState)
    console.log('网络状态' + this.player.networkState)
    // this.play()
    this.currentTime = '00:00:00'
    currentTime.innerHTML = this.currentTime
    videoProgress.style.width = 0 + 'px'
    videoProgressBar.style.left = 0 + 'px'
    preload.style.width = 0 + 'px'
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
    src: 'http://7xlv47.com1.z0.glb.clouddn.com/4k.mp4',
    type: 'video/mp4'
  },
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
  }],
  autoplay: true,
  loop: true,
  fullScreen: false
})
console.log(player)
