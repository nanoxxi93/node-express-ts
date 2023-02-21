export class DtoDbAuthUserSelByUsername {
  _requestid: string
  username: string | null
  constructor({
    _requestid,
    username,
  }: {
    _requestid?: string
    username: string
  }) {
    this._requestid = _requestid || ''
    this.username = username || null
  }
}
