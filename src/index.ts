import express from 'express'
import logger from './logger'
import Optic from './optic'
import { PassThrough } from 'stream'

interface Options {
    cli?: false,
    console?: false,
    dev?: false,
}

export default (options: Options) => {
  logger.log('Optic middleware loaded')
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const optic = new Optic(options)
      const defaultWrite = res.write.bind(res)
      const defaultEnd = res.end.bind(res)
      const ps = new PassThrough()
      const chunks: any = []

      ps.on('data', data => chunks.push(data))
      res.write = (chunk: any, cb: any) => {
        ps.write(chunk, cb)
        return defaultWrite(chunk, cb)
      }
      res.end = (cb: any) => {
        ps.end(cb)
        return defaultEnd(cb)
      }
      res.on('close', () => {
        optic.captureHttpRequest(req, res, {
          request: (req: express.Request) => { return req.body },
          response: () => { return Buffer.concat(chunks).toString() }
        })
      })
      next()
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }
}
