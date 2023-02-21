import { NextFunction, Request, Response, Router } from 'express'
import validatorHandler from '../middlewares/validator.handler'
import { createSchema, getSchema, updateSchema } from './user.schema'
import { UserCreateRequestDto, UserUpdateRequestDto } from './user.dto'
import { authBearer, roleCheck } from '../middlewares/authorization.handler'
import UserService from './user.service'
import createHttpError from 'http-errors'
import { User } from '../libs/mongo.utils'

const userRouter: Router = Router()
const userService = new UserService()

userRouter.get(
  '/mongo/:operation',
  async (req: Request, res: Response, next: NextFunction) => {
    const { operation } = req.params
    const query = req.query
    const id = req.query._id
    delete query['_id']
    let result
    switch (operation) {
      case 'insert':
        result = await User.create(query)
        break
      case 'find':
        if (id) {
          result = await User.findById(id)
        } else {
          result = await User.findOne(query)
        }
        break
      case 'update':
        if (id) {
          result = await User.findByIdAndUpdate(id, query, { new: true })
        } else {
          result = '_id is required'
        }
        break
      case 'delete':
        if (id) {
          result = await User.findByIdAndDelete(id)
        } else {
          result = '_id is required'
        }
        break
    }
    return res.status(200).json({
      success: true,
      result: result,
      message: '',
    })
  },
)

userRouter.post(
  '/create',
  authBearer,
  roleCheck(['SUPERADMIN']),
  validatorHandler(createSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    const body: UserCreateRequestDto = { ...req.body }
    const result = await userService.create({
      _requestid: req._requestid || '',
      _user: req._user,
      body,
    })
    return res.status(200).json({
      success: true,
      result: result,
      message: '',
    })
  },
)

userRouter.post(
  '/update',
  authBearer,
  validatorHandler(updateSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    const body: UserUpdateRequestDto = { ...req.body }

    if (!['SUPERADMIN'].includes(req._user.role)) {
      if (req._user.id != body.id) {
        throw createHttpError(401, 'Unauthorized')
      }
    }

    const result = await userService.update({
      _requestid: req._requestid || '',
      _user: req._user,
      body,
    })
    return res.status(200).json({
      success: true,
      result: result,
      message: '',
    })
  },
)

userRouter.get(
  '/',
  authBearer,
  roleCheck(['SUPERADMIN', 'ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.list({
      _requestid: req._requestid || '',
      _user: req._user,
    })
    return res.status(200).json({
      success: true,
      result: result,
      message: '',
    })
  },
)

userRouter.get(
  '/:id',
  authBearer,
  validatorHandler(getSchema, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await userService.get({
      _requestid: req._requestid || '',
      _user: req._user,
      id: +id,
    })
    if (!['SUPERADMIN'].includes(req._user.role)) {
      if (result.role === 'SUPERADMIN') {
        throw createHttpError(401, 'Unauthorized')
      }
    }
    return res.status(200).json({
      success: true,
      result: result,
      message: '',
    })
  },
)

export default userRouter
