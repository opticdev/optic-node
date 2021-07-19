import Hapi from '@hapi/hapi'
import logger from './logger'
import Optic from '@useoptic/optic-node-sdk'

interface IOptions {
  enabled?: false,
  console?: false,
  log?: false,
  uploadUrl?: string,
}

const HapiOpticPlugin = {
  register: (server: Hapi.Server, options: IOptions) => {
    logger.log('Optic plugin loaded')
    const optic = new Optic({
      ...options,
      framework: 'Hapi'
    })
    server.ext('onPostResponse', (r: any, h: any) => {
      const { req, res } = r.raw
      optic.captureHttpRequest(req, res, {
        request: () => {
          return r.payload
        },
        response: () => {
          return r.response.source
        }
      })
      return h.continue
    })
  },
  pkg: require('../package.json')
}

export const OpticPlugin = HapiOpticPlugin
export default HapiOpticPlugin
