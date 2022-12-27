import { NextFunction, Request, Response, Router } from 'express'
import createHttpError from 'http-errors'

const healthRouter: Router = Router()

healthRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      result: null,
      message: '',
    })
  },
)

healthRouter.get(
  '/error',
  async (req: Request, res: Response, next: NextFunction) => {
    throw createHttpError(400, 'Error', { code: 'ERROR' })
  },
)

export default healthRouter
