import '../assets/css/player.scss'
import Template from '@/core/template'
import Events from '@/core/events'
import { Format } from '@/utils/utils'
import Hls from 'hls.js'
import dashjs from 'dashjs'
import LoPlayerConfig from '@/config/index'
import FullScreen from '@/plugins/fullscreen'

type PanelOptions = {
  [propName in number | string]: any
}


export default class LoPlayer {
  el: HTMLElement
  options: LoPlayerOptions
  playStatus: boolean
  loading: boolean
  player!: HTMLVideoElement
  currentTime: number
  duration: number
  volumeIcon: string
  currentIndex: number
  speed: number[]
  switch: boolean
  getEl: any
  events?: Events
  fullScreen: boolean

  constructor (el: HTMLElement, options: LoPlayerOptions = LoPlayerConfig) {
    this.el = el
    this.options = options
    this.playStatus = false
    this.loading = true
    this.currentTime = 0
    this.duration = 0
    this.volumeIcon = ''
    this.currentIndex = 0
    this.speed = this.options.speed ?? [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2]
    this.switch = typeof this.options.src !== 'string'
    this.getEl = new Template({
      container: this.el,
      switch: this.switch,
      speed: this.speed,
      currentIndex: this.currentIndex,
      currentTime: Format(this.currentTime)
    })
    this.fullScreen = false
    // this.plugins = new Plugins([FullScreen], this)
    this.init()
  }

  init () {
    console.log(this)
    if (!this.el) {
      throw new Error(this.el + ' is not found')
    } else {
      const { player, prevBtn, nextBtn } = this.getEl
      this.player = player
      this.events = new Events(this.player)
      this.showLoading(this.loading)
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
      this.setSpeed()
      this.showSetting()
      this.contextmenu()
      this.error()
      this.autoPlay()
      // this.fullScreen()

      if (typeof this.options.src !== 'string') {
        if (this.currentIndex === 0) {
          prevBtn.style.cssText = 'color: rgba(255, 255, 255, 0.7)'
          nextBtn.style.cssText = 'color: white'
        }
        if (this.currentIndex === this.options.src.length - 1) {
          nextBtn.style.cssText = 'color: rgba(255, 255, 255, 0.7)'
        }
      }
      if (this.options.loop) this.setLoop(true)
    }
  }

  setLoop (loop: true) {
    if (loop) {
      this.player.setAttribute('loop', 'loop')
    } else {
      this.player.removeAttribute('loop')
    }
  }
  bindEvent () {
    const { playBtn, volumeBtn, logo, fullScreen } = this.getEl
    playBtn.addEventListener('click', () => {
      this.toggle()
    })
    logo.addEventListener('click', () => {
      this.play()
    })
    volumeBtn.addEventListener('click', () => {
      this.muted()
    })
    fullScreen.addEventListener('click', () => {
      FullScreen(this)
    })
  }

  // 右键
  contextmenu () {
    this.player.addEventListener('contextmenu', e => {
      e.preventDefault()
    })
  }

  autoPlay () {
    if (this.options.autoPlay) {
      this.play()
    }
  }


