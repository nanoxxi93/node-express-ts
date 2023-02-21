import createHttpError from 'http-errors'
import { DbError } from '../db/common.interface'
import { IDbRole } from '../db/role/role.db.dto'
import roleDbFunctions from '../db/role/role.db.functions'
import SequelizePool from '../libs/sequelize'

const sequelizePool = new SequelizePool()

class RoleService {
  async list({ _requestid }: { _requestid: string }) {
    const result = await sequelizePool.pg_many<IDbRole>(
      roleDbFunctions.UFN_ROLE_SEL.query,
      {
        _requestid,
      },
    )
    if (result instanceof DbError) {
      throw createHttpError(400, result)
    }
    return result
  }
}

export default RoleService
