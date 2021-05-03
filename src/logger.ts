import debug from 'debug'

const packageName = 'optic-express'

export default {
  log: debug(`${packageName}:log`),
  error: debug(`${packageName}:error`)
}
