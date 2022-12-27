import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false,
  },
})

export const pg_one = async <T>(sql: string, params?: any): Promise<T> => {
  const { rows } = await pool.query(sql)
  return rows[0]
}

export const pg_many = async <T>(
  sql: string,
  params?: any,
): Promise<Array<T>> => {
  const { rows } = await pool.query(sql)
  return rows
}
