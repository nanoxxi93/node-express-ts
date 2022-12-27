import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export const authBearer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const SECRET = process.env.SECRET!
  const auth = req.headers.authorization

  if (!auth?.startsWith('Bearer ')) {
    next(
      createHttpError(401, 'Unauthorized', {
        code: 'No token',
      }),
    )
  }

  const token = auth?.substring(7, auth.length) || ''

  const jsonwt: any = jwt.verify(token, SECRET)

  if (!jsonwt) {
    next(
      createHttpError(401, 'Unauthorized', {
        code: 'Invalid token',
      }),
    )
  }

  req._user = jsonwt.user
  next()
}
