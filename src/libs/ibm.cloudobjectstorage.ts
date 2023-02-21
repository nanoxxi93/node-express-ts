import cos from 'ibm-cos-sdk'
import { v4 as uuidv4 } from 'uuid'
import logger from './winston'

class IBMCOS {
  private getS3() {
    return new cos.S3({
      endpoint: process.env.IBM_COS_ENDPOINT,
      ibmAuthEndpoint: process.env.IBM_COS_AUTH_ENDPOINT,
      apiKeyId: process.env.IBM_COS_APIKEY,
      serviceInstanceId: process.env.IBM_COS_INSTANCEID,
    })
  }

  async upload({
    _requestid,
    file,
    bucket = process.env.IBM_COS_BUCKET || '',
    foldername,
    filename,
  }: {
    _requestid: string
    file: Express.Multer.File
    bucket?: string
    foldername?: string
    filename?: string
  }): Promise<string | Error> {
    const path = foldername ? `${foldername}/` : ''
    const name = filename || file.originalname
    return new Promise((resolve: any, reject: any) => {
      this.getS3().upload(
        {
          ACL: 'public-read',
          Key: `${path}${uuidv4()}/${name}`,
          Body: file.buffer,
          Bucket: bucket,
          ContentType: file.mimetype,
        },
        (error, data) => {
          if (error) {
            logger.child({ _requestid, error }).error(`IBM COS ${name}`)
            reject(new Error(error?.message))
          }
          resolve(data.Location)
        },
      )
    })
  }
}

export default IBMCOS
