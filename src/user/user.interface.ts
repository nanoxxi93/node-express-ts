export interface IUser {
  username: string
  password: string
  firstname: string
  lastname: string
  token: string
  role: string
}

export interface IUserCreateRequest {
  username: string
  password: string
  firstname: string
  lastname?: string
  status?: 'ACTIVE' | 'INACTIVE'
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR'
}

export interface IUserUpdateRequest extends Partial<IUserCreateRequest> {
  id: number
  status?: 'ACTIVE' | 'INACTIVE'
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR'
}
