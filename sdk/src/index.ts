import { formatHttpRequest, formatHttpResponse } from '@elastic/ecs-helpers'
import logger from './logger'
import { getUserAgent } from 'universal-user-agent'
import fetch from 'node-fetch'

interface IOptions {
  enabled?: boolean,
  uploadUrl?: string,
  console?: boolean,
  log?: boolean,
  framework?: string,
}

interface IHydrateBody {
  response?: Function
  request?: Function
}

export default class Optic {
  protected config: IOptions;
  private userAgent: string;

  constructor (options: IOptions) {
    this.config = {}
    this.config.enabled = options.enabled || false
    this.config.uploadUrl = options.uploadUrl || (process.env.OPTIC_LOGGING_URL ? process.env.OPTIC_LOGGING_URL + 'ecs' : '')
    this.config.console = options.console || Boolean(process.env.OPTIC_CONSOLE) || false
    this.config.log = options.log || Boolean(process.env.OPTIC_LOG) || false
    this.userAgent = this.buildUserAgent(options.framework)
  }

  buildUserAgent (framework?: string): string {
    return getUserAgent() + ((framework) ? ' ' + framework : '')
  }

  // @TODO use tag for user agent
  static formatObject (req: any, res: any, hydrate?: IHydrateBody) {
    const httpObj = {
      http: {
        response: {},
        request: {}
      },
      optic: {}
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
    if (this.config.console) {
      logger.log('Optic logging to terminal')
      console.log(JSON.stringify(obj))
    }
  }

  async sendToUrl (obj: any) {
    logger.log('Optic logging to @useoptic/cli')
    try {
      logger.log(`Uploading to ${this.config.uploadUrl}`)
      fetch(String(this.config.uploadUrl), {
        method: 'post',
        body: JSON.stringify([obj]),
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      logger.error(error)
    }
  }

  captureHttpRequest (req: any, res: any, hydrate?: IHydrateBody): void {
    if (this.config.enabled) {
      logger.log('Optic logging request')
      const httpObj = Optic.formatObject(req, res, hydrate)
      // Add optic information
      // httpObj.optic = {
      //   agent: this.userAgent
      // }
      if (this.config.console) this.sendToConsole(httpObj)
      if (this.config.uploadUrl) this.sendToUrl(httpObj)
    }
  }
}
