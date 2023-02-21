export class DbError {
  code: string
  message: string
  stack?: string

  constructor(error: any) {
    this.code = error?.code
    this.message = error?.message
    if (error.stack) {
      this.stack = error.stack
    }
  }
}

export interface IDbId {
  id: number
}
