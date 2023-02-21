import { NextFunction, Request, Response } from 'express'
import logger from '../libs/winston'
import { v4 as uuidv4 } from 'uuid'

export const addVariables = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuid = uuidv4()
  req._requestid = uuid
  next()
}

export const requestLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info('Request', {
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
