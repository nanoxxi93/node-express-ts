import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { ObjectSchema } from 'joi'

const validatorHandler = <T>(
  schema: ObjectSchema<T>,
  property: 'body' | 'query' | 'params',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property]
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      next(createHttpError(400, error))
    }
    next()
  }
}

export default validatorHandler
