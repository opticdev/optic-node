import debug from 'debug'

const packageName = 'optic-hapi'

export default {
  log: debug(`${packageName}:log`),
  error: debug(`${packageName}:error`)
}
