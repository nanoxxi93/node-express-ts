import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import logger from '../libs/winston'

const errorCodes: any = {
  '23505': 'ALREADY_EXISTS_RECORD',
  '22012': 'DIVISON_BY_ZERO',
  '22001': 'PARAMETER_TOO_LONG',
  '23502': 'NULL_NOT_ALLOWED',
  '42601': 'SINTAX_ERROR',
  '42883': 'FUNCTION_NOT_EXISTS',
}

export const errorLog = async (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error_body = {
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
      stack: ![400, 401, 404].includes(err?.statusCode) ? err.stack : '',
    },
  }
  switch (err?.level) {
    case 'warn':
    case 'warning':
      logger.warn(err.message, error_body)
      break
    default:
      logger.error(err.message, error_body)
      break
  }
}

export const errorLogBackground = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await errorLog(
    {
      status: 500,
      statusCode: 500,
      message: `${err}`,
      expose: false,
      name: '',
    },
    req,
    res,
    next,
  )
}

export const errorLogMiddleware = async (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await errorLog(err, req, res, next)
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
    message: err?.code ? errorCodes[err.code] || err.message : err.message,
  })
}
