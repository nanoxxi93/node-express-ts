import dotenv from 'dotenv'
dotenv.config()

import logger from './libs/winston'
import express, { Express, Request, Response } from 'express'
import 'express-async-errors'
import createHttpError from 'http-errors'
import cors from 'cors'
import { addVariables, requestLog } from './middlewares/request.handler'
import routerApi from './routes'
import {
  errorLogMiddleware,
  httpExceptionHandler,
} from './middlewares/error.handler'

const app: Express = express()
const PORT = +(process.env.PORT || 3001)

app.use(express.json({ limit: '100mb' }))

const ORIGIN_WHITELIST = process.env.ORIGIN_WHITELIST?.split(',') || []
const options = {
  origin: (origin: any, callback: (err: any, options?: any) => void) => {
    if (ORIGIN_WHITELIST.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(createHttpError(403, 'Forbidden'))
    }
  },
}
app.use(cors(options))
app.use(addVariables)
app.use(requestLog)

routerApi(app)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running')
})

app.use(errorLogMiddleware)
app.use(httpExceptionHandler)

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`)
})

// import fs from 'fs'
// import https from 'https'

// const key = fs.readFileSync('./.cert/key.pem')
// const cert = fs.readFileSync('./.cert/cert.pem')
// const server = https.createServer({ key, cert }, app)

// server.listen(PORT, () => {
//   logger.info(`Server is running at https://localhost:${PORT}`)
// })
