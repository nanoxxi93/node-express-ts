import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import logger from '../libs/winston'

export const errorLog = async (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.message, {
    _requestid: req._requestid,
    ip: req.ip,
    host: req.hostname,
    method: req.method,
    headers: req.headers,
    path: req.path,
    query: req.query,
    params: req.params,
    body: req.body,
    error: {
      code: err?.code || 'UNDEFINED',
      stack: err.stack,
    },
  })
  next(err)
}

export const httpExceptionHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(err?.statusCode || 500).json({
    _t: new Date().toISOString(),
    errorCode: err?.code || 'ERROR',
    success: false,
    result: null,
    message: err.message,
  })
}
