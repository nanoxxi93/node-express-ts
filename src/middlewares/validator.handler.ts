import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { ObjectSchema } from 'joi'

const validatorHandler = <T>(
  schema: ObjectSchema<T>,
  property: 'body' | 'query' | 'params' | 'file',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property] || {}
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      if (property === 'file') {
        next(
          createHttpError(422, {
            level: 'warn',
            code: 422,
            message: 'file is required',
          }),
        )
      } else {
        next(
          createHttpError(422, {
            level: 'warn',
            code: 422,
            message: error.message,
          }),
        )
      }
    }
    next()
  }
}

export default validatorHandler
