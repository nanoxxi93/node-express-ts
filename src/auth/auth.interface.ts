export interface IAuth {
  username: string
  password: string
}

export interface IToken {
  iat: number
  id: number
  username: string
  password?: string
  firstname: string
  lastname: string
  token: string
  role: string
  role_description: string
  status: string
}

export class Token {
  iat: number
  id: number
  username: string
  firstname: string
  lastname: string
  token: string
  role: string
  role_description: string
  status: string
  constructor({
    iat,
    id,
    username,
    firstname,
    lastname,
    token,
    role,
    role_description,
    status,
  }: IToken) {
    this.iat = iat
    this.id = id
    this.username = username
    this.firstname = firstname
    this.lastname = lastname
    this.token = token
    this.role = role
    this.role_description = role_description
    this.status = status
  }
}
