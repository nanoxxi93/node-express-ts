import { NextFunction, Request, Response, Router } from 'express'
import validatorHandler from '../middlewares/validator.handler'
import { authSchema, passwordSchema } from './auth.schema'
import AuthService from './auth.service'
import { v4 as uuidv4 } from 'uuid'

const authRouter: Router = Router()
const authService = new AuthService()

authRouter.get(
  '/',
  validatorHandler(authSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const username = String(query.username)
    const password = String(query.password)

    const user: any = await authService.validateUsername({ username })

    await authService.validatePassword({
      password,
      hashedpassword: user.password,
    })

    user.token = uuidv4()

    const token = await authService.signToken(user)

    res.status(200).json({
      success: true,
      result: token,
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

    res.status(200).json({
      success: true,
      result: hash,
      message: '',
    })
  },
)

export default authRouter
