import { NextFunction, Request, Response, Router } from 'express'
import validatorHandler from '../middlewares/validator.handler'
import { authSchema, passwordSchema } from './auth.schema'
import AuthService from './auth.service'
import { AuthRequestDto } from './auth.dto'

const authRouter: Router = Router()
const authService = new AuthService()

authRouter.post(
  '/',
  validatorHandler(authSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    const body: AuthRequestDto = { ...req.body }
    const result = await authService.auth({
      _requestid: req._requestid || '',
      body,
    })
    return res.status(200).json({
      success: true,
      result: result,
      message: '',
    })
  },
)

authRouter.get(
  '/hash',
  validatorHandler(passwordSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const password = String(query.password)
    const hash = await authService.hashString(password)
    return res.status(200).json({
      success: true,
      result: hash,
      message: '',
    })
  },
)

export default authRouter
