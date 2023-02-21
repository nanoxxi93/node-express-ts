import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { Token } from '../auth/auth.interface'

export const authBearer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const SECRET = process.env.SECRET!
  const auth = req.headers.authorization

  if (!auth?.startsWith('Bearer ')) {
    throw createHttpError(401, {
      level: 'warn',
      code: 401,
      message: 'No token',
    })
  }

  const token = auth?.substring(7, auth.length) || ''

  const jsonwt: any = jwt.verify(token, SECRET)

  if (!jsonwt) {
    throw createHttpError(401, {
      level: 'warn',
      code: 401,
      message: 'Invalid token',
    })
  }

  req._user = new Token({ ...jsonwt })
  next()
}

export const roleCheck = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req._user && !req._user.role) {
      next(
        createHttpError(401, {
          level: 'warn',
          code: 401,
          message: 'Invalid user role',
        }),
      )
    }
    if (!roles.includes(req._user.role)) {
      next(
        createHttpError(401, {
          level: 'warn',
          code: 401,
          message: 'Insufficient permissions',
        }),
      )
    }
    next()
  }
}
