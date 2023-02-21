import pg from 'pg'
pg.types.setTypeParser(1114, str => str + 'Z')
pg.defaults.parseInt8 = true

import {
  QueryTypes,
  Sequelize,
  ConnectionError,
  ConnectionTimedOutError,
  TimeoutError,
} from 'sequelize'
import { Profiler } from 'winston'
import { DbError } from '../db/common.interface'
import logger from './winston'

class SequelizePool {
  dbConnection = new Sequelize(
    process.env.DB_NAME || '',
    process.env.DB_USER || '',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ...(process.env.DB_SSL
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : {}),
        keepAlive: true,
      },
      pool: {
        max: parseInt(process.env.DB_POOL || '1'),
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      retry: {
        match: [ConnectionError, ConnectionTimedOutError, TimeoutError],
        max: 3,
      },
    },
  )

  odooConnection = new Sequelize(
    process.env.ODOO_DB_NAME || '',
    process.env.ODOO_DB_USER || '',
    process.env.ODOO_DB_PASSWORD || '',
    {
      host: process.env.ODOO_DB_HOST,
      port: parseInt(process.env.ODOO_DB_PORT || '5432'),
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ...(process.env.ODOO_DB_SSL
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : {}),
        keepAlive: true,
      },
      pool: {
        max: parseInt(process.env.DB_POOL || '1'),
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      retry: {
        match: [ConnectionError, ConnectionTimedOutError, TimeoutError],
        max: 3,
      },
    },
  )

  private errorHandler(error: any, profiler: Profiler, sql: string, bind: any) {
    const code = error?.parent?.code || 'ERROR'
    const message = error?.parent?.message || error?.message
    if (profiler) {
      profiler.done({
        _requestid: bind._requestid,
        level: 'error',
        message: `Execute ${sql}`,
        error: {
          code: code,
          message: message,
          detail: error,
        },
      })
    }
    return new DbError({ code, message })
  }

  private connectionHandler(bd: 'BD' | 'ODOO'): Sequelize {
    switch (bd) {
      case 'ODOO':
        return this.odooConnection
      case 'BD':
      default:
        return this.dbConnection
    }
  }

  async pg_one<T>(
    sql: string = '',
    bind: any = {},
    bd: 'BD' | 'ODOO' = 'BD',
  ): Promise<T | DbError> {
    const profiler = logger
      .child({ _requestid: bind?._requestid, context: bind })
      .startTimer()
    const result = await this.connectionHandler(bd)
      .query(sql, {
        type: QueryTypes.SELECT,
        bind,
        plain: true,
      })
      .catch(error => this.errorHandler(error, profiler, sql, bind))
    logger.debug('pg_one', {
      _requestid: bind._requestid,
      sql,
      bind,
    })
    return <T>result
  }

  async pg_many<T>(
    sql: string = '',
    bind: any = {},
    bd: 'BD' | 'ODOO' = 'BD',
  ): Promise<Array<T> | DbError> {
    const profiler = logger
      .child({ _requestid: bind?._requestid, context: bind })
      .startTimer()
    const result = await this.connectionHandler(bd)
      .query(sql, {
        type: QueryTypes.SELECT,
        bind,
      })
      .catch(error => this.errorHandler(error, profiler, sql, bind))
    logger.debug('pg_many', {
      _requestid: bind._requestid,
      sql,
      bind,
    })
    return <T[]>result
  }
}

export default SequelizePool
