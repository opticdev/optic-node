import commandExists from 'command-exists'
import Boom from '@hapi/boom'
import { formatHttpRequest, formatHttpResponse } from '@elastic/ecs-helpers'
import logger from './logger'
import { getUserAgent } from 'universal-user-agent'
import fetch from 'node-fetch'
import fs from 'fs'

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

  constructor(options: IOptions) {
    this.config = {}
    this.config.enabled = options.enabled || false
    this.config.uploadUrl = options.uploadUrl || (process.env.OPTIC_LOGGING_URL ? process.env.OPTIC_LOGGING_URL + 'ecs' : '')
    this.config.console = options.console || Boolean(process.env.OPTIC_CONSOLE) || false
    this.config.log = options.log || Boolean(process.env.OPTIC_LOG) || false
    this.userAgent = this.buildUserAgent(options.framework)
  }

  buildUserAgent(framework?: string): string {
    return getUserAgent() + ((framework) ? framework : '')
  }

  static cliCommand() {
    return 'api'
  }

  async checkOpticCommand() {
    const opticInstalled = await commandExists(Optic.cliCommand())
    if (!opticInstalled) {
      const errMsg = 'Please install the Optic CLI: https://useoptic.com/docs/'
      logger.error(errMsg)
      throw Boom.failedDependency(errMsg)
    }
    return true
  }

  // @TODO use tag for user agent
  static formatObject(req: any, res: any, hydrate?: IHydrateBody) {
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

  sendToConsole(obj: any) {
    if (this.config.console) {
      logger.log('Optic logging to terminal')
      console.log(JSON.stringify(obj))
    }
  }

  sendToLogFile(obj: any) {
    if (this.config.log) {
      logger.log('Optic logging to logfile')
      const logLine = JSON.stringify(obj) + '\n';
      fs.appendFile('./optic.log', logLine, function (err) {
        if (err) logger.error(err);
      });
    }
  }

  async sendToUrl(obj: any) {
    logger.log('Optic logging to @useoptic/cli')
    try {
      logger.log(`Uploading to ${this.config.uploadUrl}`)
      fetch(String(this.config.uploadUrl), {
        method: 'post',
        body: JSON.stringify([obj]),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      logger.error(error)
    }
  }

  captureHttpRequest(req: any, res: any, hydrate?: IHydrateBody): void {
    if (this.config.enabled) {
      try {
        this.checkOpticCommand();
      } catch (error) {
        console.error(error)
      }
      logger.log('Optic logging request')
      const httpObj = Optic.formatObject(req, res, hydrate)
      // Add optic information
      httpObj.optic = {
        user: this.userAgent,
      }
      if (this.config.console) this.sendToConsole(httpObj)
      if (this.config.log) this.sendToLogFile(httpObj)
      if (this.config.uploadUrl) this.sendToUrl(httpObj)
    }
  }
}
