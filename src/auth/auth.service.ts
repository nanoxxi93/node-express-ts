import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'

class AuthService {
  constructor() {}

  async validateUsername({ username }: { username: string }) {
    if (!['admin'].includes(username)) {
      throw createHttpError(400, 'Invalid username')
    }
    return {
      id: 1,
      username,
      password: '$2a$10$.qIrd3p.LEB2mQp/laa78.jiquvsdrc3OBVB.1e547slLv22L66tG',
    }
  }

  async validatePassword({
    password,
    hashedpassword,
  }: {
    password: string
    hashedpassword: string
  }) {
    const match = await bcrypt.compare(password, hashedpassword)
    if (!match) {
      throw createHttpError(400, 'Invalid password')
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

  async hashString(text: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(text, salt)
    return hash
  }
}

export default AuthService
