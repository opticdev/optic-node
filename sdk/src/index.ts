import commandExists from 'command-exists'
import Boom from '@hapi/boom'
import { formatHttpRequest, formatHttpResponse } from '@elastic/ecs-helpers'
import logger from './logger'
import { spawn } from 'cross-spawn'
import { getUserAgent } from 'universal-user-agent'
import fetch from 'node-fetch'

interface Options {
  dev?: boolean,
  local?: boolean,
  console?: boolean,
  framework?: string,
}

interface HydrateBody {
  response?: Function
  request?: Function
}

export default class Optic {
  protected config: Options;
  private userAgent: string;
  private opticHTTPReceiver = 'OpticHTTPReceiver';
  private localclihttp: string = '';

  // @TODO add user agent details - Language/Version/Framework/OpticVersion/PackageVersion
  constructor(options: Options) {
    this.config = {}
    this.config.dev = options.dev || false
    this.config.local = options.local || Boolean(process.env.OPTIC_LOCAL) || false
    this.config.console = options.console || Boolean(process.env.OPTIC_CONSOLE) || false
    this.userAgent = this.buildUserAgent(options.framework)

    if (this.config.local && this.localclihttp === '') {
      this.getLocalHttpReceiver()
    }
  }

  buildUserAgent(framework?: string): string {
    return getUserAgent() + ((framework) ? framework : '')
  }

  static cliCommand(dev: undefined | boolean) {
    if(dev && process.env.OPTIC_APIDEV_PATH) {
      return process.env.OPTIC_APIDEV_PATH
    }
    return 'api' + ((dev) ? 'dev' : '')
  }

  async checkOpticCommand() {
    const opticInstalled = await commandExists(Optic.cliCommand(this.config.dev))
    if (!opticInstalled) {
      // @TODO return as warning
      const errMsg = 'Please install the Optic CLI: https://useoptic.com/docs/'
      logger.error(errMsg)
      throw Boom.failedDependency(errMsg)
    }
    return true
  }

  static formatObject(req: any, res: any, hydrate?: HydrateBody) {
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

  sendToConsole(obj: any) {
    logger.log('Optic logging to terminal')
    console.log(JSON.stringify(obj))
  }

  async getLocalHttpReceiver() {
    logger.log('Getting OpticHTTPReceiver endpoint')
    if (this.checkOpticCommand()) {
      const child = spawn(Optic.cliCommand(this.config.dev), ['ingest:network'])
      child.stdout.pipe(process.stdout)
      child.stdout.on('data', (data: any) => {
        const line = data.toString('utf8');
        logger.cli(line)
        if (line.startsWith(this.opticHTTPReceiver)) {
          this.localclihttp = line.substr(this.opticHTTPReceiver.length)
            .trim()
        }
      })
      child.on('error', logger.error)
    }
  }

  async sendToLocal(obj: any) {
    logger.log('Optic logging to @useoptic/cli')
    try {
      if (this.localclihttp !== '') {
        await this.getLocalHttpReceiver()
      }
      await fetch(this.localclihttp, {
        method: 'post',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      logger.error(error)
    }
  }

  captureHttpRequest(req: any, res: any, hydrate?: HydrateBody): void {
    if (this.config.local || this.config.console) {
      this.checkOpticCommand();
      logger.log('Optic logging request')
      const httpObj = Optic.formatObject(req, res, hydrate)
      if (this.config.console) this.sendToConsole(httpObj)
      if (this.config.local) this.sendToLocal(httpObj)
    }
  }
}
