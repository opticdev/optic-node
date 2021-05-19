import debug from 'debug'

const packageName = 'optic-node'

export default {
  log: debug(`${packageName}:log`),
  cli: debug(`${packageName}:cli`),
  error: debug(`${packageName}:error`)
}
