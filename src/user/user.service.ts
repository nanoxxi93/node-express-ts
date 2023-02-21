import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import SequelizePool from '../libs/sequelize'
import { IUserCreateRequest, IUserUpdateRequest } from './user.interface'
import { IToken } from '../auth/auth.interface'
import userDbFunctions from '../db/user/user.db.functions'
import { DbError } from '../db/common.interface'
import {
  IDbUser,
  IDbUserSimple,
  DtoDbUserIns,
  DtoDbUserSelOne,
} from '../db/user/user.db.dto'

const sequelizePool = new SequelizePool()

class UserService {
  async hashString(text: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(text, salt)
    return hash
  }

  async create({
    _requestid,
    _user,
    body,
  }: {
    _requestid: string
    _user: IToken
    body: IUserCreateRequest
  }) {
    body.password = await this.hashString(body.password)
    const id = await sequelizePool.pg_one<number>(
      userDbFunctions.UFN_USER_INS.query,
      new DtoDbUserIns({
        _requestid,
        id: 0,
        username: body.username,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
        status: body.status,
        role: body.role,
        u_id: _user.id,
      }),
    )
    if (id instanceof DbError) {
      throw createHttpError(400, id)
    }
    return id
  }

  async update({
    _requestid,
    _user,
    body,
  }: {
    _requestid: string
    _user: IToken
    body: IUserUpdateRequest
  }) {
    if (body.password) {
      body.password = await this.hashString(body.password)
    }
    const id = await sequelizePool.pg_one<number>(
      userDbFunctions.UFN_USER_INS.query,
      new DtoDbUserIns({
        _requestid,
        id: body.id,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
        status: body.status,
        role: body.role,
        u_id: _user.id,
      }),
    )
    if (id instanceof DbError) {
      throw createHttpError(400, id)
    }
    return id
  }

  async list({ _requestid, _user }: { _requestid: string; _user: IToken }) {
    const result = await sequelizePool.pg_many<IDbUserSimple>(
      userDbFunctions.UFN_USER_SEL.query,
      {
        _requestid,
      },
    )
    if (result instanceof DbError) {
      throw createHttpError(400, result)
    }
    return result
  }

  async get({
    _requestid,
    _user,
    id,
  }: {
    _requestid: string
    _user: IToken
    id: number
  }) {
    const result = await sequelizePool.pg_one<IDbUser>(
      userDbFunctions.UFN_USER_SEL_ONE.query,
      new DtoDbUserSelOne({
        _requestid,
        id,
      }),
    )
    if (result instanceof DbError) {
      throw createHttpError(400, result)
    }
    return result
  }
}

export default UserService
