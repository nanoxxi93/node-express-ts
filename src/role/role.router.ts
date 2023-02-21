import { NextFunction, Request, Response, Router } from 'express'
import RoleService from './role.service'

const roleRouter: Router = Router()
const roleService = new RoleService()

roleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const hash = await roleService.list({
    _requestid: req._requestid || '',
  })
  return res.status(200).json({
    success: true,
    result: hash,
    message: '',
  })
})

export default roleRouter
