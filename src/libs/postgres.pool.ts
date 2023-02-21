import pg, { Pool } from 'pg'
pg.types.setTypeParser(1114, str => str + 'Z')
pg.defaults.parseInt8 = true

import { Profiler } from 'winston'
import { DbError } from '../db/common.interface'
import logger from './winston'

class PostgresPool {
  dbConnection = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    keepAlive: true,
    max: 5,
    min: 0,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: true,
    ...(process.env.DB_SSL
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {}),
  }).connect()

  odooConnection = new Pool({
    host: process.env.ODOO_DB_HOST,
    user: process.env.ODOO_DB_USER,
    database: process.env.ODOO_DB_NAME,
    password: process.env.ODOO_DB_PASSWORD,
    port: parseInt(process.env.ODOO_DB_PORT || '5432'),
    keepAlive: true,
    max: 5,
    min: 0,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: true,
    ...(process.env.ODOO_DB_SSL
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {}),
  }).connect()

  private errorHandler(error: any, profiler: Profiler, sql: string, bind: any) {
    if (profiler) {
      profiler.done({
        _requestid: bind._requestid,
        level: 'error',
        message: `Execute ${sql}`,
        error: {
          code: error.code,
          message: error.message,
          detail: error,
        },
      })
    }
    return new DbError(error)
  }

  private async connectionHandler(bd: 'BD' | 'ODOO') {
    switch (bd) {
      case 'ODOO':
        return await this.odooConnection
      case 'BD':
      default:
        return await this.dbConnection
    }
  }

  private fixQuery(sql: string, bind: any) {
    let query = `${sql}`
    const resultRx = sql.match(/\$\w+/g)
    resultRx?.forEach((x, i) => {
      query = query.replace(x, '$' + (i + 1))
    })
    const values = resultRx?.map(x => bind[x.replace('$', '')]) || []
    return { query, values }
  }

  async pg_one<T>(
    sql: string = '',
    bind: any = {},
    bd: 'BD' | 'ODOO' = 'BD',
  ): Promise<T | DbError> {
    const profiler = logger
      .child({ _requestid: bind?._requestid, context: bind })
      .startTimer()
    const { query, values } = this.fixQuery(sql, bind)
    const client = await this.connectionHandler(bd)
    const result = await client
      .query(query, values)
      .catch(error => this.errorHandler(error, profiler, sql, bind))
    client.release()
    logger.debug('pg_many', {
      _requestid: bind._requestid,
      sql,
      bind,
    })
    if (result instanceof DbError) {
      return result
    } else {
      return <T>result.rows[0]
    }
  }

  async pg_many<T>(
    sql: string = '',
    bind: any = {},
    bd: 'BD' | 'ODOO' = 'BD',
  ): Promise<Array<T> | DbError> {
    const profiler = logger
      .child({ _requestid: bind?._requestid, context: bind })
      .startTimer()
    const { query, values } = this.fixQuery(sql, bind)
    const client = await this.connectionHandler(bd)
    const result = await client
      .query(query, values)
      .catch(error => this.errorHandler(error, profiler, sql, bind))
    client.release()
    logger.debug('pg_many', {
      _requestid: bind._requestid,
      sql,
      bind,
    })
    if (result instanceof DbError) {
      return result
    } else {
      return <T[]>result.rows
    }
  }
}

export default PostgresPool
