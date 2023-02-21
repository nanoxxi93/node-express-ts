import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import logdnaWinston from 'logdna-winston'

const levels = {
  error: 0, //error on catch exception
  warn: 1, //error on request from api
  info: 2, //input and output on request + requests to our api
  debug: 3, //queries on trigger functions
}

const env = process.env.NODE_ENV || 'development'
const appname = process.env.APP_NAME || 'odoo_middleware'
const logdnaUrl =
  process.env.LOGDNA_URL || 'https://logs.logdna.com/logs/ingest'
const logdnaKey = process.env.LOGDNA_KEY || ''
const logLevel = process.env.LOG_LEVEL || 'info'
const logDisk = process.env.LOG_DISK === 'true'

//options to logDNA
const options = {
  key: logdnaKey,
  url: logdnaUrl,
  app: `${appname}_${env}`,
  env: env,
  level: logLevel, // Default to debug, maximum level of log, doc: https://github.com/winstonjs/winston#logging-levels
  indexMeta: true, // Defaults to false, when true ensures meta object will be searchable
}

const logger = createLogger({
  levels,
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    ...(logDisk
      ? [
          new transports.DailyRotateFile({
            dirname: './logs',
            filename: 'all-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
          }),
          new transports.DailyRotateFile({
            dirname: './logs',
            filename: 'err-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
          }),
        ]
      : []),
  ],
  ...(logDisk
    ? {
        exceptionHandlers: [
          new transports.DailyRotateFile({
            dirname: './logs',
            filename: 'exceptions-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
          }),
        ],
        rejectionHandlers: [
          new transports.DailyRotateFile({
            dirname: './logs',
            filename: 'rejections-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
          }),
        ],
      }
    : {}),
  exitOnError: false,
})

if (env !== 'development') {
  if (logdnaKey) {
    logger.add(new logdnaWinston(options))
  }
}

export default logger
