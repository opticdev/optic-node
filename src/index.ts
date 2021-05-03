import express from 'express'
import logger from './logger'
import { v4 as uuid } from 'uuid'

interface Options {
    capture?: false,
}

export default (options: Options) => {
  logger.log('Optic middleware loaded')
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const logHTTP = options.capture || process.env.OPTIC_CAPTURE || false
      if (logHTTP) {
        logger.log('Optic logging to terminal')
        const { body, headers, path, query, method, hostname } = req
        const { statusCode } = res
        const responseHeaders = res.getHeaders()
        console.log(JSON.stringify({
          uuid: uuid(),
          request: {
            host: hostname,
            method: method,
            path: path,
            query: {
              shapeHashV1Base64: null,
              asJsonString: JSON.stringify(query),
              asText: null
            },
            headers: {
              shapeHashV1Base64: null,
              asJsonString: JSON.stringify(headers),
              asText: null
            },
            body: {
              contentType: headers['content-type'],
              value: {
                shapeHashV1Base64: 'CAASCgoEdGFzaxICCAISEAoKYXNzaWduZWRCeRICCAISDQoHZHVlRGF0ZRICCAISDAoGaXNEb25lEgIIBBIICgJpZBICCAI=',
                asJsonString: JSON.stringify(body),
                asText: null
              }
            }
          },
          response: {
            statusCode: statusCode,
            headers: {
              shapeHashV1Base64: null,
              asJsonString: JSON.stringify(responseHeaders),
              asText: null
            },
            body: {
              contentType: 'application/json',
              value: {
                shapeHashV1Base64: 'CAASCgoEdGFzaxICCAISEAoKYXNzaWduZWRCeRICCAISDQoHZHVlRGF0ZRICCAISDAoGaXNEb25lEgIIBBIICgJpZBICCAI=',
                asJsonString: null,
                asText: null
              }
            }
          },
          tags: []
        }))
      }
      next()
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }
}
