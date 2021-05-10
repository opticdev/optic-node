import express from 'express'
import logger from './logger'
import Optic from './optic'

interface Options {
    capture?: false,
    dev?: false,
}

export default (options: Options) => {
  logger.log('Optic middleware loaded')
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const optic = new Optic(options)
      res.on('close', () => {
        optic.captureHttpRequest(req, res)
      })
      next()
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }
}