  error () {
    // setInterval(() => {
    //   console.log(document.querySelectorAll('video'))
    //   console.log(`networkState：${this.player.networkState}`)
    //   console.log(`readyState：${this.player.readyState}`)
    //   console.log(`error：${this.player.error}`)
    //   console.log(`seeking: ${this.player.seeking}`)
    // }, 1000)
    this.player.addEventListener('error', (e) => {
      console.log(e)
      console.log(this.player)
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

  // 获取视频格式
  getExt (str: string) {
    if (typeof str !== 'string') throw TypeError(`${str} is not a string`)

    const start = str.lastIndexOf('.')
    if (start !== -1) {
      const ext = str.substr(start + 1, str.length)
      return ext
    }
  }

  // 检测视频格式是否支持
  mediaSourceExtensions () {
    this.player.load()
    const playerURL = typeof this.options.src === 'string' ? this.options.src : this.options.src[this.currentIndex].src
    const ext = this.getExt(playerURL)

    this.player.src = playerURL

    switch (ext) {
      case 'm3u8':
        console.log('m3u8')
        if (Hls) {
          if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(playerURL)
            hls.attachMedia(this.player)
            console.log(hls)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              this.play()
            })
            hls.on(Hls.Events.BUFFER_RESET, () => {
              console.log('test')
            })
          } else if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
            this.player.src = playerURL
          }
        }
        break
      case 'mpd':
        console.log('dash')
        if (dashjs) {
          const player = dashjs.MediaPlayer().create()
          // player.reset()
          player.initialize(this.player, playerURL, false)
          player.reset()
          // player.reset()
          // dashjs.MediaPlayerEvents()
        }
        break
      default:
        console.log(`当前视频格式为：${ext}`)
        this.player.load()
        this.player.src = playerURL
        break
    }
  }

  // 快捷键
  shortcutKey () {
    window.onkeydown = (ev: KeyboardEvent) => {
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
        case 77:
          this.muted()
          break
        case 122:
          // this.options.fullScreen = false
          // this.fullScreen()
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

    if (this.player && this.player.buffered) {
      const len = this.player.buffered.length - 1
      if (len >= 0 && len < 2) {
        const end = this.player.buffered.end(len)
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
      this.loading = false
      this.showLoading(this.loading)
      this.preload()
      this.showLogo()
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
    this.showLogo(this.playStatus)
    playBtn.className = 'icon iconfont icon-tingzhi'
  }

  // 暂停
  pause () {
    const { playBtn } = this.getEl
    this.playStatus = false
    this.player.pause()
    this.showLogo(this.playStatus)
    playBtn.className = 'icon iconfont icon-caret-right'
  }

  // 上一个
  prev () {
    const { prevBtn, nextBtn } = this.getEl
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.player.setAttribute('preload', 'none')
          --this.currentIndex
          this.changeVideo()
          this.play()
          if (this.currentIndex === 0) {
            prevBtn.style.cssText = 'color: rgba(255, 255, 255, 0.7)'
            nextBtn.style.cssText = 'color: white'
            // eslint-disable-next-line no-useless-return
            return
          }
        }
      })
    }
  }

  // 下一个
  next () {
    const { nextBtn, prevBtn } = this.getEl
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentIndex < this.options.src.length - 1) {
          this.player.setAttribute('preload', 'none')
          ++this.currentIndex
          this.changeVideo()
          this.play()
          prevBtn.style.cssText = 'color: white'
          if (this.currentIndex === this.options.src.length - 1) {
            nextBtn.style.cssText = 'color: rgba(255, 255, 255, 0.7)'
            // eslint-disable-next-line no-useless-return
            return
          }
        }
      })
    }
  }

  changeVideo () {
    const { currentTime, duration, preload, videoProgressBar, videoProgress } = this.getEl
    this.pause()
    this.showLoading(true)
    this.mediaSourceExtensions()
    console.log(this.player)
    this.currentTime = 0
    this.duration = 0
    duration.innerHTML = Format(this.duration)
    currentTime.innerHTML = Format(this.currentTime)
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
    const videoProgressLineWidth = videoProgressLine.offsetWidth
    const videoProgressBarWidth = videoProgressBar.offsetWidth

    this.player.addEventListener('timeupdate', () => {
      this.preload()
      this.currentTime = this.player.currentTime
      currentTime.innerHTML = Format(this.player.currentTime)

      const videoProgressBarLeft = videoProgressBar.offsetLeft
      const position = (this.player.currentTime / this.player.duration) * videoProgressLineWidth
      let max = position - 1
      if (videoProgressBarLeft >= (videoProgressLineWidth - videoProgressBarWidth)) {
        max = videoProgressLineWidth - videoProgressBarWidth
      }

      if (Math.floor(position) === 0) max = 0

      currentTime.innerHTML = Format(this.player.currentTime)
      videoProgress.style.width = position + 'px'
      videoProgressBar.style.left = max + 'px'

      const readyState = this.player.readyState
      const networkState = this.player.networkState

      if (readyState === 4 && (networkState === 1 || networkState === 2)) {
        this.showLoading(false)
      } else {
        this.showLoading(true)
      }
    })
  }

  seekTo (time: number) {
    this.player.currentTime = time
    this.currentTime = time
    const { videoProgress, videoProgressLine, videoProgressBar } = this.getEl
    const position = (this.player.currentTime / this.player.duration) * videoProgressLine.offsetWidth

    videoProgress.style.width = position + 'px'
    videoProgressBar.style.left = position + 'px'
  }

  // 点击跳转
  jump () {
    const { videoProgressLine } = this.getEl
    videoProgressLine.addEventListener('click', (e: MouseEvent) => {
      const position = e.offsetX
      const currentTime = position / videoProgressLine.offsetWidth * this.player.duration
      this.seekTo(currentTime)
      this.preload()
    })
  }

  // 拖拽调整进度
  progressMove () {
    const { videoProgressLine, videoProgressBar, controlBox, playerBox } = this.getEl
    videoProgressBar.onmousedown = () => {
      document.onmousemove = (ev) => {
        ev.preventDefault()
        let position = ev.clientX - controlBox.offsetLeft - playerBox.offsetLeft
        const maxMovePoint = videoProgressLine.offsetWidth - videoProgressBar.offsetWidth
        if (position > maxMovePoint) {
          position = maxMovePoint
        } else if (position < 0) {
          position = 0
        }
        const currentTime = (position / maxMovePoint) * this.player.duration

        this.seekTo(currentTime)
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
      this.showLogo()
    })
  }


  // 设置播放速度
  setSpeed () {
    const { speedPanel } = this.getEl
    for (let i = 0; i < this.speed.length; i++) {
      if (speedPanel.children[i].innerHTML === '1') {
        speedPanel.children[i].className = 'panelActive'
      } else {
        speedPanel.children[i].className = ''
      }

      speedPanel.children[i].addEventListener('click', () => {
        this.player.playbackRate = this.speed[i]
        for (let j = 0; j < this.speed.length; j++){
          if (this.player.playbackRate === this.speed[j]) {
            speedPanel.children[j].className = 'panelActive'
          } else {
            speedPanel.children[j].className = ''
          }
        }
        speedPanel.style.cssText = 'display: none;'
      })
    }
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
    const { volumeLine, volumeBar, volumeBox, playerBox } = this.getEl
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

        this.setVolume(volumeSize)
      }
    }
  }

  setVolume (volume: number) {
    console.log(volume)
    this.player.volume = volume

    const { volumeLine, volumeBar, volumeProgress } = this.getEl
    const position = Number((this.player.volume / 1).toFixed(2)) * volumeLine.offsetWidth
    volumeProgress.style.width = position + 'px'
    volumeBar.style.left = position - 1 + 'px'

    this.volumeChangeIcon()
  }

  // 点击调整音量大小
  volume () {
    const { volumeLine, volumeBar, volumeProgress } = this.getEl
    console.log(volumeProgress)
    volumeLine.addEventListener('click', (e: MouseEvent) => {
      let position = e.offsetX
      console.log(position)
      if (position <= 0) {
        position = 0
      } else if (position > (volumeLine.offsetWidth - volumeBar.offsetWidth)) {
        position = volumeLine.offsetWidth - volumeBar.offsetWidth
      }
      const volumeSize = Number((position / volumeLine.offsetWidth).toFixed(2))
      console.log(position / volumeLine.offsetWidth)
      this.setVolume(volumeSize)
    })
  }

  // 静音
  muted () {
    const { volumeBtn } = this.getEl
    this.player.muted = !this.player.muted
    this.player.muted ? this.volumeIcon = 'icon-guanbiyinliang' : this.volumeIcon = 'icon-yinliang'
    volumeBtn.classList.replace(volumeBtn.classList[volumeBtn.classList.length - 1], this.volumeIcon)
  }

  showLoading (showLoading = this.loading) {
    const { loading } = this.getEl
    loading.style.cssText = `display:${showLoading ? 'flex' : 'none'}`
  }

  showSetting () {
    const { setting, settingPanel, speedPanel } = this.getEl
    const panel: PanelOptions = {
      0: {
        show: false,
        name: 'speedPanel'
      }
    }
    let showPanel = false

    setting.addEventListener('click', () => {
      showPanel = !showPanel
      settingPanel.style.cssText = `display: ${showPanel ? 'block' : 'none'}`
      speedPanel.style.cssText = 'display: none;'

      for (let i = 0; i < settingPanel.children.length; i++) {
        settingPanel.children[i].addEventListener('click', () => {
          showPanel = false
          panel[i].show = true
          settingPanel.style.cssText = `display: ${showPanel ? 'block' : 'none'}`
          this.getEl[panel[i].name].style.cssText = `display: ${panel[i].show ? 'block' : 'none'}`
        })
      }
    })
  }

  showLogo (showLogo = this.playStatus) {
    const { logo } = this.getEl
    logo.style.cssText = `display:${!showLogo ? 'flex' : 'none'}`
  }
}
