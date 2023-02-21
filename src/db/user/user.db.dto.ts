export interface IDbUser {
  id: number
  username: string
  password: string
  firstname: string
  lastname: string
  status: 'ACTIVE' | 'INACTIVE'
  role: string
  role_description: string
}

export interface IDbUserSimple {
  id: number
  username: string
  firstname: string
  lastname: string
  status: 'ACTIVE' | 'INACTIVE'
  role: string
  role_description: string
}

export class DtoDbUserIns {
  _requestid: string
  id: number
  username: string | null
  password: string | null
  firstname: string | null
  lastname: string | null
  status: 'ACTIVE' | 'INACTIVE' | null
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | null
  u_id: number
  constructor({
    _requestid,
    id,
    username,
    password,
    firstname,
    lastname,
    status,
    role,
    u_id,
  }: {
    _requestid?: string
    id?: number
    username?: string
    password?: string
    firstname?: string
    lastname?: string
    status?: 'ACTIVE' | 'INACTIVE'
    role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR'
    u_id: number
  }) {
    this._requestid = _requestid || ''
    this.id = id || 0
    this.username = username || null
    this.password = password || null
    this.firstname = firstname || null
    this.lastname = lastname || null
    this.status = status || null
    this.role = role
    this.u_id = u_id || 0
  }
}

export class DtoDbUserSelOne {
  _requestid: string
  id: number
  constructor({ _requestid, id }: { _requestid?: string; id?: number }) {
    this._requestid = _requestid || ''
    this.id = id || 0
  }
}
