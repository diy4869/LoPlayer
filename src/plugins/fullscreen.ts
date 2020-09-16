type Player = any

const FullScreen = (player: Player) => {
    const { playerBox } = player.getEl
    const el = playerBox

    if (el?.requestFullscreen) {
        el?.requestFullscreen()
    } else if (el?.mozRequestFullScreen) {
        el.mozRequestFullScreen()
    } else if (el?.webkitRequestFullScreen) {
        el?.webkitRequestFullScreen()
    }
}

// 退出全屏
const ExitFullscreen = () => {
    // const doc = document as Document
    document.exitFullscreen()

    // if (doc.exitFullscreen) {
    //   doc.exitFullscreen()
    // } else if (doc.mozCancelFullScreen) {
    //   doc.mozCancelFullScreen()
    // } else if (doc.webkitCancelFullScreen) {
    //   doc.webkitCancelFullScreen()
    // } else {
       
    // }
}

export default (player: Player) => {
    const { fullScreen } = player.getEl

    console.log(player)
    let fullScreenIcon = ''

    player.options.fullScreen = !player.options.fullScreen

    if (player.options.fullScreen) {
        FullScreen(player)
        fullScreenIcon = 'icon-fullscreen-exit'
    } else {
        ExitFullscreen()
        fullScreenIcon = 'icon-fullscreen'
    }

    fullScreen.classList.replace(fullScreen.classList[fullScreen.classList.length - 1], fullScreenIcon)
}
