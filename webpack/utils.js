/*
 * @Author: last order
 * @Date: 2020-03-20 22:52:47
 * @LastEditTime: 2020-03-20 23:49:52
 */
const portFinder = require('portfinder')

exports.getPort = async () => {
  const port = await portFinder.getPortPromise({
    port: 8080,
    stopPort: 9000
  })
  return port
}
