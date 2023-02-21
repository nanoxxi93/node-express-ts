import { Express, Router } from 'express'
import authRouter from './auth/auth.router'
import healthRouter from './health/health.router'
import roleRouter from './role/role.router'
import userRouter from './user/user.router'

const routerApi = (app: Express) => {
  const router = Router()
  app.use('/api/v1', router)
  router.use('/health', healthRouter)
  router.use('/auth', authRouter)
  router.use('/role', roleRouter)
  router.use('/user', userRouter)
}

export default routerApi
