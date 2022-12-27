import { NextFunction, Request, Response } from 'express'
import logger from '../libs/winston'
import { v4 as uuidv4 } from 'uuid'

export const addVariables = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req._requestid = uuidv4()
  next()
}

export const requestLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.debug('Request', {
    _requestid: req._requestid,
    ip: req.ip,
    host: req.hostname,
    method: req.method,
    headers: req.headers,
    path: req.path,
    query: req.query,
    params: req.params,
    body: req.body,
  })
  next()
}
