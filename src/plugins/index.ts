

export default class Plugins<T extends Function> {
    plugins: T[]
    player: object
    constructor (plugins: T[], player: object) {
        this.plugins = plugins
        this.player = player
        this.init()
    }
    init () {
      this.plugins.map(plugin => plugin.call(null, this.player))
    }
    has () {

    }
}
