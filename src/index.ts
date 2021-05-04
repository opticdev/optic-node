import express from 'express'
import logger from './logger'
import ObjectFormat from './object-format'
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
            query:  ObjectFormat(query),
            headers: ObjectFormat(headers),
            body: {
              contentType: headers['content-type'],
              value: ObjectFormat(body),
            }
          },
          response: {
            statusCode: statusCode,
            headers: ObjectFormat(responseHeaders),
            body: {
              contentType: 'application/json',
              value: ObjectFormat(''),
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
