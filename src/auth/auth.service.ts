import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import SequelizePool from '../libs/sequelize'
import dbFunctions from '../db/auth/auth.db.functions'
import { IAuth, IToken } from './auth.interface'
import { v4 as uuidv4 } from 'uuid'
import { IDbUser } from '../db/user/user.db.dto'
import { DbError } from '../db/common.interface'
import { DtoDbAuthUserSelByUsername } from '../db/auth/auth.db.dto'

const sequelizePool = new SequelizePool()

class AuthService {
  async validateUsername({
    _requestid,
    username,
  }: {
    _requestid: string
    username: string
  }) {
    const user = await sequelizePool.pg_one<IDbUser>(
      dbFunctions.QUERY_USER_SEL_BY_USERNAME.query,
      new DtoDbAuthUserSelByUsername({
        _requestid,
        username,
      }),
    )
    if (user instanceof DbError) {
      throw user
    }
    if (!user) {
      throw createHttpError(400, {
        level: 'warn',
        code: 400,
        message: 'User does not exist',
      })
    }
    if (user.status !== 'ACTIVE') {
      throw createHttpError(400, {
        level: 'warn',
        code: 400,
        message: 'User is not active',
      })
    }
    return user
  }

  async validatePassword(password: string, hash: string) {
    const match = await bcrypt.compare(password, hash)
    if (!match) {
      throw createHttpError(400, {
        level: 'warn',
        code: 400,
        message: 'Invalid password',
      })
    }
    return true
  }

  async signToken(data: any) {
    const SECRET = process.env.SECRET!
    return new Promise((resolve: any, reject: any) => {
      jwt.sign(data, SECRET, {}, (error, token) => {
        if (error) {
          reject(createHttpError(500, 'Error sign token'))
        }
        resolve(token)
      })
    })
  }

  async auth({ _requestid, body }: { _requestid: string; body: IAuth }) {
    const user = await this.validateUsername({
      _requestid,
      username: body.username,
    })
    await this.validatePassword(body.password, user.password)
    const { password, ...user_data }: Partial<IToken> = user
    user_data.token = uuidv4()
    return await this.signToken(user_data)
  }

  async hashString(text: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(text, salt)
    return hash
  }
}

export default AuthService
