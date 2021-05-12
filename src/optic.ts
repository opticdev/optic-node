import commandExists from 'command-exists'
import Boom from '@hapi/boom'
import { formatHttpRequest, formatHttpResponse, stringify } from '@elastic/ecs-helpers'
import logger from './logger'
import { spawn } from 'child_process'

interface Options {
    dev?: boolean,
    cli?: boolean,
    console?: boolean
}

interface HydrateBody {
    response?: Function
    request?: Function
}

export default class Optic {
    protected config: Options;

    constructor (options: Options) {
      this.config = {}
      this.config.dev = options.dev || false
      this.config.cli = options.cli || Boolean(process.env.OPTIC_CLI) || false
      this.config.console = options.console || Boolean(process.env.OPTIC_CONSOLE) || false
    }

    static cliCommand (dev: undefined | boolean) {
      return 'api' + ((dev) ? 'dev' : '')
    }

    async checkOpticCommand () {
      const opticInstalled = await commandExists(Optic.cliCommand(this.config.dev))
      if (!opticInstalled) {
        const errMsg = 'Please install the Optic CLI: https://useoptic.com/docs/'
        logger.error(errMsg)
        throw Boom.failedDependency(errMsg)
      }
      return true
    }

    static formatObject (req: any, res: any, hydrate?: HydrateBody) {
      const httpObj = {
        http: {
          response: {},
          request: {}
        }
      }
      if (hydrate && hydrate.request) {
        httpObj.http.request = {
          body: { content: hydrate.request(req) }
        }
      }
      if (hydrate && hydrate.response) {
        httpObj.http.response = {
          body: { content: hydrate.response(res) }
        }
      }
      formatHttpRequest(httpObj, req)
      formatHttpResponse(httpObj, res)
      return httpObj
    }

    sendToConsole (obj: any) {
      logger.log('Optic logging to terminal')
      console.log(JSON.stringify(obj))
    }

    sendToCli (obj: any) {
      logger.log('Optic logging to @useoptic/cli')
      try {
        const child = spawn(Optic.cliCommand(this.config.dev), ['ingest:stdin'])
        child.stdout.pipe(process.stdout)
        child.stdin.write(JSON.stringify(obj))
        child.stdin.end()
      } catch (error) {
        logger.error(error)
      }
    }

    captureHttpRequest (req: any, res: any, hydrate?: HydrateBody): void {
      if (this.config.cli || this.config.console ) {
        logger.log('Optic logging request')
        const httpObj = Optic.formatObject(req, res, hydrate)
        if (this.config.console) this.sendToConsole(httpObj)
        if (this.config.cli) this.sendToCli(httpObj)
      }
    }
}
