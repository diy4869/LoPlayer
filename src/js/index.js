/**
 * @author last order
 * @description LoPlayer
 */
import '~/css/iconfont.css'
import '~/css/player.scss'
import Template from '@/js/template'
import { Format, reactive } from '@/js/utils'
import Hls from 'hls.js'
import dashjs from 'dashjs'

export default class LoPlayer {
  constructor (el, options) {
    this.el = el
    this.options = options
    this.playStatus = false
    this.loading = false
    this.player = undefined
    this.currentTime = '00:00:00'
    this.duration = '00:00:00'
    this.volumeIcon = ''
    this.currentIndex = 0

    const data = reactive(this)
    data.playStatus = true
    this.playStatus = true
    console.log(data)
    this.getEl = new Template({
      el: document.querySelectorAll(this.el)[0]
    })
    this.init()
  }

  init () {
    if (!document.querySelectorAll(this.el)[0]) {
      throw new Error(this.el + ' is not found')
    } else {
      const { player } = this.getEl
      this.player = player
      this.bindEvent()
      this.mediaSourceExtensions()
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
      this.prev()
      this.next()
      this.screenshot()
      console.log(this.player)
    }
  }

  screenshot () {
    const { screenshot } = this.getEl
    screenshot.addEventListener('click', () => {
      const canvas = document.createElement('canvas')
      canvas.width = this.player.offsetWidth
      canvas.height = this.player.offsetHeight
      const link = document.createElement('a')
      const ctx = canvas.getContext('2d')
      document.body.appendChild(canvas)
      ctx.drawImage(this.player, 0, 0, canvas.width, canvas.height)
      const res = canvas.toDataURL('image/png')
      link.setAttribute('download', '下载图片')
      console.log(link)
      link.setAttribute('href', res)
      document.body.appendChild(link)
      link.click()
    })
  }

  error () {
    this.player.addEventListener('error', () => {
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

  // 检测视频格式是否支持
  mediaSourceExtensions () {
    const { source } = this.getEl
    this.player.load()
    switch (this.options.src[this.currentIndex].type) {
      case 'hls':
        console.log('hls')
        if (Hls) {
          if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(this.options.src[this.currentIndex].src)
            hls.attachMedia(this.player)
            console.log(hls)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              this.play()
            })
            hls.on(Hls.Events.BUFFER_RESET, () => {
              console.log('test')
            })
          } else if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
            source.src = this.options.src[this.currentIndex].src
            this.player.addEventListener('canplay', () => {
              this.play()
            })
          }
        }
        break
      case 'dash':
        console.log('dash')
        if (dashjs) {
          const player = dashjs.MediaPlayer().create()
          player.initialize(this.player, this.options.src[this.currentIndex].src, true)
        }
        break
      default:
        // this.pause()
        this.player.load()
        source.src = this.options.src[this.currentIndex].src
        source.type = this.options.src[this.currentIndex].type
        break
    }
  }

  bindEvent () {
    const { playBtn, volumeBtn, fullScreen } = this.getEl
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

  // 缓存
  preload () {
    const { videoProgressLine, preload } = this.getEl
    if (this.player.buffered) {
      const len = this.player.buffered.length - 1
      if (len >= 0 && len < 2) {
        const end = this.player.buffered.end(0.1)
        const position = (end / this.player.duration) * videoProgressLine.offsetWidth
        preload.style.width = position.toFixed(2) + 'px'
      }
    }
  }

  // 检测视频状态是否就绪
  canplay () {
    const { duration } = this.getEl
    this.player.addEventListener('canplay', () => {
      duration.innerHTML = Format(this.player.duration)
      this.preload()
      this.loading = false
    })
  }

  // 切换视频状态
  toggle () {
    this.playStatus = !this.playStatus
    this.playStatus ? this.play() : this.pause()
  }

  // 播放
  play () {
    const { playBtn } = this.getEl

    this.playStatus = true
    this.player.play()
    playBtn.className = 'icon iconfont icon-tingzhi'
  }

  // 暂停
  pause () {
    const { playBtn } = this.getEl
    this.playStatus = false
    this.player.pause()
    playBtn.className = 'icon iconfont icon-caret-right'
  }

  // 上一个
  prev () {
    const { prevBtn } = this.getEl
    prevBtn.addEventListener('click', () => {
      console.log('prev')
      if (this.currentIndex > 0) {
        this.currentIndex--
      } else {
        this.currentIndex = this.options.src.length - 1
      }
      this.changeVideo()
    })
  }

  // 下一个
  next () {
    const { nextBtn } = this.getEl
    nextBtn.addEventListener('click', () => {
      if (this.currentIndex < this.options.src.length - 1) {
        console.log('执行了')
        this.pause()
        // this.player.load()
        this.player.setAttribute('preload', 'none')
        this.currentIndex++
      } else {
        this.currentIndex = 0
      }
      this.changeVideo()
    })
    console.log(this.currentIndex)
    console.log(this.options.src[this.currentIndex])
  }

  changeVideo () {
    const { currentTime, preload, videoProgressBar, videoProgress, player } = this.getEl
    this.player.load()
    player.removeChild(player.children[0])
    const source = document.createElement('source')
    source.src = this.options.src[this.currentIndex].src
    source.type = this.options.src[this.currentIndex].type
    player.appendChild(source)
    this.mediaSourceExtensions()
    this.play()
    // this.mediaSourceExtensions()
    console.log(this.player)
    this.currentTime = '00:00:00'
    currentTime.innerHTML = this.currentTime
    videoProgress.style.width = 0 + 'px'
    videoProgressBar.style.left = 0 + 'px'
    preload.style.width = 0 + 'px'
    this.play()
    // eslint-disable-next-line no-debugger
    // debugger
  }

  // 时间更新的操作
  timeupdate () {
    const { currentTime, videoProgressLine, videoProgressBar, videoProgress } = this.getEl
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
    const { videoProgress, videoProgressLine, videoProgressBar } = this.getEl
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
    const { videoProgress, videoProgressLine, videoProgressBar, controlBox, playerBox } = this.getEl
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

  // 播放结束后的操作
  ended () {
    const { playBtn } = this.getEl
    this.player.addEventListener('ended', () => {
      this.playStatus = false
      playBtn.className = 'icon iconfont icon-caret-right'
    })
  }

  // 进入全屏
  FullScreen () {
    const { playerBox } = this.getEl
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
    const { volumeBtn } = this.getEl
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
    const { volumeLine, volumeBar, volumeProgress, volumeBox, playerBox } = this.getEl
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
    const { volumeLine, volumeBar, volumeProgress } = this.getEl
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
    const { volumeBtn } = this.getEl
    this.player.muted = !this.player.muted
    this.player.muted ? this.volumeIcon = 'icon-guanbiyinliang' : this.volumeIcon = 'icon-yinliang'
    volumeBtn.classList.replace(volumeBtn.classList[volumeBtn.classList.length - 1], this.volumeIcon)
  }
}
