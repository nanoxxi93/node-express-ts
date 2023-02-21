import Joi from 'joi'

export const fileFormSchema = Joi.object({
  buffer: Joi.binary().required(),
  encoding: Joi.string(),
  fieldname: Joi.string().required(),
  mimetype: Joi.string().required(),
  originalname: Joi.string().required(),
  size: Joi.number(),
})
