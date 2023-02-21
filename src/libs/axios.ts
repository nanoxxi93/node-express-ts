import logger from './winston'
import axios, { AxiosResponse } from 'axios'

class AxiosRequest {
  send = async ({
    _requestid,
    method,
    url,
    data = undefined,
    headers = undefined,
    timeout,
  }: {
    _requestid: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
    url: string
    data?: any
    headers?: any
    timeout?: number
  }): Promise<AxiosResponse> => {
    const profiler = logger.startTimer()

    return await axios({
      method,
      url,
      data,
      headers,
      timeout: timeout || 600000,
    })
      .then(r => {
        profiler.done({
          level: 'debug',
          _requestid,
          message: `Request to ${url}`,
          status: r.status,
          input: data,
          output: r.data,
        })
        return r
      })
      .catch(r => {
        profiler.done({
          level: 'warn',
          _requestid,
          message: `Request to ${url}`,
          status: r.status,
          input: data,
          output: r.data,
        })
        return { ...r.response, _error: true }
      })
  }
}

export default AxiosRequest
