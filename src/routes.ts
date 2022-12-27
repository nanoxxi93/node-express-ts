import { Express, Router } from 'express'
import authRouter from './auth/auth.router'
import healthRouter from './health/health.router'

const routerApi = (app: Express) => {
  const router = Router()
  app.use('/api/v1', router)
  router.use('/auth', authRouter)
  router.use('/health', healthRouter)
}

export default routerApi
