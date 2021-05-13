import debug from 'debug'

const packageName = 'optic-node'

export default {
  log: debug(`${packageName}:log`),
  error: debug(`${packageName}:error`)
}
